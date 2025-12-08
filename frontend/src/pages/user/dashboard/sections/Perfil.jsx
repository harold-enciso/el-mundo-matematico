import "../Dashboard.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import construccion from "../../../../assets/construccion.svg"

export default function Perfil(){
    const apiUrl = import.meta.env.VITE_API_URL;
    const meUrl = `${apiUrl}/auth/me`;
    const navigate = useNavigate();
    //DEFINIMOS LOS DATOS DEL USUARIO
    const {user,cargando,setUser} = useContext(UserContext);
    //Hago una variable para almacenar la copia de user
    const [copiaUser,setCopiaUser] = useState(null);
    useEffect(()=>{
        if (!cargando && !user?.token) {
            navigate("/login");
        } else if (user) {
            //Hago una copia (...) de user para editarla dinamicamente:
            setCopiaUser({...user});
        }
        
    },[user,cargando,navigate])
    


    

    //Campo editable o no editable
    const[editable,setEditable] = useState(false);
    

    const handleUpdate = () => {
        //Aqui podria colocar logica de validacion de los campos llenados

        return fetch(meUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: copiaUser.username,
                first_name: copiaUser.first_name,
                last_name: copiaUser.last_name,
                birth_date: copiaUser.birth_date,
                country: copiaUser.country
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
            setUser({...user,
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                birth_date: data.birth_date,
                country: data.country
            })
            setEditable(false);
            alert("Tus datos han sido cambiados correctamente")
            console.log(data);
            
        })
        .catch(err =>{
            console.log(err.detail);
            if (err.detail === "No se pudieron validar las credenciales"){
                //Aqui debo meter el modal
                navigate("/login");
            } 
        })
    };
    if (cargando || !user || !copiaUser) return null;
    return(
        <>
            <h1>DATOS PERSONALES</h1>
            <h2>Correo electrónico</h2>
            <input
            type="text"
            placeholder=""
            value={copiaUser.email}
            onChange={(e) => setCopiaUser({...copiaUser,email:e.target.value})}
            readOnly
            className="campos-input"
            />
            <h2>Usuario</h2>
            <input
            type="text"
            placeholder=""
            value={copiaUser.username ?? ""}
            onChange={(e) => setCopiaUser({...copiaUser,username:e.target.value})}
            readOnly={!editable}
            className="campos-input"
            />
            <h2>Nombre</h2>
            <input
            type="text"
            placeholder=""
            value={copiaUser.first_name ?? ""}
            onChange={(e) => setCopiaUser({...copiaUser,first_name:e.target.value})}
            readOnly={!editable}
            className="campos-input"
            />
            <h2>Apellidos</h2>
            <input
            type="text"
            placeholder=""
            value={copiaUser.last_name ?? ""}
            onChange={(e) => setCopiaUser({...copiaUser,last_name:e.target.value})}
            readOnly={!editable}
            className="campos-input"
            />
            <h2>Fecha de nacimiento</h2>
            <input
            type="date"
            placeholder=""
            value={copiaUser.birth_date ?? ""}
            onChange={(e) => setCopiaUser({...copiaUser,birth_date:e.target.value})}
            disabled={!editable}
            className="campos-input"
            />
            <h2>País</h2>
            <input
            type="text"
            placeholder=""
            value={copiaUser.country ?? ""}
            onChange={(e) => setCopiaUser({...copiaUser,country:e.target.value})}
            readOnly={!editable}
            className="campos-input"
            />

            <button className="boton-dashboard" onClick={()=>{
                if (!editable) {
                    setEditable(true);
                    return;
                    //Si no estaba editable SOLO se pone editable
                }
                //Si estaba editable SE LLAMA A LA FUNCION ACTUALIZAR
                handleUpdate()
                }}>
                {!editable ? "Editar":"Guardar cambios"}
            </button>
                        
        </>
    )
}