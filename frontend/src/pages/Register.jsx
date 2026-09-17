import "./Login.css";
import {Link} from "react-router-dom";
import { useState, useContext } from "react";
import { useToast } from "../context/useToast";
import { ModalContext } from "../context/ModalContext";
import { Turnstile } from '@marsidev/react-turnstile';
import Seo from "../components/Seo";

import visible from "../assets/visible.svg";
import invisible from "../assets/invisible.svg";

export default function Register() {
    const {showLoading,hideLoading} = useContext(ModalContext);
    const {showToast} = useToast();

    const [captchaToken,setCaptchaToken] = useState('');

    const [contrasena,setContrasena] = useState("");
    const [contrasenaTocada,setContrasenaTocada] = useState(false);
    const [contrasena2,setContrasena2] = useState("");
    const [contrasena2Tocada,setContrasena2Tocada] = useState(false);
    const [correo,setCorreo] = useState("");
    const [correoTocado,setCorreoTocado] = useState(false);
    const [verificadorEnviado,setVerificadorEnviado] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const registerUrl = `${apiUrl}/auth/register`
    
    const [mostrarContrasena,setMostrarContrasena] = useState(false);
    const [mostrarContrasena2,setMostrarContrasena2] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;
    // Exige al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
    const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
    //POST
    const handleRegister = (e) => {

        if (e) e.preventDefault();
        
        // Valida contenido en los campos
        if (!correo.trim() || !contrasena.trim() || !contrasena2.trim()) {
            showToast("Completa todos los campos", "warning");
            return;
        }
        

        // Validación limpia con Regex del formato del correo
        if (!emailRegex.test(correo)) {
            showToast("Ingresa un correo electrónico válido", "warning");
            return;
        }
        // Validar que ambas contraseñas coincidan
        if (contrasena !== contrasena2) {
            showToast("Las contraseñas no coinciden", "warning");
            return;
        }
        // 4. Validación de fortaleza de la contraseña
        if (!passwordRegex.test(contrasena)) {
            showToast("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
                "warning"
            );
            return;
        }
        // Validar que el captcha esté completado
        if (!captchaToken) {
            showToast("Por favor, espera a que se valide el CAPTCHA", "warning");
            return;
        }
        showLoading("Enviando código de verificación a tu correo...");
        fetch(registerUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: correo,
                password: contrasena,
                captcha_token: captchaToken
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
            console.log(data);
            hideLoading();
            setVerificadorEnviado(true);
            showToast("Código de verificación enviado, revisa tu correo","success");
            //navigate("/login");
        })
        .catch(err =>{
            console.log("Err.detail: " + err.detail)
            hideLoading();
            if(err.detail === "Email ya registrado") {
                showToast("Email ya registrado","error");
                return;
            }
            showToast("Error, email incorrecto o repetido","error");
            // Si falló, limpiamos el token para que resuelva el captcha nuevamente
            setCaptchaToken("");
            setCorreo("");
            setCorreoTocado(false);
            setContrasena("");
            setContrasenaTocada(false);
            setContrasena2("");
            setContrasena2Tocada(false);
        })
    };
    // PANTALLA TIPO LIFEPOINTS (Se activa al terminar el registro)
    if (verificadorEnviado) {
        return (
        <div className="fondo-login">
            <Seo title="Registrarse | El Mundo Matemático" noindex />
            <div className="recuadro-login">
            <h2>Revisa tu correo electrónico</h2>
            <p>Hemos enviado un enlace de verificación de cuenta a:</p>
            <strong>{correo}</strong>

            <div>
                <p>1. Si no lo encuentras, revisa tu carpeta de Spam.</p>
                <p>2. Haz clic en el enlace de verificación dentro del mensaje.</p>
                <p>3. ¡Comienza a aprender en El Mundo Matemático!</p>
            </div>
            </div>
        </div>
        );
    }    
    return (
        <div className="fondo-login">
            <Seo title="Registrarse | El Mundo Matemático" noindex />
            <form className="recuadro-login" onSubmit={handleRegister} autoComplete="off">
                <h1>Registrarse</h1>
                <div className="grupo-input">
                <label htmlFor="email">Correo electrónico</label>
                <input
                id="email"
                type="text"
                placeholder=""
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onBlur={() => setCorreoTocado(true)}
                />
                <span className={correoTocado && correo.length===0 ? "error-visible":"error-oculto"}>
                    Ingrese su correo electrónico</span>
                </div>
                
                <div className="grupo-input">
                    <div className="label-wrapper">
                        <label htmlFor="password">Contraseña</label>
                    </div>
                    <div className="password-wrapper">
                        <input
                        id="password"
                        type={mostrarContrasena ? "text" : "password"}
                        placeholder=""
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        onBlur={() => setContrasenaTocada(true)}
                        />
                        {/*boton de ojo, el tabindex evita que se detecte con el tab*/}
                        <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setMostrarContrasena(!mostrarContrasena)}
                        tabIndex="-1"
                        >
                        {mostrarContrasena ? <img src={visible} alt="mostrar" width="40px" ></img> : <img src={invisible} alt="no mostrar" width="40px"></img>}
                        </button>
                    </div>
                     <span className={contrasenaTocada && contrasena.length===0 ? "error-visible":"error-oculto"}>
                            Ingrese su contraseña</span>
                    <div className="label-wrapper">
                        <label htmlFor="password2">Confirme su contraseña</label>
                    </div>
                    <div className="password-wrapper">
                        <input
                        id="password2"
                        type={mostrarContrasena2 ? "text" : "password"}
                        placeholder=""
                        value={contrasena2}
                        onChange={(e) => setContrasena2(e.target.value)}
                        onBlur={() => setContrasena2Tocada(true)}
                        />
                        {/*boton de ojo, el tabindex evita que se detecte con el tab*/}
                        <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setMostrarContrasena2(!mostrarContrasena2)}
                        tabIndex="-1"
                        >
                        {mostrarContrasena2 ? <img src={visible} alt="mostrar" width="40px" ></img> : <img src={invisible} alt="no mostrar" width="40px"></img>}
                        </button>
                    </div>
                    <span className={contrasena2Tocada && contrasena2.length===0 ? "error-visible":"error-oculto"}>
                            Ingrese nuevamente su contraseña</span>
                </div>
                <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess= {(token) => setCaptchaToken(token)}>
                </Turnstile>
                <div className="checkbox-container">
                    <input 
                        type="checkbox" 
                        id="politicas" 
                        checked={aceptaPoliticas} 
                        onChange={(e) => setAceptaPoliticas(e.target.checked)} 
                    />
                    <label htmlFor="politicas">
                        He leído y declaro que acepto la <a href="/privacy-policy" target="_blank" rel="noreferrer">Política de Privacidad</a>
                    </label>
                </div>
                <button type="submit" className="boton-login" disabled={!captchaToken || !aceptaPoliticas}>
                    Regístrate
                </button>
                <span>¿Ya tienes una cuenta?
                {" "}
                <Link to="/login" className="link-login">
                    Ingresa ahora
                </Link>
                </span>
            </form>
        </div>
    )
}