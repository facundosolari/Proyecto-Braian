import React, { useState } from "react";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";

import CreateSizeModal from "./CreateSizeModal";
import EditSizeModal from "./EditSizeModal";

import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

import "../styles/AdminPanel.css";

export default function AdminPanel() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("producto");

  const [editingProduct, setEditingProduct] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);

  const [editingSize, setEditingSize] = useState(false);
  const [creatingSize, setCreatingSize] = useState(false);

  const [editingCategory, setEditingCategory] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  return (
    <div className="admin-panel">
      <h1 className="panel-title">Panel de Administración</h1>

      <button className="open-panel-btn" onClick={() => setPanelOpen(true)}>
        Abrir Panel
      </button>

      {panelOpen && (
        <div className="panel-overlay" onClick={() => setPanelOpen(false)} />
      )}

      <div className={`side-panel ${panelOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setPanelOpen(false)}>
          ✕
        </button>

        {/* --- SIDEBAR --- */}
        <div className="panel-sidebar">
          <button
            className={activeSection === "producto" ? "active" : ""}
            onClick={() => setActiveSection("producto")}
          >
            Productos
          </button>

          <button
            className={activeSection === "talle" ? "active" : ""}
            onClick={() => setActiveSection("talle")}
          >
            Talles
          </button>

          <button
            className={activeSection === "categoria" ? "active" : ""}
            onClick={() => setActiveSection("categoria")}
          >
            Categorías
          </button>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="panel-content">

          {activeSection === "producto" && (
            <>
              <h2 className="section-title">Productos</h2>

              <div className="admin-card">
                <h3>Crear Producto</h3>
                <p>Agregá un nuevo producto a tu catálogo.</p>
                <button onClick={() => setCreatingProduct(true)} className="primary-btn">
                  Crear Producto
                </button>
              </div>

              <div className="admin-card secondary">
                <h3>Editar Producto</h3>
                <p>Modificá precios, fotos o descripciones.</p>
                <button onClick={() => setEditingProduct(true)} className="secondary-btn">
                  Editar Producto
                </button>
              </div>
            </>
          )}

          {activeSection === "talle" && (
            <>
              <h2 className="section-title">Talles</h2>

              <div className="admin-card">
                <h3>Crear Talle</h3>
                <p>Agregá nuevos talles para un producto.</p>
                <button onClick={() => setCreatingSize(true)} className="primary-btn">
                  Crear Talle
                </button>
              </div>

              <div className="admin-card secondary">
                <h3>Editar Talle</h3>
                <p>Actualizá nombres, stock o disponibilidad.</p>
                <button onClick={() => setEditingSize(true)} className="secondary-btn">
                  Editar Talle
                </button>
              </div>
            </>
          )}

          {activeSection === "categoria" && (
            <>
              <h2 className="section-title">Categorías</h2>

              <div className="admin-card">
                <h3>Crear Categoría</h3>
                <p>Organizá tus productos en nuevas categorías.</p>
                <button onClick={() => setCreatingCategory(true)} className="primary-btn">
                  Crear Categoría
                </button>
              </div>

              <div className="admin-card secondary">
                <h3>Editar Categoría</h3>
                <p>Renombrá o cambia el estado de las categorías.</p>
                <button onClick={() => setEditingCategory(true)} className="secondary-btn">
                  Editar Categoría
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {/* --- MODALES --- */}
      {creatingProduct && <CreateProductModal onClose={() => setCreatingProduct(false)} />}
      {editingProduct && <EditProductModal onClose={() => setEditingProduct(false)} />}

      {creatingSize && <CreateSizeModal onClose={() => setCreatingSize(false)} />}
      {editingSize && <EditSizeModal onClose={() => setEditingSize(false)} />}

      {creatingCategory && (
        <CreateCategoryModal onClose={() => setCreatingCategory(false)} />
      )}
      {editingCategory && (
        <EditCategoryModal onClose={() => setEditingCategory(false)} />
      )}
    </div>
  );
}