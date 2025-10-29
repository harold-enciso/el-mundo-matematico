import { Link } from "react-router-dom";
import "./Header.css";
export default function HeaderPrincipal() {
    return (
            <header className="fondo-header-principal">
                <div className="bloque-izquierdo">
                    <Link to="/" className="link">
                        <img src="/maestro.png" width="30px" alt="Maestro"/>
                        <span className="texto-pagina-inicial">
                            EL MUNDO MATEMÁTICO
                            </span>
                    </Link>
                </div>
                

                <span className="bloque-central">
                    ¡Una forma fácil de retarte y aprender!
                    </span>
                
                <span className="bloque-derecho">
                    ¡HOLA NICO!
                    </span>

            </header>
    );
}