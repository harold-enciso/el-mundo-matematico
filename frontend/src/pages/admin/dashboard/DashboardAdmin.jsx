import "./DashboardAdmin.css";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarAdmin from "../../../components/layout/SidebarAdmin";
import { useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";


export default function DashboardAdmin(){
 
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
        <div>
            <SidebarAdmin/>
            <div className="fondo-dashboard-admin">
                <Outlet/>
            </div>    
        </div>
    )
}