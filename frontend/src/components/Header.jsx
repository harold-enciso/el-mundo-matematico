import { Link } from "react-router-dom";
import "./Header.css";
export default function Header() {
    return (
        <>
            <header className="fondo-header-secundario">
                <Link to="/"><span className="texto-pagina-inicial">RETOS MATEMÁTICOS</span></Link>
            </header>
        </>
    );
}