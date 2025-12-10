import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { createOrder } from "../services/orderService";
import "../styles/CartSlide.css";

const CartSlide = ({ isOpen, onClose }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useUser();
  const [currentImages, setCurrentImages] = useState({});
  const [direccion, setDireccion] = useState("");

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

  // Crear orden
  const handleGenerateOrder = async () => {
    if (!direccion.trim()) {
      alert("Por favor ingresa la dirección de envío");
      return;
    }
    const orderRequest = {
      Dirección_Envio: direccion,
      Items: cart.map(item => ({
        ProductSizeId: item.id,
        Cantidad: item.quantity
      }))
    };
    try {
      await createOrder(orderRequest);
      alert("Orden generada con éxito");
      clearCart();
      setDireccion("");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al generar la orden");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`cart-slide-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose} // cerrar al click afuera
    >
      <div 
        className={`cart-slide ${isOpen ? "open" : ""}`}
        onClick={e => e.stopPropagation()} // evitar cerrar al click adentro
      >
        {/* Cerrar carrito */}
        <button className="close-btn" onClick={onClose}>×</button>

        {/* Título */}
        <h2 className="cart-title">Carrito de Compras ({totalItems})</h2>

        {/* Items del carrito */}
        <div className="cart-items-container">
          {cart.length === 0 && <p className="empty-cart">El carrito está vacío</p>}
          {cart.map(item => {
            const key = `${item.productId}-${item.talle}`;
            const index = currentImages[key] || 0;

            return (
              <div key={key} className="cart-item-card">
                {/* Imagen */}
                <div className="cart-item-img">
                  {item.fotos?.length > 0 ? (
                    <div className="slider-container">
                      <button className="slider-btn left" onClick={() => prevImage(key, item.fotos.length)}>‹</button>
                      <img src={item.fotos[index]} alt={item.nombre} />
                      <button className="slider-btn right" onClick={() => nextImage(key, item.fotos.length)}>›</button>
                    </div>
                  ) : (
                    <div className="placeholder">Sin imagen</div>
                  )}
                </div>

                {/* Información y controles */}
                <div className="cart-item-info">
                  <h4>{item.nombre}</h4>
                  <p>Talle: {item.talle}</p>
                  <p>Precio: ${item.precio}</p>

                  {/* Controles de cantidad */}
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>

                  {/* Total por item y eliminar */}
                  <div className="item-total">
                    <span>Total: ${item.precio * item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dirección de envío */}
        {cart.length > 0 && (
          <div className="shipping-address">
            <label><b>Dirección de envío</b></label>
            <input 
              type="text" 
              placeholder="Ej: Calle 123, Ciudad"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
            />
          </div>
        )}

        {/* Resumen del carrito con botones */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <div>
            <button className="clear-cart-btn" onClick={clearCart}>Vaciar carrito</button>
            </div>
            <div>
            <button className="generate-order-btn" onClick={handleGenerateOrder}>Generar orden</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSlide;