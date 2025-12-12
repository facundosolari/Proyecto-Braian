import React, { useState, useEffect } from "react";
import "../styles/BillingModal.css";

export default function BillingDetailModal({ isOpen, onClose, detalle, onSave }) {
  // 🔹 Campos por defecto en mayúscula inicial
  const defaultForm = {
    Nombre: "",
    Apellido: "",
    Direccion: "",
    Ciudad: "",
    Provincia: "",
    Pais: "",
    CodigoPostal: "",
    Email: "",
    CodigoArea: "",
    NumeroTelefono: "",
    Documento: "",
  };

  const [form, setForm] = useState({ ...defaultForm, id: null }); // agregamos id

  // 🔹 Mapear el detalle del backend al formulario
  useEffect(() => {
    if (detalle) {
      setForm({
        id: detalle.id || null,           // 🔹 mantenemos id
        Nombre: detalle.nombre || "",
        Apellido: detalle.apellido || "",
        Direccion: detalle.direccion || "",
        Ciudad: detalle.ciudad || "",
        Provincia: detalle.provincia || "",
        Pais: detalle.pais || "",
        CodigoPostal: detalle.codigoPostal || "",
        Email: detalle.email || "",
        CodigoArea: detalle.codigoArea || "",
        NumeroTelefono: detalle.numeroTelefono || "",
        Documento: detalle.documento || "",
      });
    }
  }, [detalle]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Siempre enviamos el formulario, con id si existe
  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="billing-modal-backdrop">
      <div className="billing-modal">
        <h3>Detalle de Facturación</h3>

        <div className="billing-modal-content">
          {Object.keys(defaultForm).map((campo) => (
            <label key={campo}>
              {campo}:
              <input
                type="text"
                name={campo}
                value={form[campo]}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>

        <div className="billing-buttons">
          <button onClick={handleSubmit} className="btn confirm">Guardar</button>
          <button onClick={onClose} className="btn cancel">Cerrar</button>
        </div>
      </div>
    </div>
  );
}