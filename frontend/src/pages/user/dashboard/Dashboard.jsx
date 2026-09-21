import "./Dashboard.css";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarUser from "../../../components/layout/SidebarUser";
import { useEffect, useContext } from "react";
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
        <div>
            <SidebarUser/>
            <div className="fondo-dashboard">
                <Outlet/>
            </div>    
        </div>
    )
}