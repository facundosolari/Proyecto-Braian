import React, { useState, useEffect } from "react";
import { getAllProducts, getProductById, createProductSize } from "../services/orderService";

export default function CreateSizeModal({ onClose, onSave }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [size, setSize] = useState("");
  const [stock, setStock] = useState("");

  // LIVE SEARCH AUTOCOMPLETE
  useEffect(() => {
    if (search.trim().length < 1) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        const searchLower = search.toLowerCase();
        const filtered = allProducts.filter(
          (p) =>
            p.nombre.toLowerCase().includes(searchLower) ||
            p.id.toString().includes(searchLower)
        );
        setResults(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
  };

  const handleSave = async () => {
    if (!selectedProduct || !size) return;

    try {
      await createProductSize({
        productId: selectedProduct.id,
        size,
        stock: Number(stock),
      });
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error creando talle:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear Talle</h2>

        {/* 🔍 Buscador de productos */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar producto por nombre o ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loading && <div>Buscando…</div>}

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

        {selectedProduct && (
          <>
            <p>Producto seleccionado: <strong>{selectedProduct.nombre}</strong></p>

            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Talle"
            />

            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock"
            />

            <div className="modal-buttons">
              <button onClick={handleSave} className="save-btn">
                Crear
              </button>
              <button onClick={onClose} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}