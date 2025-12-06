import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import "./Header.css";
import DropdownMenu from "../dropdown/DropdownMenu";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
export default function HeaderPrincipal() {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const meUrl = `${apiUrl}/auth/me`;
    const [usuario,setUsuario] = useState(null);
    const [cargando,setCargando] = useState(true);
    //LogOut
        const logout = () => {
            localStorage.removeItem("token");
            navigate("/login");
        };
    //Validamos el token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUsuario(null);
            setCargando(false);
            return;
        }

        fetch(meUrl,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok){
                setUsuario(null);
                setCargando(false);
                return;
            }
            return res.json()
        })
        .then(user => {
            if (user) {setUsuario(user.username || user.email.split('@')[0])};
            setCargando(false);
        });
    },[]);
    if (cargando) return null;
    return (
            <header className="fondo-header-principal">
                <div className="bloque izquierdo">
                    <DropdownMenu/>
                    <Link to="/" className="link">
                        <img src="/elmundomatematico.png" width="30px" alt="Maestro"/>
                        <div>
                            <span className="texto-pagina-inicial">
                                EL MUNDO
                            </span>
                            <span>{" "}</span>
                            <br className="salto-linea"/>
                            <span className="texto-pagina-inicial">
                                MATEMÁTICO
                            </span>
                        </div>
                    </Link>
                </div>
                

                <div className="bloque central">
                    {usuario ? (
                        <>
                        <p>Bienvenido, {usuario}</p>
                        <Link to="/dashboard" className="link">
                        <span className="boton-header">Dashboard</span>
                        </Link>
                        </>
                    ) : (
                        <Link to="/dashboard" className="link">
                        <span className="boton-header">Dashboard</span>
                        </Link>
                    )}
                </div>
                
                <div className="bloque derecho">
                    {usuario ? (
                        <>
                        <button className="button-header" onClick={logout}>
                            Cerrar Sesión
                        </button>
                        <Link to="/profile" className="link">
                            <span className="boton-header">Perfil</span>
                        </Link>
                        <DropdownMenu/>
                        </>
                        ) : (
                        <>
                        <Link to="/login" className="link">
                            <span className="texto-boton">Inicia Sesión</span>
                        </Link>
                        <Link to="/register" className="link">
                            <span className="boton-header">Regístrate</span>
                        </Link>
                        <DropdownMenu/>
                        </>
                    )}
                    
                    
                                       
                    </div>
                <div className="bloque menu">
                    
                </div>
                

            </header>
    );
}