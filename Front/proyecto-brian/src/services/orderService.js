import axiosClient from "./axiosClient";

// ---------------------------
// ÓRDENES
// ---------------------------

// Crear orden
export const createOrder = async (orderRequest) => {
  try {
    const response = await axiosClient.post("/Order/CreateOrder", orderRequest);
    return response.data;
  } catch (error) {
    console.error("Error al generar la orden:", error);
    throw error;
  }
};

// Obtener todas las órdenes
export const getAllOrders = async () => {
  try {
    const response = await axiosClient.get("/Order/AllOrders");
    return response.data;
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    throw error;
  }
};


// Obtener orden por ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axiosClient.get(`/Order/OrderId/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener orden ${orderId}:`, error);
    throw error;
  }
};

// Confirmar orden
export const confirmOrder = async (id) => {
  try {
    const response = await axiosClient.put(`/Order/ConfirmOrder/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Error confirmando orden:", error);
    throw error;
  }
};

// Cancelar orden
export const cancelOrder = async (id) => {
  try {
    const response = await axiosClient.put(`/Order/CancelOrder/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Error cancelando orden:", error);
    throw error;
  }
};

// Marcar orden como pagada
export const pagoOrder = async (id) => {
  try {
    const response = await axiosClient.put(`/Order/PagoOrder/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Error pagando orden:", error);
    throw error;
  }
};

// Finalizar orden (cambia estado a 'finalizada')
export const finalizeOrder = async (id) => {
  try {
    const response = await axiosClient.put(`/Order/FinalizeOrder/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Error finalizando orden:", error);
    throw error;
  }
};

// ---------------------------
// PRODUCTOS
// ---------------------------

export const getAllProducts = async () => {
  try {
    const response = await axiosClient.get("/Product/AllProducts");
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axiosClient.get(`/Product/ProductId/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    throw error;
  }
};

// ---------------------------
// TALLES (PRODUCT SIZES)
// ---------------------------

export const getAllProductSizes = async () => {
  try {
    const response = await axiosClient.get("/ProductSize/AllProductSizes");
    return response.data;
  } catch (error) {
    console.error("Error al obtener talles:", error);
    throw error;
  }
};

export const getProductSizeById = async (id) => {
  try {
    const response = await axiosClient.get(`/ProductSize/ProductSizeId/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener talle ${id}:`, error);
    throw error;
  }
};

// ---------------------------
// PRODUCTOS / TALLES ADMIN
// ---------------------------

// Crear producto (con o sin imágenes)
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();

    // Normalizar fotos como array
    const fotos = Array.isArray(productData.fotos)
      ? productData.fotos
      : productData.fotos
      ? [productData.fotos]
      : [];

    fotos.forEach(file => formData.append("images", file));

    // LOS NOMBRES DEBEN MATCHEAR EL BACKEND
    formData.append("Nombre", productData.nombre);
    formData.append("Descripcion", productData.descripcion || "");
    formData.append("Precio", productData.precio);

    if (productData.sizes) {
      formData.append("Sizes", JSON.stringify(productData.sizes));
    }

    const response = await axiosClient.post("/Product/CreateProduct", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error creando producto:", error);
    throw error;
  }
};

// Crear talle
export const createProductSize = async (sizeData) => {
  try {
    const response = await axiosClient.post("/ProductSize/CreateProductSize", sizeData);
    return response.data;
  } catch (error) {
    console.error("Error creando talle:", error);
    throw error;
  }
};

// ---------------------------
// TALLES / PRODUCT SIZES ADMIN
// ---------------------------
export const toggleProductSizeEnabled = async (id, habilitado) => {
  try {
    // Aquí enviamos solo el campo 'habilitado', tu backend puede recibir un objeto ProductSizeRequest
    const request = { habilitado };
    const response = await axiosClient.put(`/ProductSize/UpdateProductSizeById/${id}`, request);
    return response.data;
  } catch (error) {
    console.error("Error al habilitar/deshabilitar talle:", error);
    throw error;
  }
};

// ---------------------------
// UPDATE PRODUCT
// ---------------------------
export const updateProduct = async (id, data) => {
  try {
    const response = await axiosClient.put(
      `/Product/UpdateProductById/${id}`,
      data // puede ser FormData o JSON
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando producto:", error);
    throw error;
  }
};

// ---------------------------
// UPDATE PRODUCT SIZE
// ---------------------------
export const updateProductSize = async (id, data) => {
  try {
    const response = await axiosClient.put(
      `/ProductSize/UpdateProductSizeById/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando talle:", error);
    throw error;
  }
};

export const softDeleteProductSize = async (id) => {
  try {
    const response = await axiosClient.put(`/ProductSize/SoftDelete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al habilitar/deshabilitar talle:", error);
    throw error;
  }
};

export const getOrderMessagesByOrderId = async (orderId) => {
  try {
    const { data } = await axiosClient.get(`/OrderMessage/OrderMessagesByOrderId/${orderId}`);
    return Array.isArray(data) ? data : []; // 🔹 asegura que siempre sea un array
  } catch (err) {
    console.error("Error fetching order messages:", err);
    return []; // 🔹 retorna array vacío si hay error
  }
};

// Crear mensaje
export const createOrderMessage = async ({ orderId, message, senderId, senderRole }) => {
  try {
    const payload = {
      orderId: Number(orderId),
      message: String(message),
      senderId: Number(senderId),
      senderRole: String(senderRole)
    };

    const res = await axiosClient.post("/OrderMessage/CreateOrderMessage", payload);
    return res.data;
  } catch (err) {
    console.error("Error creando mensaje:", err.response?.data || err);
    throw err;
  }
};

// Marcar mensajes como leídos

export const markMessagesAsRead = async (orderId) => {
  try {
    const res = await axiosClient.put(`/OrderMessage/MarkAsRead/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("Error marcando mensajes como leídos:", error);
    throw error;
  }
};

export const getUnreadCount = async (orderId, userId, userRole) => {
  try {
    // El backend ya usa los claims del token, pero pasamos userId y rol opcionalmente si hace falta
    const response = await axiosClient.get(`/OrderMessage/UnreadCount/${orderId}`);
    return response.data.unreadCount || 0;
  } catch (error) {
    console.error("Error obteniendo cantidad de mensajes no leídos:", error);
    return 0;
  }
};

// Soft delete de mensaje
export const softDeleteMessage = async (id) => {
  try {
    const res = await axiosClient.put(`/OrderMessage/SoftDeleteOrderMessage/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error haciendo soft delete del mensaje:", err);
    throw err;
  }
};
export const softDeleteProduct = async (id) => {
  try {
    const response = await axiosClient.put(`/Product/SoftDelete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al habilitar/deshabilitar producto:", error);
    throw error;
  }
};
export const getCategoryById = async (id) => {
  try {
    const res = await axiosClient.get(`/Category/GetCategoryBy/${id}`);
    return res.data;
  } catch {
    return null;
  }
};

export const getAllCategories = async () => {
  try {
    const res = await axiosClient.get("/Category/AllCategories");
    return res.data; // debe venir [{id, nombre, habilitado, productos:[...]}, ...]
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const updateCategory = async (id, payload) => {
  const res = await axiosClient.put(`/Category/UpdateCategoryBy/${id}`, payload);
  return res.data;
};

export const assignProductsToCategory = async (categoryId, productIds) => {
  try {
    const response = await axiosClient.put(`/Category/AssignProducts/${categoryId}`, productIds);
    return response.data;
  } catch (error) {
    console.error("Error al asignar productos a la categoría:", error);
    throw error;
  }
};
export const softDeleteCategory = async (categoryId) => {
  try {
    const response = await axiosClient.put(`/Category/SoftDelete/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error al habilitar/deshabilitar categoría:", error);
    throw error;
  }
};


export const getOrdersByUserId = async ({
  page = 1,
  pageSize = 10,
  estado = null,
  tieneMensajesNoLeidos = null,
  fechaDesde = null,
  fechaHasta = null,
  sortBy = "FechaHora",
  sortOrder = "desc"
}) => {
  try {
    // Construimos los params de query
    const params = { page, pageSize, sortBy, sortOrder };

    if (estado !== null) params.estado = estado;
    if (tieneMensajesNoLeidos !== null) params.tieneMensajesNoLeidos = tieneMensajesNoLeidos;
    if (fechaDesde) params.fechaDesde = new Date(fechaDesde).toISOString();
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999);
      params.fechaHasta = hasta.toISOString();
    }

    // 🔹 Usamos axiosClient en lugar de axios
    const { data } = await axiosClient.get("/Order/OrdersByUserId", { params });
    return data;
  } catch (error) {
    console.error("Error al obtener órdenes por usuario:", error);
    throw error;
  }
};

export const getOrdersByEstado = async ({
  estadoPedido,
  page = 1,
  pageSize = 20,
  fechaDesde = null,
  fechaHasta = null,
  sortBy = "FechaHora",
  sortOrder = "desc",
  tieneMensajesNoLeidos = null     // 👈 AGREGAR ESTO
}) => {
  try {
    const params = {
      estadoPedido,
      page,
      pageSize,
      sortBy,
      sortOrder,
    };

    // 🔥 ENVIARLO SOLO SI NO ES null
    if (tieneMensajesNoLeidos !== null) {
      params.tieneMensajesNoLeidos = tieneMensajesNoLeidos;
    }

    if (fechaDesde) params.fechaDesde = new Date(fechaDesde).toISOString();

    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999);
      params.fechaHasta = hasta.toISOString();
    }

    const { data } = await axiosClient.get("/Order/byEstado", { params });
    return data;
  } catch (error) {
    console.error("Error al obtener órdenes por estado:", error);
    throw error;
  }
};

export const updateOrderDetalleFacturacion = async (orderId, payload) => {
  try {
    const response = await axiosClient.put(`/Order/UpdateDetalleFacturacion/${orderId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error actualizando detalle de facturación:", error);
    throw error;
  }
};