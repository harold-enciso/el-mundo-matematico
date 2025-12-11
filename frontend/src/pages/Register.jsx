import "./Login.css";
import {Link, useNavigate} from "react-router-dom";
import { useState, useContext } from "react";
import { useToast } from "../context/useToast";
import { ModalContext } from "../context/ModalContext";

export default function Register() {
    const {showLoading,hideLoading} = useContext(ModalContext);
    const navigate = useNavigate();
    const {showToast} = useToast();
    const [contrasena,setContrasena] = useState("");
    const [contrasenaTocada,setContrasenaTocada] = useState(false);
    const [correo,setCorreo] = useState("");
    const [correoTocado,setCorreoTocado] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const registerUrl = `${apiUrl}/auth/register`
    //POST
    const handleRegister = () => {
        if (!correo || !contrasena) {
            showToast("Completa todos los campos","warning");
            return;
        }
        showLoading("Registrando tu correo...");
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
            hideLoading();
            showToast("Se registró tu correo, ahora inicia sesión","success");
            navigate("/login");
        })
        .catch(err =>{
            console.log(err.detail)
            hideLoading();
            showToast("Error, email incorrecto o repetido","error");
            
            setCorreo("");
            setCorreoTocado(false);
            setContrasena("");
            setContrasenaTocada(false);
        })
    };
        
    return (
        <>
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