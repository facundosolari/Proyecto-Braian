import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import authService from "../services/authService"; // import default

export default function RegisterForm() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usuario: "",
    contraseña: "",
    nombre: "",
    apellido: "",
    celular: "",
    email: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await authService.register(form); // usamos authService.register
      alert("Registro exitoso. Ya puedes iniciar sesión");
      navigate("/login");
    } catch (err) {
      alert("Error al registrarse: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "30px" }}>
      <h2>Registrarse</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          name="usuario"
          placeholder="Usuario"
          value={form.usuario}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          required
        />
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
        />
        <input
          name="celular"
          placeholder="Celular"
          value={form.celular}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
