import React from "react";

export const SizeSearch = ({
  sizeId,
  setSizeId,
  sizeResult,
  showSizeResult,
  setShowSizeResult,
  buscarTalle,
}) => (
  <div className="search-card">
    <h4>Buscar Talle</h4>
    <input
      type="text"
      placeholder="ID Talle..."
      value={sizeId}
      onChange={(e) => setSizeId(e.target.value)}
    />
    <div className="search-buttons">
      <button onClick={buscarTalle} className="btn">Buscar</button>
      <button
        onClick={() => setShowSizeResult((prev) => !prev)}
        className="btn"
      >
        {showSizeResult ? "Ocultar" : "Mostrar"}
      </button>
    </div>

    {showSizeResult && sizeResult && (
      <>
        <div className="search-overlay" onClick={() => setShowSizeResult(false)}></div>
        <div className="search-result-panel">
          <button className="close-btn" onClick={() => setShowSizeResult(false)}>×</button>
          <p><strong>Talle #{sizeResult.id}</strong></p>
          <p>Producto ID: {sizeResult.productId}</p>
          <p>Talle: {sizeResult.talle}</p>
          <p>Stock: {sizeResult.stock}</p>
          <p>Habilitado: {sizeResult.habilitado ? "Sí" : "No"}</p>
        </div>
      </>
    )}
  </div>
);