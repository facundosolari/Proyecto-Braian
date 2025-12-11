// src/pages/PendingOrdersPage.jsx
import React, { useState, useEffect } from "react";
import {
  getProductById,
  getProductSizeById,
  getOrderById,
  getAllProductSizes,
  confirmOrder,
  cancelOrder,
  pagoOrder,
  finalizeOrder,
  getOrdersByEstado
} from "../services/orderService";

import OrderDisplay from "../components/OrderDisplay";
import { ProductSearch } from "../components/ProductSearch";
import { OrderSearch } from "../components/OrderSearch";
import { SizeSearch } from "../components/SizeSearch";

import "../styles/PendingOrdersPage.css";
import "../styles/Search.css";

const ITEMS_PER_PAGE = 20;

export default function PendingOrdersPage() {
  const [loading, setLoading] = useState(false);

  // Buscadores
  const [productId, setProductId] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [orderId, setOrderId] = useState("");

  const [productResult, setProductResult] = useState(null);
  const [sizeResult, setSizeResult] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  const [showProductResult, setShowProductResult] = useState(false);
  const [showSizeResult, setShowSizeResult] = useState(false);
  const [showOrderResult, setShowOrderResult] = useState(false);

  // Estado de tabs
  const [selectedEstado, setSelectedEstado] = useState(1);

  // Órdenes, paginación y filtros
  const [ordersByEstado, setOrdersByEstado] = useState({});
  const [totalByEstado, setTotalByEstado] = useState({});
  const [pageByEstado, setPageByEstado] = useState({});
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [sortBy, setSortBy] = useState("FechaHora");
  const [sortOrder, setSortOrder] = useState("desc");

  // 🔥 NUEVO FILTRO: mensajes leídos/no leídos
  const [filterUnread, setFilterUnread] = useState(null);

  const estadosMap = {
    0: "Cancelado",
    1: "Pendiente",
    2: "Proceso",
    3: "Finalizado",
  };

  // --- FETCH ÓRDENES POR ESTADO PAGINADO ---
  const fetchOrdersByEstado = async (estadoKey, page = 1) => {
    setLoading(true);
    try {
      const params = {
        estadoPedido: estadoKey,
        page,
        pageSize: ITEMS_PER_PAGE,
        sortBy,
        sortOrder,
      };

      if (fechaDesde) params.fechaDesde = new Date(fechaDesde).toISOString();

      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        hasta.setHours(23, 59, 59, 999);
        params.fechaHasta = hasta.toISOString();
      }

      // 🔥 AGREGAMOS EL FILTRO NUEVO
      if (filterUnread !== null) params.tieneMensajesNoLeidos = filterUnread;

      const data = await getOrdersByEstado(params);

      setOrdersByEstado(prev => ({ ...prev, [estadoKey]: data.orders }));
      setTotalByEstado(prev => ({ ...prev, [estadoKey]: data.totalCount }));
      setPageByEstado(prev => ({ ...prev, [estadoKey]: page }));
    } catch (err) {
      console.error("Error al obtener órdenes por estado:", err);
    }
    setLoading(false);
  };

  // --- HANDLE ACCIONES SOBRE ÓRDENES ---
  const handleAction = async (targetOrderId, action) => {
    try {
      if (action === "confirm") await confirmOrder(targetOrderId);
      if (action === "cancel") await cancelOrder(targetOrderId);
      if (action === "pay") await pagoOrder(targetOrderId);
      if (action === "finalize") await finalizeOrder(targetOrderId);

      fetchOrdersByEstado(selectedEstado, pageByEstado[selectedEstado] || 1);

      if (orderResult && orderResult.id === targetOrderId) {
        const updatedOrder = await getOrderById(targetOrderId);
        const items = await Promise.all(
          updatedOrder.orderItems.map(async (item) => {
            const product = await getProductById(item.productId);
            const size = await getProductSizeById(item.productSizeId);
            return {
              ...item,
              product,
              habilitado: product?.habilitado ?? false,
              talleHabilitado: size?.habilitado ?? false,
            };
          })
        );
        setOrderResult({ ...updatedOrder, orderItems: items });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- BUSCADORES ---
  const buscarProducto = async () => {
    if (!productId) return;
    try {
      const data = await getProductById(productId);
      const allSizes = await getAllProductSizes();
      const talles = allSizes
        .filter(s => s.productId === data.id)
        .map(s => ({ id: s.id, talle: s.talle, stock: s.stock, habilitado: s.habilitado }));
      setProductResult({ ...data, talles });
      setShowProductResult(true);
    } catch {
      setProductResult(null);
      setShowProductResult(false);
    }
  };

  const buscarTalle = async () => {
    if (!sizeId) return;
    try {
      const data = await getProductSizeById(sizeId);
      setSizeResult(data);
      setShowSizeResult(true);
    } catch {
      setSizeResult(null);
      setShowSizeResult(false);
    }
  };

  const buscarOrden = async () => {
    if (!orderId) return;
    try {
      const data = await getOrderById(orderId);
      const items = await Promise.all(
        data.orderItems.map(async (item) => {
          const product = await getProductById(item.productId);
          const size = await getProductSizeById(item.productSizeId);
          return {
            ...item,
            product,
            habilitado: product?.habilitado ?? false,
            talleHabilitado: size?.habilitado ?? false,
          };
        })
      );
      setOrderResult({ ...data, orderItems: items });
      setShowOrderResult(true);
    } catch {
      setOrderResult(null);
      setShowOrderResult(false);
    }
  };

  // --- RECARGAR TODO AL CAMBIAR FILTROS ---
  useEffect(() => {
    Object.keys(estadosMap).forEach(key => {
      fetchOrdersByEstado(Number(key), 1);
    });
  }, [fechaDesde, fechaHasta, sortBy, sortOrder, filterUnread]);

  return (
    <div className="admin-panel container">
      <h2>Órdenes / Buscadores</h2>

      <div className="search-grid">
        <ProductSearch
          productId={productId}
          setProductId={setProductId}
          productResult={productResult}
          showProductResult={showProductResult}
          setShowProductResult={setShowProductResult}
          buscarProducto={buscarProducto}
        />

        <OrderSearch
          orderId={orderId}
          setOrderId={setOrderId}
          orderResult={orderResult}
          showOrderResult={showOrderResult}
          setShowOrderResult={setShowOrderResult}
          buscarOrden={buscarOrden}
          handleAction={handleAction}
        />

        <SizeSearch
          sizeId={sizeId}
          setSizeId={setSizeId}
          sizeResult={sizeResult}
          showSizeResult={showSizeResult}
          setShowSizeResult={setShowSizeResult}
          buscarTalle={buscarTalle}
        />
      </div>

      {/* --- FILTROS --- */}
      <div className="filters-container">
        <label>
          Desde:
          <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
        </label>

        <label>
          Hasta:
          <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
        </label>

        <label>
          Ordenar por:
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="FechaHora">Fecha</option>
            <option value="Id">ID</option>
          </select>
        </label>

        <label>
          Orden:
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </label>

        {/* 🔥 NUEVO FILTRO */}
        <label>
          Mensajes:
          <select
            value={filterUnread === null ? "all" : filterUnread ? "unread" : "read"}
            onChange={(e) => {
              if (e.target.value === "all") setFilterUnread(null);
              if (e.target.value === "unread") setFilterUnread(true);
              if (e.target.value === "read") setFilterUnread(false);
            }}
          >
            <option value="all">Todos</option>
            <option value="unread">No leídos</option>
            <option value="read">Leídos</option>
          </select>
        </label>
      </div>

      {/* --- TABS --- */}
      <div className="orders-tabs">
        {Object.keys(estadosMap).map(key => {
          const estadoKey = Number(key);
          const total = totalByEstado[estadoKey] || 0;
          return (
            <div
              key={estadoKey}
              className={`tab ${selectedEstado === estadoKey ? "active" : ""}`}
              onClick={() => setSelectedEstado(estadoKey)}
            >
              {estadosMap[estadoKey]} ({total})
            </div>
          );
        })}
      </div>

      {/* --- ÓRDENES --- */}
      <div className="orders-container">
        {loading && <p>Cargando órdenes...</p>}

        {ordersByEstado[selectedEstado]?.map(order => (
          <OrderDisplay
            key={order.id}
            order={order}
            isExpanded={expandedOrderId === order.id}
            onToggleExpand={(id) => setExpandedOrderId(expandedOrderId === id ? null : id)}
            onAction={handleAction}
          />
        ))}

        {!loading &&
          (!ordersByEstado[selectedEstado] || ordersByEstado[selectedEstado].length === 0) && (
            <p>No hay órdenes en este estado.</p>
          )}
      </div>

      {/* --- PAGINACIÓN --- */}
      {ordersByEstado[selectedEstado] &&
        totalByEstado[selectedEstado] > ITEMS_PER_PAGE && (
          <div className="pagination">
            <button
              onClick={() =>
                fetchOrdersByEstado(
                  selectedEstado,
                  (pageByEstado[selectedEstado] || 1) - 1
                )
              }
              disabled={(pageByEstado[selectedEstado] || 1) === 1}
            >
              Anterior
            </button>

            <span>
              {pageByEstado[selectedEstado] || 1} /{" "}
              {Math.ceil(
                (totalByEstado[selectedEstado] || 0) / ITEMS_PER_PAGE
              )}
            </span>

            <button
              onClick={() =>
                fetchOrdersByEstado(
                  selectedEstado,
                  (pageByEstado[selectedEstado] || 1) + 1
                )
              }
              disabled={
                (pageByEstado[selectedEstado] || 1) ===
                Math.ceil(
                  (totalByEstado[selectedEstado] || 0) / ITEMS_PER_PAGE
                )
              }
            >
              Siguiente
            </button>
          </div>
        )}
    </div>
  );
}
