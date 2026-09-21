import "./Login.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import { useState, useContext } from "react";
import { useToast } from "../../context/useToast";
import { ModalContext } from "../../context/ModalContext";
import visible from "../../assets/visible.svg";
import invisible from "../../assets/invisible.svg";

export default function ResetPassword() {
    //Capturamos valor de token
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Captura el token de la URL (?token=...)

    const {showLoading,hideLoading} = useContext(ModalContext);
    const navigate = useNavigate();
    const {showToast} = useToast();
    
    
    
    const [contrasena,setContrasena] = useState("");
    const [contrasenaTocada,setContrasenaTocada] = useState(false);
    const [contrasena2,setContrasena2] = useState("");
    const [contrasena2Tocada,setContrasena2Tocada] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    const resetPasswordUrl = `${apiUrl}/auth/reset-password`
    
    const [mostrarContrasena,setMostrarContrasena] = useState(false);
    const [mostrarContrasena2,setMostrarContrasena2] = useState(false);


    //POST
    const handleResetPassword = (e) => {

        if (e) e.preventDefault();
        
        
        if (!token) {
            showToast("Token de recuperación no encontrado o inválido", "error");
            return;
        }
        // Valida contenido en los campos
        if (!contrasena.trim() || !contrasena2.trim()) {
            showToast("Completa todos los campos", "warning");
            return;
        }

        // Validar que ambas contraseñas coincidan
        if (contrasena !== contrasena2) {
            showToast("Las contraseñas no coinciden", "warning");
            return;
        }


        showLoading("Cambiando tu contraseña...");
        fetch(resetPasswordUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                new_password: contrasena
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
            console.log("Cambio de contraseña exitoso:", data);
            hideLoading();
            showToast("Se cambió tu contraseña, ahora inicia sesión","success");
            navigate("/login");
        })
        .catch(err =>{
            console.log("Err.detail: " + err.detail)
            hideLoading();
            const mensajeError = err?.detail || "Error al enviar el código. Inténtalo más tarde.";
            showToast(mensajeError, "error");
            

            setContrasena("");
            setContrasenaTocada(false);
            setContrasena2("");
            setContrasena2Tocada(false);
        })
    };
        
    return (
        <div className="fondo-login">
            <form className="recuadro-login" onSubmit={handleResetPassword} autoComplete="off">
                <h1>Recuperación de contraseña</h1>
                
                
                <div className="grupo-input">
                    <div className="label-wrapper">
                        <label htmlFor="password">Ingrese su nueva Contraseña</label>
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
                            Ingrese una contraseña</span>
                    <div className="label-wrapper">
                        <label htmlFor="password">Confirme su nueva contraseña</label>
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

                <button type="submit" className="boton-login">
                    Cambia tu contraseña
                </button>
                
            </form>
        </div>
    )
}