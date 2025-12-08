import "./Dropdown.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import perfil from "../assets/perfil.svg";
import DropdownItem from "./DropdownItem";
export default function DropdownPerfil(){
    const [open,setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    //DEFINIMOS LOS DATOS DEL USUARIO
    const {user,cargando,setUser} = useContext(UserContext);
    //Validamos que exista el user y tenga token activo
    useEffect(() => {
        if (!cargando && !user?.token) {
            navigate("/login");
        }
    }, [user, cargando, navigate]);

    //Validar click externo para cerrar el dropdown
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //LogOut
    const logout = () => {
        setOpen(false);
        localStorage.removeItem("token");
        
        navigate("/login");
        setUser(null);
    };

    if (cargando || !user) return null;

    return(
        <div className="dropdown" ref={menuRef}>
            <button className="icon perfil" onClick={() => setOpen(!open)}>
                <img src={perfil} width="40px" alt="perfil"/>
            </button>
            {open && (
                <div className="dropdown-menu right">
                    <DropdownItem disabled>
                        Hola {user.username}
                    </DropdownItem>
                    <DropdownItem to="/dashboard/perfil" onClick={()=>setOpen(false)}>
                        Perfil
                    </DropdownItem>
                    {user.role === "admin" && (
                        <DropdownItem to="/admin/dashboard" onClick={()=>setOpen(false)}>
                            ADMIN
                        </DropdownItem>
                    )}
                    <hr className="linea"/>
                    <DropdownItem onClick={logout} className="dropdown-item rojo">
                        Cerrar Sesión
                    </DropdownItem>
                </div>
            )}    
        </div>
    )
}