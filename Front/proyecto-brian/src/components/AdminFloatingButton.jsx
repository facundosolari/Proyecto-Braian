import React from "react";
import { useUser } from "../context/UserContext";

const AdminFloatingButton = ({ onClick }) => {
  const { user } = useUser();

  console.log("Render botón flotante. User:", user);

  // Solo admins
  if (!user || user.role !== "Admin") return null;

  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "35px",
        right: "35px",
        padding: "16px 22px",
        fontSize: "17px",
        borderRadius: "12px",
        background: "#ffcc00",
        border: "2px solid black",
        cursor: "pointer",
        boxShadow: "0px 6px 14px rgba(0,0,0,0.35)",
        zIndex: 9999999999999,
        pointerEvents: "auto",
      }}
    >
      Órdenes Pendientes
    </button>
  );
};

export default AdminFloatingButton;