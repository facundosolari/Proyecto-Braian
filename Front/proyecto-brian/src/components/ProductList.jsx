import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import FiltersPanel from "./FiltersPanel";
import { useUser } from "../context/UserContext";
import axiosClient from "../services/axiosClient";
import "../styles/ProductList.css";

const ProductList = () => {
  const { user } = useUser();

  // Estados principales
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginación
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyEnabled, setOnlyEnabled] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ============================================
  const fetchProducts = useCallback(async (overrides = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", overrides.page ?? page);
      params.append("pageSize", pageSize);
      if (overrides.sortBy ?? sortBy) params.append("sortBy", overrides.sortBy ?? sortBy);
      if (overrides.searchName ?? searchName) params.append("searchName", overrides.searchName ?? searchName);
      if (overrides.minPrice ?? minPrice) params.append("minPrice", overrides.minPrice ?? minPrice);
      if (overrides.maxPrice ?? maxPrice) params.append("maxPrice", overrides.maxPrice ?? maxPrice);
      if (overrides.onlyEnabled ?? onlyEnabled) params.append("onlyEnabled", true);

      (overrides.selectedCategories ?? selectedCategories).forEach(id => params.append("categoryIds", id));
      (overrides.selectedSizes ?? selectedSizes).forEach(t => params.append("sizeIds", t));

      const res = await axiosClient.get(`/Product/Paged?${params.toString()}`);
      const items = res.data.items || [];

      setProducts(items);
      setFilteredProducts(items);
      setTotalPages(res.data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setLoading(false);
    }
  }, [page, pageSize, sortBy, selectedCategories, selectedSizes, searchName, minPrice, maxPrice, onlyEnabled]);

  // ============================================
  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/Category/AllCategories");
      const rawCategories = res.data || [];

      // Convertir a flat map
      const flatMap = new Map();
      const flatten = (cat, parentId = null) => {
        if (!flatMap.has(cat.id)) {
          flatMap.set(cat.id, { ...cat, parentCategoryResponse: parentId, subCategories: cat.subCategories || [] });
        }
        cat.subCategories?.forEach(sub => flatten(sub, cat.id));
      };
      rawCategories.forEach(c => flatten(c));

      const map = {};
      const roots = [];
      flatMap.forEach(c => (map[c.id] = { ...c, subCategories: [] }));
      flatMap.forEach(c => {
        if (c.parentCategoryResponse) {
          if (map[c.parentCategoryResponse]) map[c.parentCategoryResponse].subCategories.push(map[c.id]);
        } else {
          roots.push(map[c.id]);
        }
      });

      const sortTree = (nodes) => {
        nodes.sort((a, b) => a.id - b.id);
        nodes.forEach(n => sortTree(n.subCategories));
      };
      sortTree(roots);

      setCategories(roots);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [page, fetchProducts]);

  // ============================================
  // Eventos filtros
  const handleSearchChange = e => { setSearchName(e.target.value); setPage(1); fetchProducts({ searchName: e.target.value, page: 1 }); };
  const handleMinChange = e => { setMinPrice(e.target.value); setPage(1); fetchProducts({ minPrice: e.target.value, page: 1 }); };
  const handleMaxChange = e => { setMaxPrice(e.target.value); setPage(1); fetchProducts({ maxPrice: e.target.value, page: 1 }); };
  const handleOnlyEnabledToggle = checked => { setOnlyEnabled(checked); setPage(1); fetchProducts({ onlyEnabled: checked, page: 1 }); };
  const handleSortChange = val => { setSortBy(val); setPage(1); fetchProducts({ sortBy: val, page: 1 }); };
  const handleCategoryToggle = categoryId => {
    setSelectedCategories(prev => {
      const next = prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId];
      setPage(1);
      fetchProducts({ selectedCategories: next, page: 1 });
      return next;
    });
  };
  const handleSizeToggle = sizeId => {
    setSelectedSizes(prev => {
      const next = prev.includes(sizeId) ? prev.filter(s => s !== sizeId) : [...prev, sizeId];
      setPage(1);
      fetchProducts({ selectedSizes: next, page: 1 });
      return next;
    });
  };

  const handleCardClick = product => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  // ============================================
  return (
    <div className="catalog-wrapper-outer">
      <h2 className="catalog-title">Catálogo de Productos</h2>

      <button className="filters-slide-btn" onClick={() => setShowFilters(true)}>Filtros</button>

      <FiltersPanel
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        searchName={searchName}
        handleSearchChange={handleSearchChange}
        minPrice={minPrice}
        handleMinChange={handleMinChange}
        maxPrice={maxPrice}
        handleMaxChange={handleMaxChange}
        onlyEnabled={onlyEnabled}
        handleOnlyEnabledToggle={handleOnlyEnabledToggle}
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryToggle={handleCategoryToggle}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        products={products}
        selectedSizes={selectedSizes}
        handleSizeToggle={handleSizeToggle}
      />

      <div className="catalog-box">
        {loading ? (
          <p className="empty">Cargando productos...</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <p className="empty">No se encontraron productos</p>
            ) : (
              filteredProducts.map((p, index) => (
                <ProductCard
                  key={`${p.id}-${index}`}
                  product={p}
                  onClick={() => handleCardClick(p)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {selectedProduct && (
  <ProductDetailModal
    product={selectedProduct}
    onClose={closeModal}
    allProducts={products}            // <-- Pasamos todos los productos
    onChangeProduct={setSelectedProduct} // <-- Permite cambiar el producto desde el modal
  />
)}
    </div>
  );
};

export default ProductList;