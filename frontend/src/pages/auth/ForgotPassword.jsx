import "./Login.css";
import { useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/useToast";
import { ModalContext } from "../../context/ModalContext";
import { Turnstile } from '@marsidev/react-turnstile';



export default function ForgotPassword() {
    const {showLoading,hideLoading} = useContext(ModalContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [correo,setCorreo] = useState("");
    const [correoTocado,setCorreoTocado] = useState(false);

    const [captchaToken,setCaptchaToken] = useState('');

    


    const apiUrl = import.meta.env.VITE_API_URL;
    const forgotPasswordUrl = `${apiUrl}/auth/forgot-password`

    const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;

    //POST
    const handleForgotPassword = (e) => {

        if (e) e.preventDefault();

        // Valida contenido en los campos
        if (!correo.trim()) {
            showToast("Ingresa tu correo", "warning");
            return;
        }

        // Validación limpia con Regex del formato del correo
        if (!emailRegex.test(correo)) {
            showToast("Ingresa un correo electrónico válido", "warning");
            return;
        }
        // Validar que el captcha esté completado
        if (!captchaToken) {
            showToast("Por favor, espera a que se valide el CAPTCHA", "warning");
            return;
        }
        showLoading("Enviando enlace de recuperación al correo electrónico...");
        fetch(forgotPasswordUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: correo,
                captcha_token: captchaToken
            })
        })
        .then(res => {
            //Capa de validacion del res como JSON
            return res.json()
                .catch(() => ({}))
                .then(data =>{
                    if (!res.ok){
                        throw data;
                    }
                    return data;
            })
        })
        .then(data => {
            //Aquí va el flujo correcto

            hideLoading();
            showToast(data.message,"success");

            navigate("/login");

        })
        .catch(err =>{
            
            console.log(err.detail);
            hideLoading();
            
            const mensajeError = err?.detail || "Error al enviar el código. Inténtalo más tarde.";
            showToast(mensajeError, "error");
            // Si falló, limpiamos el token para que resuelva el captcha nuevamente
            setCaptchaToken("");
            setCorreo("");
            setCorreoTocado(false);
        })
    };
    
    return (
        <div className="fondo-login">
            <form className="recuadro-login" onSubmit={handleForgotPassword} autoComplete="off">
                <h1>Recuperación de contraseña</h1>
                <p>
                    Ingrese su correo electrónico para enviarle el código de recuperación de su contraseña.
                </p>
                <div className="grupo-input">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                    id="email"
                    type="text"
                    placeholder=""
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onBlur={() => setCorreoTocado(true)}
                    //se puede agregar un classname dinamico
                    />
                    <span className={correoTocado && correo.length===0 ? "error-visible":"error-oculto"}>
                        Ingrese su correo electrónico</span>
                </div>
                <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess= {(token) => setCaptchaToken(token)}>
                </Turnstile>
                <button type="submit" className="boton-login" disabled={!captchaToken}>
                    Enviar enlace de recuperación
                </button>
                
                
                
            </form>
        </div>
    )
}