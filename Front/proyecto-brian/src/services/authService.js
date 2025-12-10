import axiosClient from "./axiosClient";

const authService = {
  // LOGIN (cookies HttpOnly)
  login: async (usuario, contraseña) => {
    try {
      const response = await axiosClient.post("/Authentication/authenticate", {
        usuario,
        contraseña,
      });

      // Retornamos todos los datos relevantes para el frontend
      return {
        userId: response.data?.userId || null,
        role: response.data?.role || null,
        usuario: response.data?.usuario || null,
        nombre: response.data?.nombre || response.data?.usuario || null,
      };
    } catch (err) {
      console.error("Error en authService login:", err);
      throw new Error("Usuario o contraseña incorrectos");
    }
  },

  // REGISTER
  register: async (userData) => {
    try {
      const response = await axiosClient.post("/User/CreateUser", userData);
      return response.data;
    } catch (err) {
      console.error("Error en authService register:", err);
      throw new Error("No se pudo registrar el usuario");
    }
  },
};

export default authService;