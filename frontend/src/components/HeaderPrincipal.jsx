import { Link } from "react-router-dom";
import logo from "../assets/elmundomatematico.png";
import "./Header.css";
import DropdownMenu from "../dropdown/DropdownMenu";
import DropdownPerfil from "../dropdown/DropdownPerfil";
import DropdownNotificaciones from "../dropdown/DropdownNotificaciones";

import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function HeaderPrincipal() {
    //Cargamos el usuario validado en UserContext
    const {user,cargando} = useContext(UserContext);
    if (cargando) return null;
    return (
            <header className="header-principal">
                <div className="header-bloque header-izquierdo">
                    <DropdownMenu/>
                    <Link to="/" className="header-logo-link">
                        <img src={logo} className="header-logo-img" alt="El Mundo Matemático"/>
                        <span className="header-logo-texto">
                            El Mundo <strong>Matemático</strong>
                        </span>
                    </Link>
                </div>

                <nav className="header-bloque header-centro">
                    <Link to="/juegos" className="nav-link">Juegos</Link>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </nav>

                <div className="header-bloque header-derecho">
                    {user ? (
                    <>
                        <span className="user-saludo">
                        Hola, {user.username || user.email.split("@")[0]}
                        </span>
                        <DropdownNotificaciones />
                        <DropdownPerfil />
                    </>
                    ) : (
                    <>
                        <Link to="/login" className="btn-link-secundario">
                        Inicia Sesión
                        </Link>
                        <Link to="/register" className="btn-header-primario">
                        Regístrate
                        </Link>
                    </>
                    )}
                </div>
            </header>
    );
}