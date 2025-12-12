import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { createOrder } from "../services/orderService";
import BillingDetailModal from "../components/BillingDetailModal";
import "../styles/CartSlide.css";

const NO_IMAGE = "https://via.placeholder.com/150?text=Sin+imagen";
const BASE_URL = "https://localhost:7076";

const CartSlide = ({ isOpen, onClose }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useUser();
  const [currentImages, setCurrentImages] = useState({});
  const [showBillingModal, setShowBillingModal] = useState(false);

  // Función para construir URL de imagen completa
  const buildImageUrl = (f) => {
    if (!f) return NO_IMAGE;
    if (f.startsWith("/images/products/") || f.startsWith("http")) return BASE_URL + f.replace(BASE_URL, "");
    return `${BASE_URL}/images/products/${f}`;
  };

  // Inicializar currentImages para cada item
  useEffect(() => {
    const newImages = {};
    cart.forEach(item => {
      const key = `${item.productId}-${item.talle}`;
      newImages[key] = 0;
    });
    setCurrentImages(newImages);
  }, [cart]);

  const prevImage = (key, fotosLength) =>
    setCurrentImages(prev => ({
      ...prev,
      [key]: prev[key] === 0 ? fotosLength - 1 : prev[key] - 1
    }));

  const nextImage = (key, fotosLength) =>
    setCurrentImages(prev => ({
      ...prev,
      [key]: prev[key] === fotosLength - 1 ? 0 : prev[key] + 1
    }));

  const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ==================================================
  // 🔥 GENERAR ORDEN DESDE EL MODAL
  // ==================================================
  const handleGenerateOrder = async (billingData) => {
    if (!billingData) return;

    const orderRequest = {
      Items: cart.map(item => ({
        ProductSizeId: item.id,
        Cantidad: item.quantity
      })),
      DetalleFacturacion: billingData
    };

    try {
      await createOrder(orderRequest);
      alert("Orden generada con éxito");
      clearCart();
      setShowBillingModal(false);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al generar la orden");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`cart-slide-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className={`cart-slide ${isOpen ? "open" : ""}`} onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="cart-title">Carrito de Compras ({totalItems})</h2>

        <div className="cart-items-container">
          {cart.length === 0 && <p className="empty-cart">El carrito está vacío</p>}
          {cart.map(item => {
            const key = `${item.productId}-${item.talle}`;
            const index = currentImages[key] || 0;
            const fotos = (item.fotos || []).length > 0
              ? item.fotos.map(buildImageUrl)
              : [NO_IMAGE];

            return (
              <div key={key} className="cart-item-card">
                <div className="cart-item-img">
                  {fotos.length > 0 ? (
                    <div className="slider-container">
                      {fotos.length > 1 && (
                        <button className="slider-btn left" onClick={() => prevImage(key, fotos.length)}>‹</button>
                      )}
                      <img src={fotos[index]} alt={item.nombre} onError={(e) => { e.target.src = NO_IMAGE; }} />
                      {fotos.length > 1 && (
                        <button className="slider-btn right" onClick={() => nextImage(key, fotos.length)}>›</button>
                      )}
                    </div>
                  ) : (
                    <div className="placeholder">Sin imagen</div>
                  )}
                </div>

                <div className="cart-item-info">
                  <h4>{item.nombre}</h4>
                  <p>Talle: {item.talle}</p>
                  <p>Precio: ${item.precio}</p>

                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>

                  <div className="item-total">
                    <span>Total: ${item.precio * item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <div>
              <button className="clear-cart-btn" onClick={clearCart}>Vaciar carrito</button>
            </div>
            <div>
              <button className="generate-order-btn" onClick={() => setShowBillingModal(true)}>Generar orden</button>
            </div>
          </div>
        )}

        {/* 🔥 MODAL DE FACTURACIÓN */}
        {showBillingModal && (
          <BillingDetailModal
            isOpen={showBillingModal}
            detalle={null}
            onClose={() => setShowBillingModal(false)}
            onSave={handleGenerateOrder}
          />
        )}
      </div>
    </div>
  );
};

export default CartSlide;