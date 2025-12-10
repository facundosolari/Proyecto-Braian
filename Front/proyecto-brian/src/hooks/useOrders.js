import { useState, useEffect } from "react";
import {
  getAllOrders,
  getOrderById,
  getProductById,
  getProductSizeById,
  getAllProductSizes,
  confirmOrder,
  cancelOrder,
  pagoOrder,
  finalizeOrder,
} from "../services/orderService";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      const filtered = data.filter(o => o.estadoPedido === 1 || o.estadoPedido === 2);

      const expandedOrders = await Promise.all(
        filtered.map(async (order) => {
          const items = await Promise.all(
            order.orderItems.map(async (item) => {
              const product = await getProductById(item.productId);
              const size = await getProductSizeById(item.productSizeId);
              return {
                ...item,
                product,
                habilitado: product?.habilitado ?? false,
                talleHabilitado: size?.habilitado ?? false,
              };
            })
          );
          return { ...order, orderItems: items };
        })
      );

      setOrders(expandedOrders);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAction = async (orderId, action) => {
    try {
      if (action === "confirm") await confirmOrder(orderId);
      if (action === "cancel") await cancelOrder(orderId);
      if (action === "pay") await pagoOrder(orderId);
      if (action === "finalize") await finalizeOrder(orderId);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const buscarProducto = async (productId) => {
    if (!productId) return null;
    try {
      const product = await getProductById(productId);
      const allSizes = await getAllProductSizes();
      const talles = allSizes
        .filter(s => s.productId === product.id)
        .map(size => ({
          id: size.id,
          talle: size.talle,
          stock: size.stock,
          habilitado: size.habilitado,
        }));
      return { ...product, talles };
    } catch {
      return null;
    }
  };

  const buscarTalle = async (sizeId) => {
    if (!sizeId) return null;
    try {
      return await getProductSizeById(sizeId);
    } catch {
      return null;
    }
  };

  const buscarOrden = async (orderId) => {
    if (!orderId) return null;
    try {
      const order = await getOrderById(orderId);
      const items = await Promise.all(
        order.orderItems.map(async item => {
          const product = await getProductById(item.productId);
          const size = await getProductSizeById(item.productSizeId);
          return {
            ...item,
            product,
            habilitado: product?.habilitado ?? false,
            talleHabilitado: size?.habilitado ?? false,
          };
        })
      );
      return { ...order, orderItems: items };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    handleAction,
    buscarProducto,
    buscarTalle,
    buscarOrden,
    setOrders,
  };
};