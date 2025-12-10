export default function OrderItemCard({ item }) {
  return (
    <div style={{ borderBottom: "1px solid #ddd", padding: "5px 0" }}>
      <p>Producto: {item.nombre}</p>
      <p>Cantidad: {item.cantidad}</p>
      <p>Precio unitario: ${item.precio}</p>
    </div>
  );
}
