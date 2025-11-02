import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import "./Header.css";
export default function HeaderPrincipal() {
    return (
            <header className="fondo-header-principal">
                <div className="bloque izquierdo">
                    <Link to="/" className="link">
                        <img src="/maestro.png" width="30px" alt="Maestro"/>
                        <div>
                            <span className="texto-pagina-inicial">
                                EL MUNDO
                            </span>
                            <span>{" "}</span>
                            <br className="salto-linea"/>
                            <span className="texto-pagina-inicial">
                                MATEMÁTICO
                            </span>
                        </div>
                    </Link>
                </div>
                

                <div className="bloque central">
                    <span className="boton-header">Recursos</span>
                    <span className="">Juegos</span>
                    </div>
                
                <div className="bloque derecho">
                    <Link to="/login" className="link">
                    <span className="texto-boton">Inicia Sesión</span>
                    </Link>
                    <Link to="/register" className="link">
                    <span className="boton-header">Regístrate</span>
                    </Link>
                    <Menu size={24} className="menu"/>
                    
                    </div>

            </header>
    );
}