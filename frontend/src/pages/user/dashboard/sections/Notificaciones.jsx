import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import NotificacionItem from "./NotificacionItem";
import tacho from "../../../../assets/tacho.svg";
import { useToast } from "../../../../context/useToast";
import { useModal } from "../../../../context/useModal";

export default function Notificaciones(){
    const { showModal } = useModal();
    const { showToast } = useToast();
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
            
            //Flujo correcto
            console.log("Eliminado correctamente");
            showToast("Notificación eliminada","info");
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
                showToast("No se pudo validar tu usuario. Inicia Sesión","warning");
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
                    <div className="barra-notificaciones">
                        <button 
                        onClick={() => setNotiSeleccionada(false)}
                        className="barra-notificaciones-boton"
                        >
                            Volver
                        </button>
                        <button
                        onClick={ () => showModal({
                            title: "Eliminar registro",
                            message: `¿Estás seguro de eliminar la notificación?`,
                            onConfirm: () => deleteNoti()
                        })
                        }
                        className="barra-notificaciones-boton delete"
                        >
                            <img src={tacho} width="30px"></img>
                        </button>
                    </div>
                    
                    <h2>{notiSeleccionada.title}</h2>
                    <p className="parrafo-dashboard">{notiSeleccionada.message}</p>
                    <small>{new Date(notiSeleccionada.created_at).toLocaleDateString()}</small>
                    
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
                        <div className="parrafo-dashboard">
                            <strong>{noti.title}</strong>
                            <p>{noti.message}</p>
                            <span>Fecha de envio: {new Date(noti.created_at).toLocaleDateString()}</span>
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