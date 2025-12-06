import HeaderPrincipal from "../components/HeaderPrincipal";
import "./Login.css";
import {Link} from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate();

    const [correo,setCorreo] = useState("");
    const [correoTocado,setCorreoTocado] = useState(false);
    const [contrasena,setContrasena] = useState("");
    const [contrasenaTocada,setContrasenaTocada] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const loginUrl = `${apiUrl}/auth/login`
    //POST
    const handleLogin = () => {
        if (!correo || !contrasena) {
            alert("Completa todos los campos");
            return;
        }
        fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: correo,
                password: contrasena
            })
        })
        .then(res => {
            return res.json().catch(() => ({})).then(data =>{
                if (!res.ok){
                    throw data;
                }
                return data;
            })
        })
        .then(data => {
            //Aquí va el flujo correcto
            console.log("Login exitoso");
            //Guardamos el token de la data
            localStorage.setItem("token",data.access_token)
            alert("Login exitoso");
            //Limpiamos los campos
            setCorreo("");
            setCorreoTocado(false);
            setContrasena("");
            setContrasenaTocada(false);
            //Redirigimos al dashboard del usuario
            navigate("/dashboard");
        })
        .catch(err =>{
            console.log(err.detail)
            alert(err?.detail || "Error al iniciar sesión");
            setCorreo("");
            setCorreoTocado(false);
            setContrasena("");
            setContrasenaTocada(false);
        })
    };
    
    return (
        <>
        <HeaderPrincipal/>
        <div className="fondo-login">
            <div className="recuadro-login">
                <h1>Iniciar Sesión</h1>
                <h2>Correo electrónico</h2>
                <input
                type="text"
                placeholder=""
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onBlur={() => setCorreoTocado(true)}
                />
                <span className={correoTocado && correo.length===0 ? "error-visible":"error-oculto"}>
                    Ingrese su correo electrónico</span>
                <h2>Contraseña</h2>
                <input
                type="password"
                placeholder=""
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                onBlur={() => setContrasenaTocada(true)}
                />
                <span className={contrasenaTocada && contrasena.length===0 ? "error-visible":"error-oculto"}>
                    Ingrese su contraseña</span>
                <button className="boton-login" onClick={handleLogin}>
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