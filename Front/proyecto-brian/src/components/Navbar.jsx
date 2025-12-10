import React from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Navbar({ openUserOrders, openCart }) {
  const { user, logout, cart } = useUser();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <div className="brand">
          <Link to="/" className="brand-link">
            <img src="/logo192.png" alt="logo" className="brand-logo" />
            <span className="brand-title">La Cabaña Deportiva</span>
          </Link>
        </div>

        <nav className="main-nav">
          <Link to="/products" className="nav-link">Catálogo</Link>

          {user?.role === "Admin" && (
            <>
              <Link to="/pending-orders" className="btn btn-sm outline">
                Órdenes Pendientes
              </Link>
              <Link to="/admin-panel" className="btn btn-sm primary">
                Panel Admin
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="btn btn-sm outline">Login</Link>
              <Link to="/register" className="btn btn-sm primary">Registrarse</Link>
            </>
          ) : (
            <>
              <span className="user-name">
                Hola, {user.nombre || user.usuario || user.email}
              </span>

              {user.role !== "Admin" && (
                <>
                  <button className="btn btn-sm primary" onClick={openCart}>
                    Carrito ({cartCount})
                  </button>
                  <button className="btn btn-sm outline" onClick={openUserOrders}>
                    Mis Órdenes
                  </button>
                </>
              )}

              <button className="btn btn-sm outline" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}