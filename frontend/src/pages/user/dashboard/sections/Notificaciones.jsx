import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import NotificacionItem from "./NotificacionItem";
import tacho from "../../../../assets/tacho.svg";

export default function Notificaciones(){
    const apiUrl = import.meta.env.VITE_API_URL;
    const notiUrl = `${apiUrl}/noti/me`;
    const [notiSeleccionada, setNotiSeleccionada] = useState(null);
    const navigate = useNavigate();
    //DEFINIMOS LOS DATOS DEL USUARIO
    const {user,cargando} = useContext(UserContext);

    const [notificaciones,setNotificaciones] = useState([]);
    //Validamos que exista el user y tenga token activo
    useEffect(() => {
        if (!cargando && !user?.token) {
            navigate("/login");
        }
    }, [user, cargando, navigate]);
    const deleteNoti = () => {
        const notiDeleteUrl = `${apiUrl}/noti/delete/${id}`;
        return fetch(notiDeleteUrl, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al borrar");
            console.log("Eliminado correctamente");
            //Flujo correcto
            setNotiSeleccionada(false);
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetch(notiUrl,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => (res.ok ? res.json(): null))
        .then(noti => {
            setNotificaciones(noti)
        })
        .catch(err =>{
            console.log(err.detail);
            if (err.detail === "No se pudieron validar las credenciales"){
                //Aqui debo meter el modal
                navigate("/login");
            } 
        });
    },[deleteNoti])
    
    
    const [id,setId] = useState("");
    
    
    
    



    if (cargando || !user) return null;


    return(
        <>                
                {notiSeleccionada ? (
                    <>
                    <button onClick={() => setNotiSeleccionada(false)}>Volver</button>
                    <h2>{notiSeleccionada.title}</h2>
                    <p>{notiSeleccionada.message}</p>
                    <small>{notiSeleccionada.created_at}</small>
                    <button onClick={deleteNoti}>
                        <img src={tacho} width="500px"></img>
                    </button>
                    </>
                ) : (
                    notificaciones.length > 0 ? (notificaciones.map(noti =>(
                    <NotificacionItem
                        key={noti.id}
                        onClick={() => {
                            setNotiSeleccionada(noti);
                            setId(noti.id);
                        }}
                    >
                        <div className="notification-content">
                            <strong>{noti.title}</strong>
                            <p>{noti.message}</p>
                            <span>Fecha de envio: {noti.created_at}</span>
                        </div>
                    </NotificacionItem>))) : (
                        <>
                        <h1>NOTIFICACIONES</h1>
                        <p>No tienes notificaciones</p>
                        </>
                        
                    )

                )}

                
                
            
            
        </>
    )
}