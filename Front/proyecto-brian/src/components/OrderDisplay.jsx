import React, { useState, useEffect } from "react";
import { OrderItemDisplay } from "./OrderItemDisplay";
import OrderMessages from "./OrderMessages";
import { getUnreadCount, markMessagesAsRead } from "../services/orderService";

const OrderDisplay = ({ order, isExpanded, onToggleExpand, onAction }) => {
  const [showMessages, setShowMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchUnreadCount = async () => {
      if (!order?.id) return;
      try {
        const count = await getUnreadCount(order.id);
        if (isMounted) setUnreadCount(count);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnreadCount();
    return () => { isMounted = false; };
  }, [order?.id]);

  const handleOpenMessages = async () => {
    setShowMessages(true);
    if (unreadCount > 0) {
      try {
        await markMessagesAsRead(order.id);
        setUnreadCount(0);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleActionClick = (actionType) => {
    if (typeof onAction === "function") {
      onAction(order.id, actionType);
    } else {
      console.warn("onAction no está definido para OrderDisplay");
    }
  };

  const formatDate = (fecha) => {
    if (!fecha) return "No disponible";
    try {
      return new Date(fecha).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires"
      });
    } catch {
      return "No disponible";
    }
  };

  return (
    <div className="order-card">
      <div className="order-summary" style={{ cursor: "pointer" }} onClick={() => onToggleExpand(order.id)}>
        <p><strong>ID Orden:</strong> {order.id}</p>
        <p><strong>Fecha/Hora:</strong> {formatDate(order.fechaHora)}</p>
        <p><strong>Usuario:</strong> {order.userName || order.userId}</p>
        <p><strong>Estado:</strong> {["Cancelada","Pendiente","En Proceso","Finalizada"][order.estadoPedido]}</p>
        <p><strong>Total:</strong> ${order.total}</p>
      </div>

      {isExpanded && (
        <div className="order-details">
          <h5>Productos:</h5>
          {order.orderItems.map(item => (
            <OrderItemDisplay key={item.id} item={item} pagada={order.pagada} />
          ))}

          <div className="order-actions">
            {order.estadoPedido === 1 && <>
              <button className="btn confirm" onClick={() => handleActionClick("confirm")}>Confirmar</button>
              <button className="btn cancel" onClick={() => handleActionClick("cancel")}>Cancelar</button>
            </>}
            {order.estadoPedido === 2 && !order.pagada && <>
              <button className="btn pay" onClick={() => handleActionClick("pay")}>Marcar como pagada</button>
              <button className="btn cancel" onClick={() => handleActionClick("cancel")}>Cancelar</button>
            </>}
            {order.estadoPedido === 2 && order.pagada &&
              <button className="btn finalize" onClick={() => handleActionClick("finalize")}>Finalizar</button>
            }
          </div>

          <button className="btn messages-btn" onClick={handleOpenMessages}>
            Ver Mensajes ({unreadCount})
          </button>
        </div>
      )}

      <OrderMessages
        orderId={order.id}
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
        onUnreadCountChange={(orderId, count) => setUnreadCount(count)}
      />
    </div>
  );
};

export default OrderDisplay;