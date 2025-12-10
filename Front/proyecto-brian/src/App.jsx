import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import ProductList from "./components/ProductList.jsx";
import CartSlide from "./components/CartSlide.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import OrdersSlide from "./components/OrdersSlide.jsx";
import PendingOrdersPage from "./components/PendingOrdersPage.jsx";

// ==========================================
// PROTECCIONES
// ==========================================
const RequireAuth = ({ children }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const BlockIfLogged = ({ children }) => {
  const { user } = useUser();
  if (user) return <Navigate to="/home" replace />;
  return children;
};

const RequirePermission = ({ permissionKey, children }) => {
  const { user } = useUser();
  if (!user || (permissionKey === "viewAdminPanel" && user.role !== "Admin")) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ==========================================
// RUTAS
// ==========================================
const AppRoutes = ({ openUserOrders, openCart }) => (
  <>
    <Navbar openUserOrders={openUserOrders} openCart={openCart} />
    <main className="app-content">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/login" element={<BlockIfLogged><LoginForm /></BlockIfLogged>} />
        <Route path="/register" element={<BlockIfLogged><RegisterForm /></BlockIfLogged>} />
        <Route path="/admin-panel" element={<RequirePermission permissionKey="viewAdminPanel"><AdminPanel /></RequirePermission>} />
        <Route path="/pending-orders" element={<RequirePermission permissionKey="viewAdminPanel"><PendingOrdersPage /></RequirePermission>} />
        <Route path="*" element={<p>404 - Página no encontrada</p>} />
      </Routes>
    </main>
  </>
);

// ==========================================
// CONTENIDO PRINCIPAL (usa contexto)
// ==========================================
const AppContent = ({ isOrdersOpen, setIsOrdersOpen, isCartOpen, setIsCartOpen }) => {
  const { sessionExpired, closeToast } = useUser();

  return (
    <>
      <AppRoutes
        openUserOrders={() => setIsOrdersOpen(true)}
        openCart={() => setIsCartOpen(true)}
      />

      <OrdersSlide
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <CartSlide
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <Footer />

      {sessionExpired && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "red",
            color: "white",
            padding: "15px 25px",
            borderRadius: "8px",
            zIndex: 9999,
          }}
        >
          Sesión expirada. Por favor, ingresa de nuevo.
          <button
            onClick={closeToast}
            style={{
              marginLeft: "15px",
              background: "white",
              color: "red",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>
      )}
    </>
  );
};

// ==========================================
// APP PRINCIPAL
// ==========================================
const App = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <UserProvider>
      <Router>
        <AppContent
          isOrdersOpen={isOrdersOpen}
          setIsOrdersOpen={setIsOrdersOpen}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
      </Router>
    </UserProvider>
  );
};

export default App;
/*

ANTES DEL CAMBIO !!!!!

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./components/Home.jsx";
import ProductList from "./components/ProductList.jsx";
import Cart from "./components/Cart.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import OrdersSlide from "./components/OrdersSlide.jsx";
import PendingOrdersPage from "./components/PendingOrdersPage.jsx";

// ==========================================
// PROTECCIONES
// ==========================================
const RequireAuth = ({ children }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const BlockIfLogged = ({ children }) => {
  const { user } = useUser();
  if (user) return <Navigate to="/home" replace />;
  return children;
};

const RequirePermission = ({ permissionKey, children }) => {
  const { user } = useUser();
  if (!user || (permissionKey === "viewAdminPanel" && user.role !== "Admin")) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ==========================================
// RUTAS
// ==========================================
const AppRoutes = ({ openUserOrders }) => {
  return (
    <>
      <Navbar openUserOrders={openUserOrders} />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="/login" element={<BlockIfLogged><LoginForm /></BlockIfLogged>} />
          <Route path="/register" element={<BlockIfLogged><RegisterForm /></BlockIfLogged>} />

          {/* Panel Admin completo *//*}
          /*
          <Route
            path="/admin-panel"
            element={
              <RequirePermission permissionKey="viewAdminPanel">
                <AdminPanel />
              </RequirePermission>
            }
          />

          {/* Órdenes pendientes *//*}
          /*
          <Route
            path="/pending-orders"
            element={
              <RequirePermission permissionKey="viewAdminPanel">
                <PendingOrdersPage />
              </RequirePermission>
            }
          />

          <Route path="*" element={<p>404 - Página no encontrada</p>} />
        </Routes>
      </main>
    </>
  );
};


// ==========================================
// APP PRINCIPAL
// ==========================================
const App = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  return (
    <UserProvider>
      <Router>
        <AppRoutes openUserOrders={() => setIsOrdersOpen(true)} />

        {/* Slide usuario *//*}
        /*
        <OrdersSlide
          isOpen={isOrdersOpen}
          onClose={() => setIsOrdersOpen(false)}
        />

        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
*/