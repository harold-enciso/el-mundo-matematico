import "../DashboardAdmin.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import construccion from "../../../../assets/construccion.svg"
import { useToast } from "../../../../context/useToast";


export default function GestionNotificaciones(){
    const {showToast}= useToast();
    const apiUrl = import.meta.env.VITE_API_URL;
    const notificationUrl = `${apiUrl}/noti/create`;
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
    const [newNotification,setNewNotification] = useState({})
    
    const sendNotification = () => {
        return fetch(notificationUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: newNotification.email,
                title: newNotification.title,
                message: newNotification.message
                
            })
        })
        .then(res => {
            //Capa de validacion del res como JSON
            return res.json()
                .catch(() => ({}))
                .then(data =>{
                    if (!res.ok){
                        throw data;
                    }
                    return data;
            })
        })
        .then(data => {
            //Aquí va el flujo correcto, data es lo que devuelve el back
            
            showToast("Se envió la notificacion correctamente","success")
            
            console.log("Notificación creada y enviada");
            console.log(data);
            setNewNotification({});
            
        })
        .catch(err =>{
            console.log(err.detail);
            if (err.detail === "No se pudieron validar las credenciales"){
                //Aqui debo meter el modal
                navigate("/login");
            } 
        })

    }    

    
    if (cargando || !user) return null;
    
    return(
        <>
            <h1>GESTIÓN DE NOTIFICACIONES ADMIN</h1>
            <h2>Correo electrónico</h2>
            <input
            type="text"
            placeholder=""
            value={newNotification.email ?? ""}
            onChange={(e) => setNewNotification({...newNotification,email:e.target.value})}
            className="campos-input"
            />
            <h2>Título</h2>
            <input
            type="text"
            placeholder=""
            value={newNotification.title ?? ""}
            onChange={(e) => setNewNotification({...newNotification,title:e.target.value})}
            className="campos-input"
            />
            <h2>Mensaje</h2>
            <input
            type="text"
            placeholder=""
            value={newNotification.message ?? ""}
            onChange={(e) => setNewNotification({...newNotification,message:e.target.value})}
            className="campos-input"
            />

            <button className="boton-dashboard-admin" onClick={()=>{
                sendNotification()
                }}>
                    Enviar Notificación
            </button>
            

        </>
    )
}