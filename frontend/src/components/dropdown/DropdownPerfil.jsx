import "./Dropdown.css";
import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import perfil from "../../assets/perfil.svg";
import { useToast } from "../../context/useToast";

export default function DropdownPerfil() {
    const { showToast } = useToast();
    const [open, setOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    
    const { user, cargando, setUser } = useContext(UserContext);

    useEffect(() => {
        if (!cargando && !user?.token) {
            navigate("/login");
        }
    }, [user, cargando, navigate]);

    // Función de cierre con transición de 250ms
    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => setOpen(false), 250);
    };

    const toggleMenu = () => {
        if (open) {
            handleClose();
        } else {
            setOpen(true);
            setTimeout(() => setIsAnimating(true), 10);
        }
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target) && open) {
                handleClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const logout = () => {
        handleClose();
        localStorage.removeItem("token");
        showToast("Sesión cerrada", "info");
        navigate("/login");
        setUser(null);
    };

    if (cargando || !user) return null;

    return (
        <div className="dropdown-button perfil" ref={menuRef}>
            <button className="icon-dropdown perfil" onClick={toggleMenu} aria-label="Menú de usuario">
                <img src={perfil} width="40px" alt="perfil" />
            </button>
            
            {open && (
                <div className={`dropdown-menu right ${isAnimating ? "visible" : "closing"}`}>
                    <div className="perfil-header">
                        Hola, {user.username}
                    </div>

                    <div className="perfil-lista">
                        <Link to="/dashboard/perfil" onClick={handleClose} className="perfil-link">
                            Perfil
                        </Link>
                        
                        {user.role === "admin" && (
                            <Link to="/admin/dashboard" onClick={handleClose} className="perfil-link">
                                ADMIN
                            </Link>
                        )}

                        <Link to="/dashboard" onClick={handleClose} className="perfil-link">
                            DASHBOARD
                        </Link>

                        <hr className="linea" />

                        <button onClick={logout} className="perfil-btn rojo">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}    
        </div>
    );
}