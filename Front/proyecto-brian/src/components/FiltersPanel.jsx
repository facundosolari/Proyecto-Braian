import React, { useState, useEffect, useMemo } from "react";
import "../styles/FiltersPanel.css";

const FiltersPanel = ({
  showFilters,
  setShowFilters,
  searchName,
  handleSearchChange,
  minPrice,
  handleMinChange,
  maxPrice,
  handleMaxChange,
  onlyEnabled,
  handleOnlyEnabledToggle,
  categories,
  selectedCategories,
  handleCategoryToggle,
  sortBy,
  handleSortChange,
  products,
  selectedSizes,
  handleSizeToggle,
}) => {
  const [openCategories, setOpenCategories] = useState({});

  // Inicializar categorías abiertas
  useEffect(() => {
    if (!categories) return;

    const initialOpen = {};
    const openRecursive = (cats) => {
      cats.forEach(c => {
        if (c.subCategories?.length > 0) {
          initialOpen[c.id] = false;
          openRecursive(c.subCategories);
        }
      });
    };
    openRecursive(categories);
    setOpenCategories(initialOpen);
  }, [categories]);

  const toggleCategory = (id) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCategory = (category, level = 0) => {
    const hasSub = category.subCategories?.length > 0;
    const isOpen = openCategories[category.id];

    return (
      <React.Fragment key={category.id}>
        <div className="category-row" style={{ paddingLeft: `${level * 16}px` }}>
          <div className="category-main">
            {hasSub && (
              <span
                className={`accordion-toggle ${isOpen ? "open" : ""}`}
                onClick={() => toggleCategory(category.id)}
              >
                ▶
              </span>
            )}
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
              />
              <span className="checkmark" />
              {category.nombre || "Sin nombre"}
            </label>
          </div>
        </div>

        {hasSub && isOpen &&
          category.subCategories.map(sub =>
            renderCategory(sub, level + 1)
          )}
      </React.Fragment>
    );
  };

  // ========================================
  // FILTRO DE TALLES DISPONIBLES
  // ========================================
  const availableSizes = useMemo(() => {
  if (!products || products.length === 0) return [];
  if (selectedCategories.length === 0) return []; // <-- Esto evita mostrar talles si no hay categoría seleccionada

  const sizeSet = new Set();

  products.forEach(p => {
    const productCategoryIds = p.categories?.map(c => c.id) || [];

    // Incluir producto si coincide con alguna categoría seleccionada
    const includeProduct = productCategoryIds.some(id => selectedCategories.includes(id));

    if (includeProduct && p.sizes) {
      p.sizes.forEach(s => {
        if (s?.talle) sizeSet.add(s.talle);
      });
    }
  });

  return Array.from(sizeSet)
    .map(name => ({ id: name, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}, [products, selectedCategories]);

  return (
    <>
      <div
        className={`filters-backdrop ${showFilters ? "visible" : ""}`}
        onClick={() => setShowFilters(false)}
      />

      <div className={`filters-slide-left ${showFilters ? "open" : ""}`}>
        <div className="filters-content">
          {/* Búsqueda */}
          <div className="search-box">
            <div className="custom-input">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchName}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Precio */}
          <div className="price-row">
            <div className="custom-input small">
              <input
                type="number"
                placeholder="Precio mínimo"
                value={minPrice}
                onChange={handleMinChange}
              />
            </div>
            <div className="custom-input small">
              <input
                type="number"
                placeholder="Precio máximo"
                value={maxPrice}
                onChange={handleMaxChange}
              />
            </div>
          </div>

          {/* Solo habilitados */}
          <div className="check-row">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={onlyEnabled}
                onChange={e => handleOnlyEnabledToggle(e.target.checked)}
              />
              <span className="checkmark" />
              Solo habilitados
            </label>
          </div>

          {/* Categorías */}
          <div className="categories-filter">
            <p>Categorías:</p>
            {categories.map(c => renderCategory(c))}
          </div>

          {/* Talles */}
          {availableSizes.length > 0 && (
            <div className="sizes-filter">
              <p>Talles:</p>
              {availableSizes.map(size => (
                <label key={size.id} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size.id)}
                    onChange={() => handleSizeToggle(size.id)}
                  />
                  <span className="checkmark" />
                  {size.name}
                </label>
              ))}
            </div>
          )}

          {/* Orden */}
          <div className="custom-select">
            <select value={sortBy} onChange={e => handleSortChange(e.target.value)}>
              <option value="">Ordenar por...</option>
              <option value="priceAsc">Precio Menor a Mayor</option>
              <option value="priceDesc">Precio Mayor a Menor</option>
              <option value="nameAsc">Nombre A-Z</option>
              <option value="nameDesc">Nombre Z-A</option>
              <option value="idAsc">Más viejos</option>
              <option value="idDesc">Más nuevos</option>
              <option value="mostSold">Más vendidos</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersPanel;