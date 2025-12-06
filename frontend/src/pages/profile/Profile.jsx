import HeaderPrincipal from "../../components/HeaderPrincipal";
import "./Profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Profile(){
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

    //Editable
    const[editable,setEditable] = useState(false);
    const token = localStorage.getItem("token");
    //Validamos el token
    useEffect(() => {
        
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
            setUsuario(user.username);
            setVerificado(user.verified);
            setNombre(user.first_name);
            setApellido(user.last_name);
            setNacimiento(user.birth_date);
            setPais(user.country);


            setPermitido(true);
        });
    },[]);

    const handleUpdate = () => {
        //Aqui podria colocar logica de validacion de los campos llenados

        return fetch(meUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usuario,
                first_name: nombre,
                last_name: apellido,
                birth_date: nacimiento,
                country: pais
            })
        })
        .then(res => {
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
            //Aquí va el flujo correcto
            console.log(data);
            
        })
        .catch(err =>{
            console.log(err.detail)
        })
    };




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
                <h1>Datos ¿no? editables</h1>
                <h2>Correo electrónico</h2>
                <input
                type="text"
                placeholder=""
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                readOnly
                className="campos-input"
                />
                <h2>Usuario</h2>
                <input
                type="text"
                placeholder=""
                value={usuario ?? ""}
                onChange={(e) => setUsuario(e.target.value)}
                readOnly={!editable}
                className="campos-input"
                />
                <h2>Nombre</h2>
                <input
                type="text"
                placeholder=""
                value={nombre ?? ""}
                onChange={(e) => setNombre(e.target.value)}
                readOnly={!editable}
                className="campos-input"
                />
                <h2>Apellidos</h2>
                <input
                type="text"
                placeholder=""
                value={apellido ?? ""}
                onChange={(e) => setApellido(e.target.value)}
                readOnly={!editable}
                className="campos-input"
                />
                <h2>Fecha de nacimiento</h2>
                <input
                type="date"
                placeholder=""
                value={nacimiento ?? ""}
                onChange={(e) => setNacimiento(e.target.value)}
                disabled={!editable}
                className="campos-input"
                />
                <h2>País</h2>
                <input
                type="text"
                placeholder=""
                value={pais ?? ""}
                onChange={(e) => setPais(e.target.value)}
                readOnly={!editable}
                className="campos-input"
                />
                <button className="boton-profile" onClick={()=>{
                    if (!editable) {
                        setEditable(true);
                        return;
                    }

                    handleUpdate()
                        .then(() => {
                            setEditable(false); // éxito → volver a modo lectura
                        })
                        .catch(err => {
                            console.log("Error:", err);
                        });
                    }}>
                    {!editable ? "Editar":"Guardar cambios"}
                </button>

            </div>
            
        </div>
        </>
    )
}