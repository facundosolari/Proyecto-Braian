import React, { useEffect, useState, useContext, useRef } from "react";
import {
  getOrdersByUserId,
  getOrderById,
  cancelOrder,
  markMessagesAsRead,
  getUnreadCount,
  updateOrderDetalleFacturacion
} from "../services/orderService";
import { UserContext } from "../context/UserContext";
import OrderMessages from "./OrderMessages";
import BillingDetailModal from "../components/BillingDetailModal";
import "../styles/OrdersSlide.css";

const NO_IMAGE = "https://via.placeholder.com/150?text=Sin+imagen";
const BASE_URL = "https://localhost:7076";

const OrdersSlide = ({ isOpen, onClose }) => {
  const { user } = useContext(UserContext);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [messagesOpen, setMessagesOpen] = useState({});
  const [orderItemsCache, setOrderItemsCache] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [currentImages, setCurrentImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // FILTROS
  const [filterUnread, setFilterUnread] = useState(false);
  const [estado, setEstado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [sortBy, setSortBy] = useState("FechaHora");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchOrderId, setSearchOrderId] = useState("");
  const ordersPerPage = 10;

  // FACTURACIÓN
  const [showBilling, setShowBilling] = useState(false);
  const [billingDetalle, setBillingDetalle] = useState(null);

  const messagesRefs = useRef({});
  const messagesButtonsRefs = useRef({});

  // ==================================================
  // 🔥 FETCH ORDENES CON FILTROS + unreadCount
  // ==================================================
  const fetchOrdersConFiltros = async (page = 1) => {
    setLoadingOrders(true);
    try {
      const data = await getOrdersByUserId({
        page,
        pageSize: ordersPerPage,
        estado: estado !== "" ? parseInt(estado) : null,
        tieneMensajesNoLeidos: filterUnread ? true : null,
        fechaDesde: fechaDesde ? new Date(fechaDesde).toISOString() : null,
        fechaHasta: fechaHasta ? new Date(fechaHasta).toISOString() : null,
        sortBy,
        sortOrder
      });

      let normalized = (data.orders || []).map((o) => ({
        id: o.id,
        fechaHora: o.fechaHora,
        estadoPedido: o.estadoPedido,
        pagada: o.pagada,
        total: o.total,
        direccion_Envio: o.direccion_Envio,
        orderItems: o.orderItems ?? [],
        detalle_Facturacion: o.detalle_Facturacion ?? null,
        unreadCount: 0
      }));

      normalized = await Promise.all(
        normalized.map(async (o) => {
          const unread = await getUnreadCount(o.id, user.id, user.rol);
          return { ...o, unreadCount: unread };
        })
      );

      setOrders(normalized);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.totalCount / ordersPerPage));
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // ==================================================
  // 🔥 BUSCAR POR ID + unreadCount
  // ==================================================
  const handleSearchById = async () => {
    if (!searchOrderId) return;
    setLoadingOrders(true);
    try {
      const data = await getOrderById(parseInt(searchOrderId));
      if (data) {
        let normalized = [{
          id: data.id,
          fechaHora: data.fechaHora,
          estadoPedido: data.estadoPedido,
          pagada: data.pagada,
          total: data.total,
          direccion_Envio: data.direccion_Envio,
          orderItems: data.orderItems ?? [],
          detalle_Facturacion: data.detalle_Facturacion ?? null,
          unreadCount: 0
        }];

        normalized = await Promise.all(
          normalized.map(async (o) => {
            const unread = await getUnreadCount(o.id, user.id, user.rol);
            return { ...o, unreadCount: unread };
          })
        );

        setOrders(normalized);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        setOrders([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error buscando orden por ID:", error);
      setOrders([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoadingOrders(false);
    }
  };

  // ==================================================
  // 🔥 USE EFFECT PRINCIPAL
  // ==================================================
  useEffect(() => {
    if (isOpen && user && !searchOrderId) fetchOrdersConFiltros(1);
  }, [isOpen, user, filterUnread, estado, fechaDesde, fechaHasta, sortBy, sortOrder, searchOrderId]);

  // ==================================================
  // 🔥 FUNCIONES AUXILIARES
  // ==================================================
  const getEstadoTexto = (o) => {
    switch (o.estadoPedido) {
      case 0: return "Cancelada";
      case 1: return "Pendiente";
      case 2: return "En Proceso";
      case 3: return "Finalizada";
      default: return "Desconocido";
    }
  };

  const isCancelable = (o) =>
    !o.pagada && o.estadoPedido !== 0 && o.estadoPedido !== 3;

  const formatDate = (fecha) => {
    if (!fecha) return "No disponible";
    try {
      return new Date(fecha).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch { return "No disponible"; }
  };

  const buildImageUrl = (f) => {
    if (!f) return NO_IMAGE;
    if (f.startsWith("/images/products/") || f.startsWith("http"))
      return BASE_URL + f.replace(BASE_URL, "");
    return `${BASE_URL}/images/products/${f}`;
  };

  // ==================================================
  // 🔥 DETALLE ORDEN
  // ==================================================
  const toggleOrderDetail = async (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

    if (!orderItemsCache[orderId] && !loadingItems[orderId]) {
      setLoadingItems((prev) => ({ ...prev, [orderId]: true }));
      try {
        const data = await getOrderById(orderId);

        const items = (data.orderItems || []).map((item) => ({
          id: item.id,
          nombreProducto: item.NombreProducto ?? item.nombreProducto ?? "",
          talle: item.Talle ?? item.talle ?? "",
          precio: item.Precio ?? item.precio ?? 0,
          cantidad: item.Cantidad ?? item.cantidad ?? 0,
          subtotal: item.Subtotal ?? item.subtotal ?? 0,
          fotos: (Array.isArray(item.fotos) && item.fotos.length > 0
            ? item.fotos.map(buildImageUrl)
            : [NO_IMAGE])
        }));

        setOrderItemsCache((prev) => ({ ...prev, [orderId]: items }));

        const newCurrentImages = {};
        items.forEach((i) => { newCurrentImages[`${orderId}_${i.id}`] = 0; });
        setCurrentImages((prev) => ({ ...prev, ...newCurrentImages }));
      } finally {
        setLoadingItems((prev) => ({ ...prev, [orderId]: false }));
      }
    }
  };

  // ==================================================
  // 🔥 MENSAJES
  // ==================================================
  const toggleOrderMessages = async (orderId) => {
    const wasOpen = messagesOpen[orderId];
    setMessagesOpen((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

    if (!wasOpen) {
      try {
        await markMessagesAsRead(orderId);
        setOrders((prev) =>
          prev.map((o) => o.id === orderId ? { ...o, unreadCount: 0 } : o)
        );
      } catch {}
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const success = await cancelOrder(orderId);
      if (success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, estadoPedido: 0 } : o))
        );
      }
    } catch {}
  };

  const changeImage = (orderId, itemId, direction) => {
    const key = `${orderId}_${itemId}`;
    setCurrentImages((prev) => {
      const fotos = orderItemsCache[orderId]?.find((i) => i.id === itemId)?.fotos || [];
      if (!fotos.length) return prev;

      const current = prev[key] ?? 0;
      let next = current + direction;
      if (next < 0) next = fotos.length - 1;
      if (next >= fotos.length) next = 0;
      return { ...prev, [key]: next };
    });
  };

  // ==================================================
  // 🔥 CLICK FUERA PARA CERRAR MENSAJES
  // ==================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(messagesRefs.current).forEach((orderId) => {
        const panel = messagesRefs.current[orderId];
        const button = messagesButtonsRefs.current[orderId];
        if (panel && !panel.contains(event.target) && button && !button.contains(event.target)) {
          setMessagesOpen((prev) => ({ ...prev, [orderId]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==================================================
  // 🔥 FACTURACIÓN
  // ==================================================
  const handleOpenBilling = (detalle, orderId) => {
  if (!detalle) return;

  // Nos aseguramos que tenga id
  const detalleConId = { ...detalle, id: detalle.id ?? detalle.DetalleId ?? orderId };
  setBillingDetalle(detalleConId);
  setShowBilling(true);
};

  const handleSaveBilling = async (data) => {
    if (!data.id) return console.warn("No hay ID de detalle para actualizar");

    try {
      await updateOrderDetalleFacturacion(data.id, data);

      const updatedOrder = await getOrderById(data.orderId || data.id);

      // Actualizar items cache si está expandida
      setOrderItemsCache((prev) => ({
        ...prev,
        [updatedOrder.id]: updatedOrder.orderItems.map(item => ({
          ...item,
          fotos: item.fotos || [NO_IMAGE],
        }))
      }));

      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? { ...o, detalle_Facturacion: updatedOrder.detalle_Facturacion } : o))
      );

      setBillingDetalle(updatedOrder.detalle_Facturacion);
      setShowBilling(false);
    } catch (err) {
      console.error("Error actualizando detalle de facturación:", err);
    }
  };

  if (!user) return null;

  // ==================================================
  // 🔥 RENDER
  // ==================================================
  return (
    <>
      <div className={`orders-backdrop ${isOpen ? "visible" : ""}`} onClick={onClose} />
      <div className={`orders-slide ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        {/* FILTROS */}
        <div className="orders-filters">
          <h3>Filtros</h3>

          <label>Buscar orden por ID:</label>
          <div className="search-order-id">
            <input
              type="number"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="Ingrese ID de la orden"
            />
            <button onClick={handleSearchById}>Buscar</button>
            <button onClick={() => { setSearchOrderId(""); fetchOrdersConFiltros(1); }}>Limpiar</button>
          </div>

          <label>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="0">Cancelada</option>
            <option value="1">Pendiente</option>
            <option value="2">En Proceso</option>
            <option value="3">Finalizada</option>
          </select>

          <label>Desde:</label>
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />

          <label>Hasta:</label>
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />

          <label className="filter-checkbox">
            <input type="checkbox" checked={filterUnread} onChange={() => setFilterUnread((prev) => !prev)} />
            Solo no leídos
          </label>

          <label>Ordenar según:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="FechaHora">Fecha/Hora</option>
            <option value="Id">ID</option>
          </select>

          <label>Orden:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>

          <button className="orders-reset-btn" onClick={() => {
            setEstado(""); setFilterUnread(false); setFechaDesde(""); setFechaHasta("");
            setSortBy("FechaHora"); setSortOrder("desc"); setSearchOrderId("");
            fetchOrdersConFiltros(1);
          }}>Limpiar filtros</button>
        </div>

        {/* CONTENIDO */}
        <div className="orders-content">
          <h2>
            Órdenes de {user.nombre || user.usuario || user.email}  
            {orders.filter((o) => o.unreadCount > 0).length > 0 && (
              <span className="unread-counter">
                ({orders.filter((o) => o.unreadCount > 0).length} con mensajes nuevos)
              </span>
            )}
          </h2>

          {loadingOrders ? (
            <p className="loading">Cargando órdenes...</p>
          ) : orders.length === 0 ? (
            <p className="empty">No hay órdenes para mostrar.</p>
          ) : (
            <div className="orders-list">
              {orders.map((o) => (
                <div key={o.id} className={`order-card estado-${getEstadoTexto(o).toLowerCase().replace(/\s/g, "")}`}>
                  <div className="order-summary">
                    <p><strong>ID:</strong> {o.id}</p>
                    <p><strong>Fecha/Hora:</strong> {formatDate(o.fechaHora)}</p>
                    <p className="estado-line">
                      <strong>Estado:</strong>
                      <span className={`estado-badge estado-${getEstadoTexto(o).toLowerCase().replace(/\s/g, "")}`}>{getEstadoTexto(o)}</span>
                      <span className={`payment-badge ${o.pagada ? "pagada" : "no-pagada"}`}>{o.pagada ? "Pagada" : "No pagada"}</span>
                    </p>
                    <p><strong>Total:</strong> ${o.total}</p>
                  </div>

                  <div className="order-actions-inline">
                    <button onClick={() => toggleOrderDetail(o.id)}>
                      {expandedOrders[o.id] ? "Ocultar Detalle" : "Ver Detalle"}
                    </button>
                    <button
                      ref={(el) => (messagesButtonsRefs.current[o.id] = el)}
                      onClick={() => toggleOrderMessages(o.id)}
                    >
                      {messagesOpen[o.id]
                        ? `Ocultar Mensajes (${o.unreadCount})`
                        : `Ver Mensajes (${o.unreadCount})`}
                    </button>
                    

                    {/* 🔥 BOTÓN FACTURACIÓN MODIFICADO */}
                    <button className="billing-btn" onClick={() => handleOpenBilling(o.detalle_Facturacion, o.id)}>
                      Ver/Editar Facturación
                    </button>

                    {isCancelable(o) && <button className="cancel-btn" onClick={() => handleCancelOrder(o.id)}>Cancelar</button>}
                  </div>

                  {expandedOrders[o.id] && (
                    <div className="order-items">
                      {loadingItems[o.id] ? (
                        <p>Cargando detalle...</p>
                      ) : (
                        orderItemsCache[o.id]?.map((item) => {
                          const key = `${o.id}_${item.id}`;
                          const fotos = item.fotos || [NO_IMAGE];
                          const currentIndex = currentImages[key] || 0;
                          return (
                            <div key={item.id} className="order-item-card">
                              <div className="order-item-img-wrapper">
                                <img src={fotos[currentIndex]} alt={item.nombreProducto} className="order-item-img"
                                  onError={(e) => { if (e.target.src !== NO_IMAGE) e.target.src = NO_IMAGE; }}
                                />
                                {fotos.length > 1 && (
                                  <div className="img-controls">
                                    <button onClick={() => changeImage(o.id, item.id, -1)}>‹</button>
                                    <button onClick={() => changeImage(o.id, item.id, 1)}>›</button>
                                  </div>
                                )}
                              </div>
                              <div className="order-item-info">
                                <p><strong>Producto:</strong> {item.nombreProducto}</p>
                                <p><strong>Talle:</strong> {item.talle}</p>
                                <p><strong>Precio unitario:</strong> ${item.precio}</p>
                                <p><strong>Cantidad:</strong> {item.cantidad}</p>
                                <p><strong>Subtotal:</strong> ${item.subtotal}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {messagesOpen[o.id] && (
                    <div className="order-messages-panel" ref={(el) => (messagesRefs.current[o.id] = el)}>
                      <OrderMessages
                        orderId={o.id}
                        isOpen={true}
                        onClose={() => setMessagesOpen((prev) => ({ ...prev, [o.id]: false }))}
                        onUnreadCountChange={(orderId, unreadCount) => {
                          setOrders((prev) =>
                            prev.map((o) =>
                              o.id === orderId ? { ...o, unreadCount } : o
                            )
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="orders-pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} className={currentPage === i + 1 ? "active" : ""} onClick={() => fetchOrdersConFiltros(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 MODAL FACTURACIÓN */}
        {showBilling && (
          <BillingDetailModal
            isOpen={showBilling}
            detalle={billingDetalle}
            onClose={() => setShowBilling(false)}
            onSave={handleSaveBilling}
          />
        )}
      </div>
    </>
  );
};

export default OrdersSlide;