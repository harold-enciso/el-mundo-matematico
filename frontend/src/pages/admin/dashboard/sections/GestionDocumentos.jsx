import "../DashboardAdmin.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import construccion from "../../../../assets/construccion.svg"
import { useToast } from "../../../../context/useToast";
import DragAndDropUpload from "../../../../components/DragAndDropUpload";
import { ModalContext } from "../../../../context/ModalContext";




export default function GestionDocumentos(){
    const {showLoading,hideLoading} = useContext(ModalContext);
    const MAX_SIZE_MB = 10;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    const {showToast} = useToast();
    const apiUrl = import.meta.env.VITE_API_URL;
    const uploadUrl = `${apiUrl}/files/upload`;
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
    
    const [file,setFile] = useState(null);
    const [folder, setFolder] = useState("");

    //Capturo un evento de carga y cada cambio lo asigno a file
    const handleFileChange = (file) => {
        
        if (!file) return;
        if (file.size > MAX_SIZE_BYTES) {
            showToast(`El archivo no puede pesar más de ${MAX_SIZE_MB} MB`,"error");
            setFile(null);
            return;
        }
        setFile(file);
    }
    const handleRemoveFile = () => {
        setFile(null);
        const input = document.getElementById("fileInput");
        if (input) input.value = ""; // esto reinicia el input y permite volver a seleccionar el mismo archivo
    };
    const handleUpload = () => {
        if (!file) {
            showToast("Selecciona un archivo primero","warning");
            return;
        }
        showLoading("Subiendo archivo...");
        //Creo una variable que acepte el archivo
        const formData = new FormData();
        formData.append("file",file);
        formData.append("folder",folder);

        //Ahora llamo al fetch upload
        fetch(uploadUrl,{
            method: "POST",
            body: formData
        })
        .then((res)=>res.json())
        .then((data)=> {
            console.log(data.message);
            showToast("Archivo subido exitosamente.","success");
            
            setFile(null); // Limpiamos el estado del archivo
            document.getElementById("fileInput").value = ""; // Limpiamos el input
        })
        .catch((err)=> {
            console.error(err);
            showToast("Error al subir el archivo","error");
        })
        .finally(()=>{
            hideLoading();
        });
    };


    
    
    if (cargando || !user) return null;
    


    return(
        <>
            <h1>GESTIÓN DE DOCUMENTOS ADMIN</h1>
            <DragAndDropUpload onFileSelect={handleFileChange} file={file}/>
            <div style={{ marginBottom: "10px" }}>
                <label>
                    Carpeta de destino:{" "}
                    <input 
                        type="text" 
                        placeholder="ej: documentos/2025" 
                        value={folder}
                        className="campos-input"
                        onChange={(e) => setFolder(e.target.value)} 
                    />
                </label>
            </div>
            <button onClick={handleUpload}>Subir Archivo</button>
            {file && (
            <button
                onClick={handleRemoveFile}
            >
                Quitar archivo
            </button>
            )}
        </>
    )
}