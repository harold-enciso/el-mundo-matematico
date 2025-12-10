import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import perfil from "../assets/perfil.svg";
import logo from "/elmundomatematico.png";
import "./Header.css";
import DropdownMenu from "../dropdown/DropdownMenu";
import DropdownPerfil from "../dropdown/DropdownPerfil";
import DropdownNotificaciones from "../dropdown/DropdownNotificaciones";
import { useState, useEffect } from "react";

import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function HeaderPrincipal() {
    //Cargamos el usuario validado en UserContext
    const {user,cargando} = useContext(UserContext);
    if (cargando) return null;
    return (
            <header className="fondo-header-principal">
                <div className="bloque izquierdo">
                    <DropdownMenu/>
                    <Link to="/" className="link">
                        <img src={logo} width="30px" alt="logo"/>
                        <div className="texto-logo">
                            <span className="texto-pagina-inicial">
                                EL MUNDO
                            </span>
                            <span>{" "}</span>
                            <span className="texto-pagina-inicial">
                                MATEMÁTICO
                            </span>
                        </div>
                    </Link>
                </div>
                

                <div className="bloque central">
                    {user ? (
                        <>
                        <p>Bienvenido, {user.username ? user.username : user.email.split("@")[0] }</p>
                        <Link to="/dashboard" className="link">
                        <span className="boton-header">Dashboard</span>
                        </Link>
                        </>
                    ) : (
                        <Link to="/dashboard" className="link">
                        <span className="boton-header">Dashboard</span>
                        </Link>
                    )}
                </div>
                
                <div className="bloque derecho">
                    {user ? (
                        <>
                        <DropdownNotificaciones/>
                        <DropdownPerfil/>
                        </>
                        ) : (
                        <>
                        <Link to="/login" className="link">
                            <span className="texto-boton">Inicia Sesión</span>
                        </Link>
                        <Link to="/register" className="link">
                            <span className="boton-header">Regístrate</span>
                        </Link>
                        </>
                    )}
                    
                    
                                       
                    </div>

                

            </header>
    );
}