import React from "react";

export const OrderItemDisplay = ({ item, pagada }) => (
  <div style={{ marginBottom: "12px", padding: "8px", borderBottom: "1px solid #ccc" }}>
    <p><strong>Producto:</strong> {item.product?.nombre || item.nombreProducto || "Producto eliminado"} (ID: {item.productId})</p>
    <p><strong>Talle:</strong> {item.talle}</p>
    <p><strong>Cantidad:</strong> {item.cantidad}</p>
    <p><strong>Subtotal:</strong> ${item.subtotal}</p>
    <p><strong>Producto Habilitado:</strong> {item.habilitado ? "Sí" : "No"}</p>
    <p><strong>Talle Habilitado:</strong> {item.talleHabilitado ? "Sí" : "No"}</p>
    <p><strong>Pagado:</strong> {pagada ? "Sí" : "No"}</p>
  </div>
);