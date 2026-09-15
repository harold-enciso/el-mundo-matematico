import "./Login.css";
import {useSearchParams, Link} from "react-router-dom";
import { useEffect, useState} from "react";
import { useToast } from "../context/useToast";

export default function VerifyEmail() {
    //Capturamos valor de token
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Captura el token de la URL (?token=...)

    const {showToast} = useToast();
    const [verificado, setVerificado] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    

    const apiUrl = import.meta.env.VITE_API_URL;
    const verificationEmailUrl = `${apiUrl}/auth/verify-email?token=${token}`
    



    useEffect(() => {
        
        
        if (!token) {
            const msg = "Token de verificación no encontrado o inválido";
            setErrorMsg(msg);
            showToast(msg, "error");
            return;
        }


        //GET, es directo, sin method o body
        fetch(verificationEmailUrl)
        .then(res => {
            return res.json().then(data =>{
                if (!res.ok){
                    throw data;
                }
                return data;
            })
        })
        .then(data => {
            console.log("Verificación de correo exitosa:", data);
            setVerificado(true);
            showToast("Se validó tu correo, ahora inicia sesión","success");
        })
        .catch(err =>{
            console.log("Err.detail: " + err.detail)
            const mensajeError = err?.detail || "El enlace de verificación es inválido o ya fue utilizado.";
            setErrorMsg(mensajeError);
            showToast(mensajeError, "error");
            


        })
    },[]); //solo se ejecuta 1 vez
    //Estado de Error (Token inválido, expirado o ya usado)
    if (errorMsg) {
        return (
            <div className="fondo-login">
                <div className="recuadro-login">
                    <h2>Enlace inválido o expirado</h2>
                    <p>{errorMsg}</p>
                    <p>Si ya activaste tu cuenta, puedes ingresar a la página:</p>
                    <Link to="/login" className="link-login">
                        Ir al inicio de sesión
                    </Link>
                </div>
            </div>
        );
    }
    
    if (!verificado) {
        return (
        <div className="fondo-login">
            <div className="recuadro-login">
            <h2>Verificando tu correo...</h2>
            <p>Por favor espera un momento mientras validamos tu correo.</p>
            </div>
        </div>
    )
    }
       
    return (
        <div className="fondo-login">
            <div className="recuadro-login">
            <h2>Correo verificado</h2>
            <p>Tu cuenta ha sido activada correctamente.</p>
            <Link to="/login" className="link-login">
                Ir al inicio de sesión
            </Link>
            </div>
        </div>
    )
}