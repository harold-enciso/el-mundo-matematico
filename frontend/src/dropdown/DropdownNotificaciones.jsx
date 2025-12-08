import "./Dropdown.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import perfil from "../assets/perfil.svg";
import campana from "../assets/campana.svg"
import DropdownItem from "./DropdownItem";
export default function DropdownNotificaciones(){
    const [open,setOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navigate = useNavigate();
    //DEFINIMOS LOS DATOS DEL USUARIO
    const {user,cargando} = useContext(UserContext);
    //Validamos que exista el user y tenga token activo
    useEffect(() => {
        if (!cargando && !user?.token) {
            navigate("/login");
        }
    }, [user, cargando, navigate]);

    if (cargando || !user) return null;

    return(
        <div className="dropdown" ref={menuRef}>
            <button className="icon perfil" onClick={() => navigate("/dashboard/notificaciones")}>
                
                <img src={campana} width="40px" alt="perfil"/>
            </button>
            {open &&(
                <div className="dropdown-menu right">
                    <DropdownItem>
                        Notificación 1
                    </DropdownItem>
                    <DropdownItem>
                        Notificación 2
                    </DropdownItem>
                    <DropdownItem>
                        Notificación 3
                    </DropdownItem>
                    <hr className="linea"/>
                    <DropdownItem to="/dashboard/notificaciones" className="dropdown-item rojo" onClick={() => setOpen(false)}>
                        Ver todas mis notificaciones
                    </DropdownItem>
                    
                    
                </div>
            )}    
        </div>
    )
}