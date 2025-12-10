import React, { useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import { getAllCategories } from "../services/orderService";

export default function CreateProductModal({ onClose, onSave }) {
  const [form, setForm] = useState({ Nombre: "", Precio: "", Descripcion: "" });
  const [photos, setPhotos] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  // 🔥 Cargar categorías planas al montar
  useEffect(() => {
    async function loadCategories() {
      const all = await getAllCategories();

      const flat = [];
      const added = new Set();

      function traverse(cat, level = 0) {
        if (!added.has(cat.id)) {
          flat.push({
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

      all.forEach((c) => traverse(c));
      setCategories(flat);
    }

    loadCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhotos([...e.target.files]);
  };

  // 🔥 Manejar selección de categorías y padres
  const toggleCategory = (id) => {
    const cat = categories.find((x) => x.id === id);
    const parentId = cat?.parentCategoryId;

    setSelectedCategoryIds((prev) => {
      let updated = [...prev];

      if (updated.includes(id)) {
        // Borrar la categoría y sus hijas
        const allToRemove = [id];
        categories.forEach((c) => {
          if (c.parentCategoryId === id) allToRemove.push(c.id);
        });
        updated = updated.filter((x) => !allToRemove.includes(x));
      } else {
        updated.push(id);
        if (parentId && !updated.includes(parentId)) updated.push(parentId);
      }

      return updated;
    });
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append("Nombre", form.Nombre);
    data.append("Precio", form.Precio);
    data.append("Descripcion", form.Descripcion);

    photos.forEach((file) => data.append("images", file));
    selectedCategoryIds.forEach((id) => data.append("CategoryIds", id));

    try {
      await axiosClient.post("/Product/CreateProduct", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear Producto</h2>

        <input
          name="Nombre"
          value={form.Nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          name="Precio"
          value={form.Precio}
          onChange={handleChange}
          placeholder="Precio"
          type="number"
        />
        <textarea
          name="Descripcion"
          value={form.Descripcion}
          onChange={handleChange}
          placeholder="Descripción"
        />

        <input type="file" multiple onChange={handleFileChange} />

        {/* 🔥 Selector de categorías */}
        <h4>Categorías</h4>
        <div className="category-list">
          {categories.map((cat) => {
            const prefix = cat.level > 0 ? " ".repeat(cat.level) : "";
            return (
              <label key={cat.id} className="category-item">
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
                {prefix}
                {cat.nombre}
              </label>
            );
          })}
        </div>

        <div className="modal-buttons">
          <button onClick={handleSave} className="save-btn">
            Crear Producto
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
