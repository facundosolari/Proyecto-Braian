import React from "react";
import OrderDisplay from "../components/OrderDisplay";

export const OrderSearch = ({
  orderId,
  setOrderId,
  orderResult,
  showOrderResult,
  setShowOrderResult,
  buscarOrden,
  handleAction, // recibe la función de PendingOrdersPage
  handleOpenBilling // 🔥 nueva función para abrir modal de facturación
}) => {

  // wrapper para actualizar el orderResult local al instante
  const handleActionClick = (orderId, action) => {
    if (typeof handleAction === "function") {
      handleAction(orderId, action);
    }
  };

  return (
    <div className="search-card">
      <h4>Buscar Orden</h4>
      <input
        type="text"
        placeholder="ID Orden..."
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <div className="search-buttons">
        <button onClick={buscarOrden} className="btn">Buscar</button>
        <button
          onClick={() => setShowOrderResult((prev) => !prev)}
          className="btn"
        >
          {showOrderResult ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {showOrderResult && orderResult && (
        <>
          <div className="search-overlay" onClick={() => setShowOrderResult(false)}></div>
          <div className="search-result-panel">
            <button className="close-btn" onClick={() => setShowOrderResult(false)}>×</button>
            <OrderDisplay
              order={orderResult}
              isExpanded={true}
              onAction={handleActionClick} // actualizar al instante
              onToggleExpand={() => {}} // obligatorio
              onOpenBilling={handleOpenBilling} // 🔥 facturación disponible
            />
          </div>
        </>
      )}
    </div>
  );
};