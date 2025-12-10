import "../DashboardAdmin.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import { ModalContext } from "../../../../context/ModalContext";
import { useToast } from "../../../../context/useToast";
export default function GestionPresentaciones() {
    const navigate = useNavigate();
    const { user, cargando } = useContext(UserContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const {showToast} = useToast();
    // Estados del explorador
    const [currentFolder, setCurrentFolder] = useState(""); 
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showModal, showLoading, hideLoading } = useContext(ModalContext);
    const [isViewingFile, setIsViewingFile] = useState(false);
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    // Validación de seguridad
    useEffect(() => {
        if (!cargando && !user?.token) {
            navigate("/login");
        } else if (user && user.role !== "admin") {
            navigate("/dashboard");
        }
    }, [user, cargando, navigate]);

    if (cargando || !user) return null;

    // Cargar lista de archivos
    function loadFiles(folder = "") {
    setLoading(true);

    fetch(`${apiUrl}/files?folder=${folder}`)
        .then(res => res.json())
        .then(data => {
            setFiles(data);
        })
        .catch(error => {
            console.error("Error cargando archivos:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        loadFiles(currentFolder);
    }, [currentFolder]);

    // Cambio de carpeta
    function goUp() {
        if (!currentFolder) return;
        const parts = currentFolder.split("/");
        parts.pop();
        setCurrentFolder(parts.join("/"));
    }

    //abrir archivo
    function openFile(fileName) {
        if (!fileName) return;

        const cleanFolder = currentFolder ? `${currentFolder}` : "";

        const url = cleanFolder
            ? `${apiUrl}/files/${fileName}?folder=${cleanFolder}`
            : `${apiUrl}/files/${fileName}`;

        setSelectedFileUrl(url);
        setSelectedFileName(fileName);
        setIsViewingFile(true);
    }

    function deleteFile() {
        showModal({
            title: "Eliminar archivo",
            message: `¿Seguro que deseas borrar "${selectedFileName}"?`,
            onConfirm: () => {
                showLoading("Eliminando archivo...");

                const filePath = currentFolder
                    ? `${currentFolder}/${selectedFileName}`
                    : selectedFileName;

                const url = `${apiUrl}/files/?file_path=${filePath}`;

                fetch(url, { method: "DELETE" })
                .then(async res => {
                    if (!res.ok) {
                        const text = await res.text(); // captura HTML o mensaje del error
                        console.error("Error al eliminar archivo:", text);
                        throw new Error("No se pudo eliminar el archivo.");
                    }
                    return res.json(); // solo si ok
                })
                .then(data => {
                    console.log("Archivo eliminado:", data);
                    showToast("Archivo eliminado", "info");
                    setIsViewingFile(false);
                    setSelectedFileUrl(null);
                    setSelectedFileName(null);
                    loadFiles(currentFolder);
                })
                .catch(err => {
                    console.error(err);
                    showModal({
                        title: "Error",
                        message: err.message || "No se pudo eliminar el archivo."
                    });
                })
                .finally(() => hideLoading());
            },
            showCancel: true
        });
    }

    return (
    <>
        <h1>Gestión de Presentaciones</h1>

        {isViewingFile ? (
            /* ======= Vista de archivo ======= */
            <div style={{
                    width: "95%",
                    maxWidth: "900px",   // o 700px si quieres
                    margin: "0 auto",
                }}>
                <button onClick={() => setIsViewingFile(false)}>⬅ Volver</button>
                <button 
                    style={{ marginLeft: "10px", background: "red", color: "white" }}
                    onClick={deleteFile}
                >
                    🗑 Borrar archivo
                </button>
                <h3>{selectedFileName}</h3>

                {selectedFileName.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                        src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(selectedFileUrl)}`}
                        width="100%"
                        height="700px"
                        style={{
                            border: "none",
                            borderRadius: "10px",
                        }}
                    ></iframe>
                ) : selectedFileName.match(/\.(png|jpg|jpeg|webp|gif)$/i) ? (
                    <img src={selectedFileUrl} style={{ maxWidth: "100%" }} />
                ) : (
                    <p>
                        No se puede previsualizar este archivo.{" "}
                        <a href={selectedFileUrl} target="_blank">
                            Descargar
                        </a>
                    </p>
                )}
            </div>
        ) : (
            /* ======= Lista de archivos ======= */
            <>
                <div>
                    <strong>Carpeta actual:</strong> /{currentFolder || "(root)"}
                </div>
                <button onClick={goUp} disabled={!currentFolder}>
                    ⬆ Subir
                </button>
                {loading && <p>Cargando...</p>}

                <ul className="file-list">
                    {files.map(item => (
                        <li key={item.name} className="file-item">
                            {item.is_dir ? (
                                <span
                                    className="folder"
                                    onClick={() =>
                                        setCurrentFolder(
                                            currentFolder 
                                                ? `${currentFolder}/${item.name}`
                                                : item.name
                                        )
                                    }
                                >
                                    📁 {item.name}
                                </span>
                            ) : (
                                <span
                                    className="file"
                                    onClick={() => openFile(item.name)}
                                >
                                    📄 {item.name}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </>
        )}
    </>
);
}