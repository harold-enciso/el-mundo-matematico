import { Link } from "react-router-dom";
import logo from "../../assets/elmundomatematico.webp";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="pie-pagina">
      <div className="pie-contenedor">
        {/* Columna 1: Branding / Info */}
        <div className="pie-columna">
          <div className="pie-brand">
            <img src={logo} alt="Logo El Mundo Matemático" className="pie-logo" />
            <span className="pie-titulo">EL MUNDO MATEMÁTICO</span>
          </div>
          <p className="pie-descripcion">
            Plataforma educativa para el aprendizaje interactivo de matemáticas, 
            teoría clara, prácticas y guías descargables.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div className="pie-columna">
          <h4 className="pie-subtitulo">Recursos</h4>
          <ul className="pie-lista">
            <li><Link to="/juegos" className="pie-enlace">Juegos Interactivos</Link></li>
            <li><Link to="/dashboard" className="pie-enlace">Mi Dashboard</Link></li>
          </ul>
        </div>

        {/* Columna 3: Legales */}
        <div className="pie-columna">
          <h4 className="pie-subtitulo">Legales</h4>
          <ul className="pie-lista">
            <li><Link to="/privacy-policy" className="pie-enlace">Política de Privacidad</Link></li>
          </ul>
        </div>
      </div>

      <div className="pie-derechos">
        <p>© 2026 elmundomatematico.com — Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}