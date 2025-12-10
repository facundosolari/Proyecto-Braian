import React, { useState, useEffect } from "react";
import {
  getAllProducts,
  getProductById,
  updateProductSize,
  softDeleteProductSize,
} from "../services/orderService";

export default function EditSizeModal({ onClose, onSave }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [talleName, setTalleName] = useState("");
  const [stock, setStock] = useState(0);
  const [habilitado, setHabilitado] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  // LIVE SEARCH DE PRODUCTOS
  useEffect(() => {
    if (search.trim().length < 1) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoadingProducts(true);
        const all = await getAllProducts();
        const searchLower = search.toLowerCase();
        const filtered = all.filter(
          (p) =>
            p.nombre.toLowerCase().includes(searchLower) ||
            p.id.toString().includes(searchLower)
        );
        setResults(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProducts(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [search]);

  // Seleccionar producto
  const handleSelectProduct = async (product) => {
    const full = await getProductById(product.id);
    setSelectedProduct(full);
    setSearch(full.nombre);
    setResults([]);
    setSelectedSize(null);
    setTalleName("");
    setStock(0);
    setHabilitado(true);
  };

  // Seleccionar talle
  useEffect(() => {
    if (!selectedSize) return;
    setTalleName(selectedSize.talle);
    setStock(selectedSize.stock);
    setHabilitado(selectedSize.habilitado ?? true);
  }, [selectedSize]);

  const handleSave = async () => {
    if (!selectedSize) return;
    setLoadingSave(true);
    try {
      await updateProductSize(selectedSize.id, {
        productId: selectedProduct.id,
        talle: talleName,
        stock,
        habilitado,
      });
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error al actualizar talle:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  const toggleHabilitadoHandler = async () => {
    if (!selectedSize) return;
    setLoadingSave(true);
    try {
      await softDeleteProductSize(selectedSize.id);
      setHabilitado((prev) => !prev);
      onSave?.();
    } catch (error) {
      console.error("Error al habilitar/deshabilitar talle:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Talle</h2>

        {/* 🔍 Buscador de productos */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar producto por nombre o ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loadingProducts && <div>Buscando…</div>}

          {results.length > 0 && (
            <div className="search-results">
              {results.map((p) => (
                <div
                  key={p.id}
                  className="search-option"
                  onClick={() => handleSelectProduct(p)}
                >
                  #{p.id} — {p.nombre}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selección de talle */}
        {selectedProduct && (
          <>
            <p>Producto seleccionado: <strong>{selectedProduct.nombre}</strong></p>

            <select
              value={selectedSize?.id || ""}
              onChange={(e) =>
                setSelectedSize(
                  selectedProduct.sizes.find(
                    (s) => s.id.toString() === e.target.value
                  )
                )
              }
            >
              <option value="" disabled>
                Selecciona un talle
              </option>
              {selectedProduct.sizes
                .sort((a, b) =>
                  !isNaN(a.talle) && !isNaN(b.talle)
                    ? a.talle - b.talle
                    : a.talle.localeCompare(b.talle)
                )
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.talle}
                  </option>
                ))}
            </select>
          </>
        )}

        {/* Edición de talle */}
        {selectedSize && (
          <>
            <input
              className="modal-input"
              value={talleName}
              onChange={(e) => setTalleName(e.target.value)}
              placeholder="Nombre del talle"
            />

            <input
              className="modal-input"
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              placeholder="Stock"
            />

            <div className="modal-buttons" style={{ display: "flex", gap: "8px" }}>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={loadingSave}
              >
                Guardar Talle
              </button>

              <button
                className="habilitar-btn"
                onClick={toggleHabilitadoHandler}
                style={{
                  background: habilitado ? "#e74c3c" : "#2ecc71",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                disabled={loadingSave}
              >
                {habilitado ? "Deshabilitar" : "Habilitar"}
              </button>

              <button className="cancel-btn" onClick={onClose} disabled={loadingSave}>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}