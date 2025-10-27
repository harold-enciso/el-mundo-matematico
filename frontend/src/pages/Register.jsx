import "./Login.css";
import { Link } from "react-router-dom";
import Header from "../components/Header";
//PAGINA DE REGISTRO
export default function Register() {
    return (
    <>
        <Header />
        <div className="fondo">
            <div className="recuadro-general">
                <div className="formulario">
                    <h1>Registrarse</h1>
                    <div className="recuadro-secundario">
                        <h3>Usuario</h3>
                        <input type="text" placeholder="" />
                        <h3>Contraseña</h3>
                        <input type="password" placeholder="" />
                        <button className="boton" onClick={() => alert("¡Has iniciado sesión!")}>
                            Registrarse
                        </button>
                    </div>
                    
                    
                </div>
                <div>
                    <span>¿Ya tienes cuenta? </span>
                    <Link to="/login">
                        <span className="texto-enlace">Iniciar Sesión</span>
                    </Link>
                </div>
            </div>
        </div>
    </>
    )
}