import HeaderPrincipal from "../components/HeaderPrincipal";
import "./Login.css";
import {Link} from "react-router-dom";
import { useState } from "react";
export default function Login() {
    const [usuario,setUsuario] = useState("");
    const [usuarioTocado,setUsuarioTocado] = useState(false);
    const [contrasena,setContrasena] = useState("");
    const [contrasenaTocada,setContrasenaTocada] = useState(false);

    
    return (
        <>
        <HeaderPrincipal/>
        <div className="fondo-login">
            <div className="recuadro-login">
                <h1>Iniciar Sesión</h1>
                <h2>Usuario</h2>
                <input
                type="text"
                placeholder=""
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                onBlur={() => setUsuarioTocado(true)}
                />
                <span className={usuarioTocado ? "error-visible":"error-oculto"}>
                    Ingrese su nombre de usuario</span>
                <h2>Contraseña</h2>
                <input
                type="password"
                placeholder=""
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                onBlur={() => setContrasenaTocada(true)}
                />
                <span className={contrasenaTocada ? "error-visible":"error-oculto"}>
                    Ingrese su contraseña</span>
                <button className="boton-login">
                    Inicia Sesión
                </button>
                <span>¿No tienes cuenta?
                {" "}
                <Link to="/register" className="link-login">
                    Regístrate ahora
                </Link>
                </span>
            </div>
        </div>
        </>
    )
}