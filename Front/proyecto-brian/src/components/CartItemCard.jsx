import React from "react";
import { useUser } from "../context/UserContext";

const CartItemCard = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useUser();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 10px",
      borderBottom: "1px solid #ddd",
      borderRadius: 6,
      marginBottom: 4,
      backgroundColor: "#fafafa"
    }}>
      {/* Info del producto */}
      <div style={{ flex: 2 }}>
        <h4 style={{ margin: 0, fontSize: 16 }}>{item.nombre}</h4>
        <p style={{ margin: "4px 0", fontSize: 14 }}>Talle: {item.talle}</p>
        <p style={{ margin: "4px 0", fontSize: 14 }}>Precio: ${item.precio}</p>
      </div>

      {/* Cantidad */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={() => decreaseQuantity(item.id)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => increaseQuantity(item.id)}>+</button>
      </div>

      {/* Total y eliminar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <span>Total: ${item.precio * item.quantity}</span>
        <button
          onClick={() => removeFromCart(item.id)}
          style={{
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: 12
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;