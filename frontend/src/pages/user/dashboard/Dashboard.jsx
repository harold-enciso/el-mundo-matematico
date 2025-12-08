import "./Dashboard.css";
import { Outlet } from "react-router-dom";
import SidebarUser from "../../../components/SidebarUser";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";


export default function Dashboard(){
 
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
        <>
        <div>
            <SidebarUser/>
            <div className="fondo-dashboard">
                <Outlet/>
            </div>    
        </div>
        </>
    )
}