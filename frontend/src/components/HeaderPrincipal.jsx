import { Link } from "react-router-dom";
import "./Header.css";
export default function HeaderPrincipal() {
    return (
        <>
            <header className="fondo-header-principal">
                <div className="bloque-izquierdo">
                    <Link to="/" className="link">
                        <img src="/maestro.png" width="30px"/>
                        <span className="texto-pagina-inicial">
                            RETOS MATEMÁTICOS
                            </span>
                    </Link>
                </div>
                

                <span className="bloque-central">
                    ¡Una forma fácil de retarte y aprender!
                    </span>
                
                <span className="bloque-derecho">
                    ¡EMPIEZA AHORA!
                    </span>

                
            </header>
        </>
    );
}