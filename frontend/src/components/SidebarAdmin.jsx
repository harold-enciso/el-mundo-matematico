import "./Sidebar.css";
import SidebarItem from "./SidebarItem.jsx";
import usuarios from "../assets/usuarios.svg";
import notificaciones from "../assets/notificaciones.svg";
import cursos from "../assets/cursos.svg";
import ejercicios from "../assets/ejercicios.svg";
import documentos from "../assets/documentos.svg";
import presentaciones from "../assets/presentaciones.svg";
import videos from "../assets/videos.svg";
import puntos from "../assets/puntos.svg";
import juegos from "../assets/juegos.svg";
import rankings from "../assets/rankings.svg";
import suscripciones from "../assets/suscripciones.svg";
import analitica from "../assets/analitica.svg";
import configuracion from "../assets/configuracion.svg";

export default function SidebarAdmin(){

    return(
        <>
        <div className="fondo-sidebar-admin">
            <div className="sidebar-titulo">
                GESTIÓN
            </div>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/usuarios"} source ={usuarios} text={"Usuarios"}></SidebarItem>
            <SidebarItem to={"/admin/dashboard/notificaciones"} source ={notificaciones} text={"Notificaciones"}></SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/cursos"} source ={cursos} text={"Cursos"}></SidebarItem>
            <SidebarItem to={"/admin/dashboard/ejercicios"} source ={ejercicios} text={"Ejercicios"}></SidebarItem>
            <SidebarItem to={"/admin/dashboard/documentos"} source ={documentos} text={"Documentos"}></SidebarItem>
            <SidebarItem to={"/admin/dashboard/presentaciones"} source ={presentaciones} text={"Presentaciones"}></SidebarItem>
            <SidebarItem to={"/admin/dashboard/videos"} source ={videos} text={"Videos"}></SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/puntos"} source ={puntos} text={"Puntos"}></SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/juegos"} source ={juegos} text={"Juegos"}></SidebarItem>
            <SidebarItem to={"/admin/dashboard/rankings"} source ={rankings} text={"Rankings"}></SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/suscripciones"} source ={suscripciones} text={"Suscripciones"}></SidebarItem>
            <hr className="sidebar-linea"></hr>
            <SidebarItem to={"/admin/dashboard/analitica"} source ={analitica} text={"Analitica"}></SidebarItem>
            <SidebarItem to={"/admin/dashboard/configuracion"} source ={configuracion} text={"Configuración"}></SidebarItem>

        </div>
        </>
    )
}