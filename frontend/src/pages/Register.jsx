import HeaderPrincipal from "../components/HeaderPrincipal";
import "./Login.css";
import {Link} from "react-router-dom";
import { useState } from "react";

export default function Register() {
    const [contrasena,setContrasena] = useState("");
    const [contrasenaTocada,setContrasenaTocada] = useState(false);
    const [correo,setCorreo] = useState("");
    const [correoTocado,setCorreoTocado] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const registerUrl = `${apiUrl}/auth/register`
    //POST
    const handleRegister = () => {
        if (!correo || !contrasena) {
            alert("Completa todos los campos");
            return;
        }
        fetch(registerUrl, {
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
            return res.json().then(data =>{
                if (!res.ok){
                    throw data;
                }
                return data;
            })
        })
        .then(data => {
            console.log("Registro exitoso:", data);
            alert("ERES UN GENIO, SE REGISTRÓ TU CORREO: " + data.email);
            setCorreo("");
            setCorreoTocado(false);
            setContrasena("");
            setContrasenaTocada(false);
        })
        .catch(err =>{
            console.log(err.detail)
            alert(err.detail || "Error, email incorrecto o repetido");
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
                <h1>Registrarse</h1>
                <h2>Correo electrónico</h2>
                <input
                type="email"
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
                <button className="boton-login" onClick={handleRegister}>
                    Regístrate
                </button>
                <span>¿Ya tienes una cuenta?
                {" "}
                <Link to="/login" className="link-login">
                    Ingresa ahora
                </Link>
                </span>
            </div>
        </div>
        </>
    )
}