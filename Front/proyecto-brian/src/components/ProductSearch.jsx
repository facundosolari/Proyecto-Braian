import React from "react";

export const ProductSearch = ({
  productId,
  setProductId,
  productResult,
  showProductResult,
  setShowProductResult,
  buscarProducto,
}) => (
  <div className="search-card">
    <h4>Buscar Producto</h4>
    <input
      type="text"
      placeholder="ID Producto..."
      value={productId}
      onChange={(e) => setProductId(e.target.value)}
    />
    <div className="search-buttons">
      <button onClick={buscarProducto} className="btn">Buscar</button>
      <button
        onClick={() => setShowProductResult((prev) => !prev)}
        className="btn"
      >
        {showProductResult ? "Ocultar" : "Mostrar"}
      </button>
    </div>

    {showProductResult && productResult && (
      <>
        <div className="search-overlay" onClick={() => setShowProductResult(false)}></div>
        <div className="search-result-panel">
          <button className="close-btn" onClick={() => setShowProductResult(false)}>×</button>
          <p><strong>{productResult.nombre}</strong></p>
          <p>ID: {productResult.id}</p>
          <p>Habilitado: {productResult.habilitado ? "Sí" : "No"}</p>
          {productResult.talles?.length > 0 && (
            <>
              <h5>Talles disponibles:</h5>
              {productResult.talles.map((t) => (
                <div key={t.id} style={{ marginBottom: "6px" }}>
                  <p>
                    <strong>Talle:</strong> {t.talle} - 
                    <strong>Stock:</strong> {t.stock} - 
                    <strong>Habilitado:</strong> {t.habilitado ? "Sí" : "No"}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </>
    )}
  </div>
);
