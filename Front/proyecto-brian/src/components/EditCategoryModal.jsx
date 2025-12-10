import React, { useState, useEffect } from "react";
import { 
  getAllCategories, 
  getAllProducts, 
  getCategoryById, 
  assignProductsToCategory, 
  softDeleteCategory 
} from "../services/orderService";
import axiosClient from "../services/axiosClient";

export default function EditCategoryModal({ onClose, onSave }) {
  const [searchCategory, setSearchCategory] = useState("");
  const [categoryResults, setCategoryResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [categories, setCategories] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [parentCategoryId, setParentCategoryId] = useState(null);
  const [habilitado, setHabilitado] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState(false);

  const [openCategories, setOpenCategories] = useState({});

  // === TRAER TODAS LAS CATEGORÍAS Y APLANAR ===
  useEffect(() => {
    async function fetchCategories() {
      const all = await getAllCategories();
      const flat = [];
      const visited = new Set();

      const flatten = (catList) => {
        catList.forEach(cat => {
          if (!visited.has(cat.id)) {
            visited.add(cat.id);
            flat.push({
              id: cat.id,
              nombre: cat.nombre,
              parentCategoryId: cat.parentCategoryId
            });
          }
          if (cat.subCategories?.length > 0) flatten(cat.subCategories);
        });
      };

      flatten(all);
      setCategories(flat);
    }

    fetchCategories();
  }, []);

  // === LIVE SEARCH CATEGORÍAS ===
  useEffect(() => {
    if (searchCategory.trim().length < 1) {
      setCategoryResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      const filtered = categories.filter(
        c =>
          c.nombre?.toLowerCase().includes(searchCategory.toLowerCase()) ||
          c.id.toString().includes(searchCategory)
      );
      setCategoryResults(filtered);
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchCategory, categories]);

  // === SELECCIONAR CATEGORÍA Y TRAER PRODUCTOS (PLANO, INCLUYENDO HIJOS) ===
  const handleSelectCategory = async (category) => {
    const full = await getCategoryById(category.id);

    if (!full) return;

    // Función para aplanar productos de subcategorías
    const flattenProducts = (cat) => {
      let prods = [...(cat.productos || [])];
      if (cat.subCategories?.length) {
        cat.subCategories.forEach(sub => {
          prods = prods.concat(flattenProducts(sub));
        });
      }
      return prods;
    };

    const allProducts = flattenProducts(full);

    setSelectedCategory(full);
    setSelectedProducts(allProducts);
    setParentCategoryId(full.parentCategoryId || null);
    setSearchCategory(full.nombre);
    setCategoryResults([]);
    setHabilitado(full.habilitado ?? true);
  };

  // === LIVE SEARCH PRODUCTOS ===
  useEffect(() => {
    if (!searchProduct.trim()) {
      setProductResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoadingProduct(true);
        const all = await getAllProducts();
        const searchLower = searchProduct.toLowerCase();

        const filtered = all.filter(
          p =>
            p.nombre?.toLowerCase().includes(searchLower) ||
            p.id.toString().includes(searchLower)
        );

        setProductResults(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProduct(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchProduct]);

  const handleSelectProduct = (product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(prev => [...prev, product]);
    }
    setSearchProduct("");
    setProductResults([]);
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    if (!selectedCategory) return;

    try {
      await axiosClient.put(`/Category/UpdateCategoryBy/${selectedCategory.id}`, {
        Nombre: selectedCategory.nombre,
        ParentCategoryId: parentCategoryId,
      });

      await assignProductsToCategory(
        selectedCategory.id,
        selectedProducts.map(p => p.id)
      );

      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error actualizando categoría:", error);
    }
  };

  const toggleHabilitadoHandler = async () => {
    if (!selectedCategory) return;

    try {
      setLoadingToggle(true);
      await softDeleteCategory(selectedCategory.id);
      setHabilitado(prev => !prev);
      onSave?.();
    } catch (error) {
      console.error("Error al habilitar/deshabilitar categoría:", error);
    } finally {
      setLoadingToggle(false);
    }
  };

  // === ÁRBOL DE CATEGORÍAS ===
  const toggleCategory = (id) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCategoryTree = (parentId = null, level = 0) => {
    return categories
      .filter(c => c.parentCategoryId === parentId)
      .map(c => (
        <div key={c.id} style={{ marginLeft: level * 20 }}>
          <span 
            onClick={() => toggleCategory(c.id)}
            style={{ cursor: "pointer", fontWeight: selectedCategory?.id === c.id ? "bold" : "normal" }}
          >
            {openCategories[c.id] ? "▼" : "▶"} {c.nombre}
          </span>
          {openCategories[c.id] && renderCategoryTree(c.id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="modal-overlay">
      <div className="modal modern-modal">
        <h2>Editar Categoría</h2>

        {/* BUSCADOR DE CATEGORÍAS */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar categoría por nombre o ID…"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="search-input"
          />
          {loadingCategory && <div className="loading">Buscando…</div>}
          {categoryResults.length > 0 && (
            <div className="search-results">
              {categoryResults.map((c) => (
                <div
                  key={c.id}
                  className="search-option"
                  onClick={() => handleSelectCategory(c)}
                >
                  #{c.id} — {c.nombre}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedCategory && (
          <>
            {/* SELECT CATEGORÍA PADRE */}
            <label>Categoría padre:</label>
            <select
              value={parentCategoryId || ""}
              onChange={(e) =>
                setParentCategoryId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Sin categoría padre</option>
              {categories
                .filter(c => c.id !== selectedCategory.id)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
            </select>

            {/* ÁRBOL DE CATEGORÍAS */}
            <h4>Jerarquía de Categorías</h4>
            <div className="category-tree">{renderCategoryTree()}</div>

            {/* PRODUCTOS SELECCIONADOS */}
            <h4>Productos asociados</h4>
            <div className="search-box">
              <input
                type="text"
                placeholder="Agregar producto por nombre o ID…"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="search-input"
              />
              {loadingProduct && <div className="loading">Buscando…</div>}
              {productResults.length > 0 && (
                <div className="search-results">
                  {productResults.map((p) => (
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

            {/* HABILITAR / DESHABILITAR */}
            <button
              onClick={toggleHabilitadoHandler}
              disabled={loadingToggle}
              style={{
                background: habilitado ? "#e74c3c" : "#2ecc71",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px 12px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "12px",
              }}
            >
              {habilitado ? "Deshabilitar" : "Habilitar"}
            </button>

            {/* BOTONES */}
            <div className="modal-buttons" style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button onClick={handleSave} className="save-btn">Guardar Cambios</button>
              <button onClick={onClose} className="cancel-btn">Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
