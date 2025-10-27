import "./Login.css";
import { Link } from "react-router-dom";
import Header from "../components/Header";
//PAGINA DE LOGIN
export default function Login() {
    return (
    <>
        <Header />
        <div className="fondo">
            <div className="recuadro-general">
                <div className="formulario">
                    <h1>Iniciar Sesión</h1>
                    <div className="recuadro-secundario">
                        <h3>Usuario</h3>
                        <input type="text" placeholder="" />
                        <h3>Contraseña</h3>
                        <input type="password" placeholder="" />
                        <p>¿Olvidaste tu contraseña?</p>
                        <button className="boton" onClick={() => alert("¡Has iniciado sesión!")}>
                            Iniciar Sesión
                        </button>
                    </div>
                    
                    
                </div>
                <div>
                    <span>¿No tienes cuenta? </span>
                    <Link to="/register">
                        <span className="texto-enlace">Regístrate</span>
                    </Link>
                </div>
                        
            </div>
        </div>
    </>
    )
}