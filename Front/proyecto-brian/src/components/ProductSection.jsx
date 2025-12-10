import React, { useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import EditProductModal from "./EditProductModal";
import EditSizeModal from "./EditSizeModal";
import CreateProductModal from "./CreateProductModal";
import CreateSizeModal from "./CreateSizeModal";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSizeModal, setEditingSizeModal] = useState(null);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateSize, setShowCreateSize] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axiosClient.get("/Product/AllProducts");
      setProducts(res.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await axiosClient.put(`/Product/SoftDelete/${id}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, habilitado: !p.habilitado } : p
        )
      );
    } catch (error) {
      console.error("Error cambiando disponibilidad:", error);
    }
  };

  // =======================
  // 🔍 FILTROS
  // =======================

  const filteredProducts = products
    .filter((p) =>
      searchId ? p.id.toString() === searchId : true
    )
    .filter((p) =>
      p.nombre?.toLowerCase().includes(searchName.toLowerCase())
    );

  return (
    <div className="admin-section">
      <h2>Productos</h2>

      {/* Botones crear */}
      <button onClick={() => setShowCreateProduct(!showCreateProduct)}>
        {showCreateProduct ? "Cerrar Crear Producto ▲" : "Crear Producto ▼"}
      </button>

      <button onClick={() => setShowCreateSize(!showCreateSize)}>
        {showCreateSize ? "Cerrar Crear Talle ▲" : "Crear Talle ▼"}
      </button>

      {/* ====================== */}
      {/* 🔍 BUSCADOR POR ID */}
      {/* ====================== */}
      <input
        placeholder="Buscar por ID..."
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{ marginTop: "15px", width: "100%", padding: "8px" }}
      />

      {/* ====================== */}
      {/* 🔍 BUSCADOR POR NOMBRE */}
      {/* ====================== */}
      <input
        placeholder="Buscar por nombre..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        style={{ marginTop: "10px", width: "100%", padding: "8px" }}
      />

      {/* Lista */}
      <ul style={{ marginTop: "20px" }}>
        {filteredProducts.map((p) => (
          <li key={p.id}>
            <strong>ID:</strong> {p.id} — {p.nombre} (${p.precio})
            <button onClick={() => setEditingProduct(p)}>Editar Producto</button>
            <button onClick={() => setEditingSizeModal(p)}>Editar Talle</button>
            <button onClick={() => toggleAvailability(p.id)}>
              {p.habilitado ? "Deshabilitar" : "Habilitar"}
            </button>
          </li>
        ))}
      </ul>

      {/* Modales */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={loadProducts}
        />
      )}

      {editingSizeModal && (
        <EditSizeModal
          products={products}
          initialProduct={editingSizeModal}
          onClose={() => setEditingSizeModal(null)}
          onSave={loadProducts}
        />
      )}

      {showCreateProduct && (
        <CreateProductModal
          onClose={() => setShowCreateProduct(false)}
          onSave={loadProducts}
        />
      )}

      {showCreateSize && (
        <CreateSizeModal
          products={products}
          onClose={() => setShowCreateSize(false)}
          onSave={loadProducts}
        />
      )}
    </div>
  );
}