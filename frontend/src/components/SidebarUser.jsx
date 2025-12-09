import "./Sidebar.css"
import SidebarItem from "./SidebarItem.jsx"
import usuarios from "../assets/usuarios.svg";
import progreso from "../assets/progreso.svg";
import notificaciones from "../assets/notificaciones.svg";
import cursos from "../assets/cursos.svg";
import ejercicios from "../assets/ejercicios.svg";
import logros from "../assets/logros.svg";
import metas from "../assets/metas.svg";
import documentos from "../assets/documentos.svg";
import presentaciones from "../assets/presentaciones.svg";
import videos from "../assets/videos.svg";
import puntos from "../assets/puntos.svg";
import juegos from "../assets/juegos.svg";
import rankings from "../assets/rankings.svg";
import suscripcion from "../assets/suscripciones.svg";
import analitica from "../assets/analitica.svg";
import configuracion from "../assets/configuracion.svg";
import perfil from "../assets/perfil2.svg";
export default function SidebarUser(){

    return(
        <>
        <div className="fondo-sidebar-admin">
            <div className="sidebar-titulo">
                USUARIO
            </div>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/dashboard/progreso"} source ={progreso} text={"Mi Progreso"}></SidebarItem>
            <SidebarItem to={"/dashboard/cursos"} source ={cursos} text={"Mis Cursos"}></SidebarItem>
            <SidebarItem to={"/dashboard/metas"} source ={metas} text={"Mis Metas"}></SidebarItem>
            <SidebarItem to={"/dashboard/logros"} source ={logros} text={"Mis Logros"}></SidebarItem>
            <SidebarItem to={"/dashboard/puntos"} source ={puntos} text={"Mis Puntos"}></SidebarItem>
            <SidebarItem to={"/dashboard/rankings"} source ={rankings} text={"Rankings"}></SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/dashboard/suscripcion"} source ={suscripcion} text={"Mi Suscripción"}></SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/dashboard/perfil"} source ={perfil} text={"Perfil"}></SidebarItem>
            <SidebarItem to={"/dashboard/notificaciones"} source ={notificaciones} text={"Notificaciones"}></SidebarItem>

        </div>
        </>
    )
}