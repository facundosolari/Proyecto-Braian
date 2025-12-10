import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="follow">
          <p>Síguenos</p>
          <div className="socials">
            <a href="#" target="_blank" rel="noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noreferrer">Whatsapp</a>
            <a href="#" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
        <div className="copyright">
          <small>© {new Date().getFullYear()} La Cabaña Deportiva</small>
        </div>
      </div>
    </footer>
  );
}