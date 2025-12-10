import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import OrdersSlide from "./OrdersSlide";
import { useUser } from "../context/UserContext";
import axiosClient from "../services/axiosClient";
import "../styles/Home.css";
import banner from "../../public/banner/banner.avif";

export default function Home() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [search, setSearch] = useState("");

  // === MODAL DE DETALLE ===
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/Product/AllProducts");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleAvailability = async (productId) => {
    try {
      await axiosClient.put(`/Product/SoftDelete/${productId}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, habilitado: !p.habilitado } : p
        )
      );
    } catch (error) {
      console.error("Error en toggle availability:", error);
    }
  };

  // === FILTRO POR NOMBRE ===
  const filteredProducts = products.filter((p) =>
    p.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  // === HANDLERS MODAL ===
  const handleCardClick = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <main className="home-main">
      {/* --- HERO --- */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Bienvenido a La Cabaña Deportiva</h1>
            <p>Encontrá lo último en indumentaria y accesorios deportivos.</p>
            <a href="/products" className="btn primary-lg">Ver catálogo</a>
          </div>
          <div className="hero-image">
           <img src={banner} alt="banner" />
          </div>
        </div>
      </section>

      {/* --- CATÁLOGO --- */}
      <section className="catalog-wrapper">
        <h2 className="catalog-title">Catálogo de Productos</h2>

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="catalog-search"
        />

        {/* CONTENEDOR CON SCROLL */}
        <div className="catalog-box">
          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <p className="empty">No se encontraron productos</p>
            ) : (
              filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onToggleStatus={handleToggleAvailability}
                  onClick={() => handleCardClick(p)} // abre modal
                />
              ))
            )}
          </div>
        </div>

        {!user && <p className="no-user-msg">Inicia sesión para comprar</p>}
      </section>

      {/* --- MODAL DE DETALLE --- */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={closeModal}
        />
      )}

      {/* --- ÓRDENES DEL USUARIO --- */}
      {user?.userId && (
        <>
          <button
            className="orders-toggle-btn"
            onClick={() => setOrdersOpen((prev) => !prev)}
          >
            {ordersOpen ? "Cerrar Órdenes" : "Ver Órdenes"}
          </button>

          <OrdersSlide
            isOpen={ordersOpen}
            onClose={() => setOrdersOpen(false)}
          />
        </>
      )}
    </main>
  );
}