import React, { useState, useEffect } from "react";
import { getAllProducts, getAllCategories } from "../services/orderService";
import axiosClient from "../services/axiosClient";
import "../styles/CreateCategoryModal.css";

export default function CreateCategoryModal({ onClose, onSave }) {
  const [nombre, setNombre] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // 🔥 FUNCION PARA APANAR TODA LA JERARQUIA
 function flattenCategories(list) {
  const result = [];
  const added = new Set(); // evitar duplicados

  function traverse(cat, level = 0) {
    if (!added.has(cat.id)) {
      result.push({
        id: cat.id,
        nombre: cat.nombre,
        parentCategoryId: cat.parentCategoryId,
        level
      });
      added.add(cat.id);
    }

    if (cat.subCategories && cat.subCategories.length > 0) {
      cat.subCategories.forEach((sub) => traverse(sub, level + 1));
    }
  }

  // Recorremos la lista original en orden
  list.forEach((c) => traverse(c));

  return result;
}

  // Traer todas las categorías y APANARLAS
  useEffect(() => {
    async function fetchCategories() {
      const allCategories = await getAllCategories();
      const flat = flattenCategories(allCategories);
      setCategories(flat);
    }
    fetchCategories();
  }, []);

  // Live search productos
  useEffect(() => {
    if (search.trim().length < 1) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const all = await getAllProducts();
        const searchLower = search.toLowerCase();
        const filtered = all.filter(
          (p) =>
            p.nombre.toLowerCase().includes(searchLower) ||
            p.id.toString().includes(searchLower)
        );
        setResults(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSelectProduct = (product) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setSearch("");
    setResults([]);
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const renderCategoryOptions = () => {
    return categories.map((c) => (
      <option key={c.id} value={c.id}>
        {`${"— ".repeat(c.level)}${c.nombre}`}
      </option>
    ));
  };

  const handleSave = async () => {
    try {
      const payload = {
        Nombre: nombre,
        ParentCategoryId: parentCategoryId,
        ProductsIds: selectedProducts.map((p) => p.id),
      };
      await axiosClient.post("/Category/CreateCategory", payload);
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error("Error creando categoría:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear Categoría</h2>

        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoría"
        />

        {/* Select de categoría padre (YA FUNCIONA CON SUBCATEGORIAS) */}
        <select
          value={parentCategoryId || ""}
          onChange={(e) =>
            setParentCategoryId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Sin categoría padre</option>
          {renderCategoryOptions()}
        </select>

        {/* Buscador */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar productos por nombre o ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {loading && <div className="loading">Buscando…</div>}
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

        {selectedProducts.length > 0 && (
          <div className="selected-products">
            <h4>Productos seleccionados:</h4>
            <div className="product-grid">
              {selectedProducts.map((p) => (
                <div key={p.id} className="product-item">
                  {p.nombre}
                  <span
                    className="photo-remove-btn"
                    onClick={() => handleRemoveProduct(p.id)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={handleSave} className="save-btn">
            Crear Categoría
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}