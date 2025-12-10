import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import "./ProductCard.css";

const ProductCard = ({ product, onToggleStatus, onClick }) => {
  const { addToCart, user } = useUser();

  // seleccionar primer talle habilitado al cargar
  const firstSizeId = product.sizes?.find((s) => s.habilitado)?.id.toString() || "";
  const [selectedSizeId, setSelectedSizeId] = useState(firstSizeId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isAdmin = user?.role === "Admin";

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://localhost:7076${path}`;
  };

  const handleAddToCart = () => {
    if (!selectedSizeId) return;

    const selectedSize = product.sizes.find(
      (s) => s.id === parseInt(selectedSizeId)
    );

    addToCart({
      id: selectedSize.id,
      nombre: product.nombre,
      precio: product.precio,
      talle: selectedSize.talle,
      productId: product.id,
      fotos: product.fotos?.map(getImageUrl) || [],
    });
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (product.fotos?.length || 1) - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (product.fotos?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  // stock del talle seleccionado
  const selectedSizeStock = selectedSizeId
    ? product.sizes.find((s) => s.id === parseInt(selectedSizeId))?.stock || 0
    : null;

  return (
    <div className={`product-card ${!product.habilitado ? "disabled-product" : ""}`}>
      <div className="product-img-wrapper">
        {product.fotos?.length > 0 ? (
          <div className="slider-container">
            <button className="slider-btn left" onClick={prevImage}>‹</button>
            <img
              src={getImageUrl(product.fotos[currentImageIndex])}
              alt={product.nombre}
              className="product-img"
            />
            <button className="slider-btn right" onClick={nextImage}>›</button>
          </div>
        ) : (
          <div className="product-img placeholder">Sin imagen</div>
        )}
        {!product.habilitado && <div className="overlay-disabled">NO DISPONIBLE</div>}
      </div>

      <h3 className="product-title">{product.nombre}</h3>
      <p className="product-price">${product.precio}</p>

      {/* STOCK DEL TALLE SELECCIONADO */}
      {selectedSizeStock !== null && (
        <p className="product-price">Stock: {selectedSizeStock}</p>
      )}

      {isAdmin && (
        <button
          className={`admin-btn ${product.habilitado ? "btn-disable" : "btn-enable"}`}
          onClick={() => onToggleStatus(product.id)}
        >
          {product.habilitado ? "Deshabilitar" : "Habilitar"}
        </button>
      )}

      {!isAdmin && product.habilitado && (
        <div className="user-actions">
          <div className="card-bottom">
            <div className="size-selector">
              <select
                className="size-select"
                value={selectedSizeId}
                onChange={(e) => setSelectedSizeId(e.target.value)}
              >
                {product.sizes
                  ?.filter((s) => s.habilitado)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      Talle: {s.talle}
                    </option>
                  ))}
              </select>
            </div>
            <div className="detail-button">
              <button onClick={onClick}>Ver en detalle</button>
            </div>
          </div>

          {user && selectedSizeId && (
            <button className="add-btn" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          )}
        </div>
      )}

      {!isAdmin && !product.habilitado && <p className="disabled-label">No disponible</p>}
    </div>
  );
};

export default ProductCard;