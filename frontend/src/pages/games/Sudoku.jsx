import "./Juegos.css";
import { useState, useEffect, useRef } from "react";
export default function Sudoku(){
    const [cargando,setCargando] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [pdfViewerUrl, setPdfViewerUrl] = useState("");
    const fetchIniciado = useRef(false);
    const pdfFileName = 'Sudoku.pdf';
    const pdfUrl = `${apiUrl}/pdf/${pdfFileName}`;

    useEffect(() => {
        if (fetchIniciado.current) return;
        fetchIniciado.current = true;
        let objectUrl = null;

        // 1. Descargamos el PDF mediante una petición estándar para evitar el bloqueo del servidor
        fetch(pdfUrl)
            .then(response => response.blob())
            .then(blob => {
                // 2. Creamos un archivo temporal local en la memoria del navegador (blob:http...)
                objectUrl = URL.createObjectURL(blob);
                
                // 3. Pasamos esta ruta temporal al visor nativo. 
                // Al no tener "https://" en el parámetro, el servidor de producción no lo bloqueará.
                setPdfViewerUrl(`/pdfjs/web/viewer.html?file=${encodeURIComponent(objectUrl)}`);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error obteniendo el PDF:", error);
                setCargando(false);
            });

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [pdfUrl]);

    return(
        <div className="fondo-juegos">
            
            <div className="area-juego">
                <h1>SUDOKU</h1>
                
                <div className="area-pdf">
                    {cargando && (
                        <div className="fondo-carga">
                            <div className="simbolo-carga"></div>
                            <p>Cargando PDF...</p>
                        </div>
                    )}
                    {pdfViewerUrl && (
                        <iframe
                            src={pdfViewerUrl}
                            width="100%"
                            height="100%" 
                            title="PDF"
                            style={{ border: "none" }}
                        />
                    )}
                </div>
                <a 
                    href={pdfViewerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Abrir en Nueva Pestaña
                </a>
                <a 
                    href={pdfUrl} 
                    download={pdfFileName}
                >
                    Descargar PDF
                </a>

            </div>
            <div className="area-puntaje">
                <h1>Puntaje</h1>
            </div>
        </div>
    )
}