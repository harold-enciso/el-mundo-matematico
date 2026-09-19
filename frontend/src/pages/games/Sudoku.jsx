import "./Juegos.css";

import { useState, useEffect } from "react";
export default function Sudoku(){
    const [cargando,setCargando] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    //Cuando se necesite la url completa se usara: const fullUrl = `${apiUrl}/juegos/sudoku`;
    const pdfFileName = 'Sudoku.pdf';
    const pdfUrl = `${apiUrl}/pdf/${pdfFileName}`;

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data === 'PDF_READY') {
                setCargando(false);
            }
            if (e.origin !== apiUrl) return;
        };
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

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
                    <iframe
                        src={`${window.location.origin}/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`}
                        width="100%"
                        height="900px" 
                        title="PDF"
                    />
                </div>
                <a 
                    href={`/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`} 
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