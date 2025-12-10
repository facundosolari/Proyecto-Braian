import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import authService from "../services/authService";

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const BASE_URL = "https://localhost:7076"; // URL base para imágenes

  // ====== FETCH USER ======
  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/Authentication/me");
      if (response.data?.id) {
        const u = response.data;
        const normalizedUser = { ...u, role: u.rol === 1 ? "Admin" : "User" };
        setUser(normalizedUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // ====== INICIALIZACIÓN ======
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
    fetchUser().finally(() => setLoading(false));
  }, []);

  // ====== GUARDAR CARRITO ======
  useEffect(() => {
    if (cart.length > 0) localStorage.setItem("cart", JSON.stringify(cart));
    else localStorage.removeItem("cart");
  }, [cart]);

  // ====== LOGIN ======
  const login = async (usuario, contraseña) => {
    try {
      await authService.login(usuario, contraseña);
      await fetchUser();
    } catch (err) {
      console.error("Error en login:", err);
      throw new Error("Usuario o contraseña incorrectos");
    }
  };

  // ====== REGISTER ======
  const register = async (userData) => {
    try {
      const created = await authService.register(userData);
      return created;
    } catch (err) {
      console.error("Error en register:", err);
      throw new Error("No se pudo registrar el usuario");
    }
  };

  // ====== LOGOUT ======
  const logout = async () => {
    try {
      await axiosClient.post("/Authentication/logout");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUser(null);
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  // ====== FUNCIONES DEL CARRITO ======
  const addToCart = (product, cantidad = 1, size = null) => {
    setCart((prev) => {
      const itemId = size ? size.id : product.id;
      const found = prev.find((item) => item.id === itemId);

      if (found) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + cantidad }
            : item
        );
      }

      // Normalizar fotos para que siempre tengan URL completa
      const fotos = product.fotos?.map((f) =>
        f.startsWith("http") ? f : `${BASE_URL}${f}`
      ) || [];

      return [
        ...prev,
        {
          id: itemId,
          nombre: product.nombre,
          precio: product.precio,
          talle: size?.talle || product.talle || "",
          quantity: cantidad,
          fotos,
          productId: product.productId || product.id,
        },
      ];
    });
  };

  const decreaseQuantity = (id) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );

  const increaseQuantity = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  // ====== INTERCEPTOR GLOBAL ======
  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          setUser(null);
          setCart([]);
          localStorage.removeItem("cart");
          setSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );
    return () => axiosClient.interceptors.response.eject(interceptor);
  }, []);

  const closeToast = () => setSessionExpired(false);

  if (loading) return <p>Cargando...</p>;

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        sessionExpired,
        closeToast,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
/*

ANTES DEL ULTIMO CAMBIO

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import authService from "../services/authService"; // <-- cambio aquí

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ====== FETCH USER ======
  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/Authentication/me");

      if (response.data?.id) {
        const u = response.data;

        // 🔥 NORMALIZACIÓN DEL ROL
        const normalizedUser = {
          ...u,
          role: u.rol === 1 ? "Admin" : "User"
        };

        setUser(normalizedUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // ====== INICIALIZACIÓN ======
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));

    fetchUser().finally(() => setLoading(false));
  }, []);

  // ====== GUARDAR CARRITO ======
  useEffect(() => {
    if (cart.length > 0) localStorage.setItem("cart", JSON.stringify(cart));
    else localStorage.removeItem("cart");
  }, [cart]);

  // ====== LOGIN ======
  const login = async (usuario, contraseña) => {
    try {
      await authService.login(usuario, contraseña); // cookie se setea
      await fetchUser(); // carga el usuario
    } catch (err) {
      console.error("Error en login:", err);
      throw new Error("Usuario o contraseña incorrectos");
    }
  };

  // ====== REGISTER ======
  const register = async (userData) => {
    try {
      const created = await authService.register(userData);
      return created;
    } catch (err) {
      console.error("Error en register:", err);
      throw new Error("No se pudo registrar el usuario");
    }
  };

  // ====== LOGOUT ======
  const logout = async () => {
    try {
      await axiosClient.post("/Authentication/logout");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUser(null);
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  // ====== FUNCIONES DEL CARRITO ======
  const addToCart = (product, cantidad = 1) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + cantidad }
            : item
        );
      }
      return [...prev, { ...product, quantity: cantidad }];
    });
  };

  const decreaseQuantity = (id) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );

  const increaseQuantity = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  if (loading) return <p>Cargando...</p>;

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register, // <-- agregado para registrar
        logout,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

*/