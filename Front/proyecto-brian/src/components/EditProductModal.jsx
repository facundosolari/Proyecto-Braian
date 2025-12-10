import React, { useState, useEffect } from "react";
import {
  getAllProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  getAllCategories,
} from "../services/orderService";

export default function EditProductModal({ onClose, onSave }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [photos, setPhotos] = useState([]);
  const [currentPhotos, setCurrentPhotos] = useState([]);

  const [habilitado, setHabilitado] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  // 🔥 Función que apana toda la jerarquía y evita duplicados
  function flattenCategories(list) {
    const result = [];
    const added = new Set();

    function traverse(cat, level = 0) {
      if (!added.has(cat.id)) {
        result.push({
          id: cat.id,
          nombre: cat.nombre,
          parentCategoryId: cat.parentCategoryId,
          level,
        });
        added.add(cat.id);
      }

      if (cat.subCategories?.length) {
        cat.subCategories.forEach((sub) => traverse(sub, level + 1));
      }
    }

    list.forEach((c) => traverse(c));
    return result;
  }

  // Cargar categorías planas
  useEffect(() => {
    async function loadCats() {
      const all = await getAllCategories();
      const flat = flattenCategories(all);
      setCategories(flat);
    }
    loadCats();
  }, []);

  // LIVE SEARCH
  useEffect(() => {
    if (search.trim().length < 1) {
      setResults([]);
      return;
    }

    let timeout = setTimeout(async () => {
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

  // Seleccionar producto
  const handleSelectProduct = async (product) => {
    const full = await getProductById(product.id);

    setSelectedProduct(full);
    setName(full.nombre);
    setPrice(full.precio);
    setDescription(full.descripcion);
    setCurrentPhotos(full.fotos || []);
    setHabilitado(full.habilitado ?? true);

    // Categorías asociadas
    setSelectedCategoryIds(full.categories?.map((c) => c.id) || []);

    setResults([]);
    setSearch(full.nombre);
  };

  // Fotos nuevas
  const handleFileChange = (e) => {
    setPhotos([...photos, ...e.target.files]);
  };

  const handleRemovePhoto = (index, isNew = false) => {
    if (isNew) {
      setPhotos(photos.filter((_, i) => i !== index));
    } else {
      setCurrentPhotos(currentPhotos.filter((_, i) => i !== index));
    }
  };

  // 🔥 Agregar o quitar categoría + padres/hijos automáticos
  const toggleCategory = (id) => {
    const cat = categories.find((x) => x.id === id);

    setSelectedCategoryIds((prev) => {
      let updated = [...prev];

      if (updated.includes(id)) {
        // Quitar la categoría
        updated = updated.filter((x) => x !== id);

        // 🔹 Si es padre, quitar todas sus hijas recursivamente
        const removeChildren = (parentId) => {
          categories
            .filter((c) => c.parentCategoryId === parentId)
            .forEach((child) => {
              updated = updated.filter((x) => x !== child.id);
              removeChildren(child.id);
            });
        };
        removeChildren(id);

      } else {
        // Agregar categoría
        updated.push(id);

        // Agregar padres automáticamente
        let current = cat;
        while (current?.parentCategoryId) {
          if (!updated.includes(current.parentCategoryId)) {
            updated.push(current.parentCategoryId);
          }
          current = categories.find((c) => c.id === current.parentCategoryId);
        }
      }

      return updated;
    });
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!selectedProduct) return;
    setLoadingSave(true);

    try {
      const formData = new FormData();
      formData.append("Nombre", name);
      formData.append("Precio", price);
      formData.append("Descripcion", description);

      currentPhotos.forEach((url) => formData.append("existingPhotos", url));
      photos.forEach((file) => formData.append("images", file));

      // Categorías finales (padres incluidos)
      selectedCategoryIds.forEach((id) => formData.append("CategoryIds", id));

      await updateProduct(selectedProduct.id, formData);
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  // Habilitar / deshabilitar
  const toggleHabilitadoHandler = async () => {
    if (!selectedProduct) return;
    setLoadingSave(true);

    try {
      await softDeleteProduct(selectedProduct.id);
      setHabilitado((prev) => !prev);
      onSave?.();
    } catch (error) {
      console.error("Error al habilitar/deshabilitar producto:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modern-modal">

        {/* BUSCADOR */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar producto por nombre o ID…"
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

        {!selectedProduct ? (
          <p className="hint-text">Selecciona un producto para editarlo.</p>
        ) : (
          <>
            <h2>Editar Producto</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio"
            />

            <textarea
              className="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción"
            />

            {/* CATEGORÍAS */}
            <h4>Categorías</h4>
            <div className="category-list">
              {categories.map((cat) => {
                const prefix = cat.level > 0 ? "".repeat(cat.level) : "";
                return (
                  <label key={cat.id} className="category-item">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                    />
                    {prefix}{cat.nombre}
                  </label>
                );
              })}
            </div>

            {/* FOTOS ACTUALES */}
            <h4>Fotos actuales</h4>
            <div className="photo-grid">
              {currentPhotos.map((photo, i) => (
                <div key={i} className="photo-item">
                  <img src={`https://localhost:7076${photo}`} />
                  <span
                    className="delete-btn"
                    onClick={() => handleRemovePhoto(i)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>

            {/* NUEVAS FOTOS */}
            <h4>Agregar nuevas fotos</h4>
            <input type="file" multiple onChange={handleFileChange} />

            <div className="photo-grid">
              {photos.map((file, i) => (
                <div key={i} className="photo-item">
                  <img src={URL.createObjectURL(file)} />
                  <span
                    className="delete-btn"
                    onClick={() => handleRemovePhoto(i, true)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>

            <div
              className="modal-buttons"
              style={{ display: "flex", gap: "8px", marginTop: "12px" }}
            >
              <button
                onClick={handleSave}
                className="save-btn"
                disabled={loadingSave}
              >
                Guardar
              </button>

              <button
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

              <button
                onClick={onClose}
                className="cancel-btn"
                disabled={loadingSave}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
