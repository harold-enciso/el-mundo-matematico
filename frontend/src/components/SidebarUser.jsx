import "./Sidebar.css"
import SidebarItem from "./SidebarItem.jsx"
export default function SidebarUser(){

    return(
        <>
        <div className="fondo-sidebar-admin">
            <div className="sidebar-text">
                USUARIO
            </div>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/dashboard/progreso"}>Mi Progreso</SidebarItem>
            <SidebarItem to={"/dashboard/cursos"}>Mis Cursos</SidebarItem>
            <SidebarItem to={"/dashboard/metas"}>Mis Metas</SidebarItem>
            <SidebarItem to={"/dashboard/logros"}>Mis Logros</SidebarItem>
            <SidebarItem to={"/dashboard/puntos"}>Mis Puntos</SidebarItem>
            <SidebarItem to={"/dashboard/rankings"}>Rankings</SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/dashboard/suscripcion"}>Mi Suscripción</SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/dashboard/perfil"}>Perfil</SidebarItem>
            <SidebarItem to={"/dashboard/notificaciones"}>Notificaciones</SidebarItem>

        </div>
        </>
    )
}