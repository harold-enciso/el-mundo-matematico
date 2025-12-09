import "../DashboardAdmin.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import construccion from "../../../../assets/construccion.svg"


export default function Analitica(){
 
    const navigate = useNavigate();
    //DEFINIMOS LOS DATOS DEL USUARIO
    const {user,cargando} = useContext(UserContext);
    //Validamos que exista el user y tenga token activo
    useEffect(() => {
        if (!cargando && !user?.token) {
            navigate("/login");
        }
        //Valido que user exista antes de sacar su rol
        else if (user && user.role !== "admin") {
            navigate("/dashboard");
        }
    }, [user, cargando, navigate]);
    if (cargando || !user) return null;
    
    return(
        <>
            <h1>ANALITICA ADMIN</h1>
            <img src={construccion} className="construccion"></img>
            <span className="texto-dashboard-admin">Página en construcción, ten paciencia.</span>

        </>
    )
}