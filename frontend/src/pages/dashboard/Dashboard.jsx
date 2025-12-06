import HeaderPrincipal from "../../components/HeaderPrincipal";
import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Dashboard(){
    const [permitido,setPermitido] = useState(null);
 
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const meUrl = `${apiUrl}/auth/me`
    //DEFINIMOS LOS DATOS DEL USUARIO
    const [correo,setCorreo] = useState(null);
    const [id,setId] = useState(null);
    const [usuario,setUsuario] = useState(null);
    const [verificado,setVerificado] = useState(false);
    const [nombre,setNombre] = useState(null);
    const [apellido,setApellido] = useState(null);
    const [nacimiento,setNacimiento] = useState(null);
    const [pais,setPais] = useState(null);
    
    
    
    //Validamos el token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setPermitido(false);
            navigate("/login");
            return;
        }

        fetch(meUrl,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok){
                setPermitido(false);
                navigate("/login")
                return;
            }
            return res.json()
        })
        .then(user => {
            setId(user.id);
            setCorreo(user.email);
            setVerificado(user.verified);
            setUsuario(user.username);
            setPermitido(true);
        });
    },[]);

    




    if (permitido === null){
        return null;
    }

    if (permitido === false){
        return null;
    }

    return(
        <>
        <HeaderPrincipal />
        
        
        <div className="fondo-juegos">
            <div className="area-datos">
                <h1>DATOS<br/>PERSONALES</h1>

            </div>
            <div className="area-graficos">
                <h1>DASHBOARD PRIVADO</h1>
                
                <div className="area-pdf">
                    <p>Tu horrendo correo es {correo}</p>
                    {usuario  && <p>Tu horrendo usuario es {usuario}</p>}
                    {verificado && <p>Que rico estas verificado</p>}
                    {!verificado && <p>Que asco no estas verificado</p>}
                    <p>No se pa que quieres esta basura pero toma ahi ta tu id: {id}</p>
                </div>
                

            </div>
            
        </div>
        </>
    )
}