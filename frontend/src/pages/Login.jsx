import "./Login.css";
import {Link} from "react-router-dom";
import { useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useModal } from "../context/useModal";
import { useToast } from "../context/useToast";
export default function Login() {
    const { showModal } = useModal();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const [correo,setCorreo] = useState("");
    const [correoTocado,setCorreoTocado] = useState(false);
    const [contrasena,setContrasena] = useState("");
    const [contrasenaTocada,setContrasenaTocada] = useState(false);
    const [procesando,setProcesando] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const loginUrl = `${apiUrl}/auth/login`
    //POST
    const handleLogin = () => {
        if (!correo || !contrasena) {
            showToast("Completa todos los campos","warning")
            
            return;
        }
        setProcesando(true);
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
            setProcesando(false);
            console.log("Login exitoso");
            //Guardamos el token de la data
            localStorage.setItem("token",data.token)
            //Guardamos la data en el user global
            setUser({
                token: data.token,
                id: data.id,
                email: data.email,
                username: data.username,
                role: data.role,
                first_name: data.first_name,
                last_name: data.last_name,
                birth_date: data.birth_date,
                country: data.country,
                verified: data.verified
            });
            
            showToast("Login exitoso","success");
            if (data.role === "admin") {
                navigate("/admin/dashboard")
                return;
            }
            navigate("/dashboard");

            

            
        })
        .catch(err =>{
            setProcesando(false);
            console.log(err.detail)
            showToast("Error al iniciar sesión","error");
            
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
                <button className="boton-login" onClick={handleLogin} disabled={procesando}>
                    {procesando ? "Procesando..." : "Inicia Sesión"}
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