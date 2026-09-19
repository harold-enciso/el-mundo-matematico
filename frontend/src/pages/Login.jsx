import "./Login.css";
import {Link, useNavigate} from "react-router-dom";
import { useContext,useState } from "react";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/useToast";
import { ModalContext } from "../context/ModalContext";
import Seo from "../components/Seo";


import visible from "../assets/visible.svg";
import invisible from "../assets/invisible.svg";


export default function Login() {
    const {showLoading,hideLoading} = useContext(ModalContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const [correo,setCorreo] = useState("");
    const [correoTocado,setCorreoTocado] = useState(false);
    const [contrasena,setContrasena] = useState("");
    const [contrasenaTocada,setContrasenaTocada] = useState(false);
    const [mostrarContrasena,setMostrarContrasena] = useState(false);




    const apiUrl = import.meta.env.VITE_API_URL;
    const loginUrl = `${apiUrl}/auth/login`

    const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;

    //POST
    const handleLogin = (e) => {

        if (e) e.preventDefault();

        // Valida contenido en los campos
        if (!correo.trim() || !contrasena.trim()) {
            showToast("Completa todos los campos", "warning");
            return;
        }

        // Validación limpia con Regex del formato del correo
        if (!emailRegex.test(correo)) {
            showToast("Ingresa un correo electrónico válido", "warning");
            return;
        }
        showLoading("Iniciando sesión...");
        fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: correo.trim().toLowerCase(),
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
            hideLoading();
            showToast("Login exitoso","success");
            if (data.role === "admin") {
                navigate("/admin/dashboard")
                return;
            }
            navigate("/dashboard");

            

            
        })
        .catch(err =>{
            
            console.log(err.detail);
            hideLoading();
            if (err.status_code === 401) {
                showToast("Credenciales incorrectas. Por favor, verifica tus datos.","warning");
                setCorreo("");
                setCorreoTocado(false);
                setContrasena("");
                setContrasenaTocada(false);
                return;
            }
            if (err.status_code === 403) {
                showToast("Cuenta no verificada. Por favor, revisa tu correo.","warning");
                setCorreo("");
                setCorreoTocado(false);
                setContrasena("");
                setContrasenaTocada(false);
                return;
            }
            showToast("Error al iniciar sesión","error");
            
            setCorreo("");
            setCorreoTocado(false);
            setContrasena("");
            setContrasenaTocada(false);
        })
    };
    
    return (
        <div className="fondo-login">
            <Seo title="Iniciar Sesión | El Mundo Matemático" noindex />
            <form className="recuadro-login" onSubmit={handleLogin} autoComplete="off">
                <h1>Iniciar Sesión</h1>
                <div className="grupo-input">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                    id="email"
                    type="text"
                    placeholder=""
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onBlur={() => setCorreoTocado(true)}
                    //se puede agregar un classname dinamico
                    />
                    <span className={correoTocado && correo.length===0 ? "error-visible":"error-oculto"}>
                        Ingrese su correo electrónico</span>
                </div>
                
                
                <div className="grupo-input">
                    <div className="label-wrapper">
                        <label htmlFor="password">Contraseña</label>
                        <Link to="/forgot-password" className="link-login">
                            ¿Olvidaste tu contraseña?
                        </Link>
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
                </div>
                
                <button type="submit" className="boton-login">
                    Inicia Sesión
                </button>
                
                <span>¿No tienes cuenta?
                {" "}
                <Link to="/register" className="link-login">
                    Regístrate ahora
                </Link>
                </span>
            </form>
        </div>
    )
}