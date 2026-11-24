import "./Sidebar.css";
import SidebarItem from "./SidebarItem.jsx";
import cursos from "../../assets/cursos.svg";
import usuarios from "../../assets/usuarios.svg";

export default function SidebarAdmin() {
    return (
        <aside className="sidebar-admin">
            <div className="sidebar-header">
                <h2>Panel Admin</h2>
            </div>
            
            <nav className="sidebar-nav">
                <span className="sidebar-section-title">CONTENIDO</span>
                <SidebarItem to="/admin/dashboard/cursos" source={cursos} text="Gestión de Cursos" />
                
                <span className="sidebar-section-title">COMUNIDAD</span>
                <SidebarItem to="/admin/dashboard/usuarios" source={usuarios} text="Usuarios" />
            </nav>
        </aside>
    );
}