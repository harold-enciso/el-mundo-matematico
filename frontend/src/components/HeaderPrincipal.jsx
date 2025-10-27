import { Link } from "react-router-dom";
import "./Header.css";
export default function HeaderPrincipal() {
    return (
        <>
            <header className="fondo-header-principal">
                <Link to="/register">
                    <button className="boton-header">Registrarse</button>
                </Link>
                
                <Link to="/login">
                    <span className="texto-boton">Iniciar Sesión</span>
                </Link>
                
            </header>
        </>
    );
}