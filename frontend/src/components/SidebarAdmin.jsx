import "./Sidebar.css"
import SidebarItem from "./SidebarItem.jsx"
export default function SidebarAdmin(){

    return(
        <>
        <div className="fondo-sidebar-admin">
            <div className="sidebar-text">
                GESTIÓN
            </div>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/usuarios"}>Usuarios</SidebarItem>
            <SidebarItem to={"/admin/dashboard/notificaciones"}>Notificaciones</SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/cursos"}>Cursos</SidebarItem>
            <SidebarItem to={"/admin/dashboard/ejercicios"}>Ejercicios</SidebarItem>
            <SidebarItem to={"/admin/dashboard/documentos"}>Documentos</SidebarItem>
            <SidebarItem to={"/admin/dashboard/presentaciones"}>Presentaciones</SidebarItem>
            <SidebarItem to={"/admin/dashboard/videos"}>Videos</SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/puntos"}>Puntos</SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/juegos"}>Juegos</SidebarItem>
            <SidebarItem to={"/admin/dashboard/rankings"}>Rankings</SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/suscripciones"}>Suscripciones</SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/analitica"}>Analitica</SidebarItem>
            <SidebarItem to={"/admin/dashboard/configuracion"}>Configuración</SidebarItem>

        </div>
        </>
    )
}