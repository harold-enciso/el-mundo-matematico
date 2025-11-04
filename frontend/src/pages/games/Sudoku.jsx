import "./Juegos.css";

import HeaderPrincipal from "../../components/HeaderPrincipal";
import { useState, useEffect } from "react";
export default function Sudoku(){
    const [cargando,setCargando] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    //Cuando se necesite la url completa se usara: const fullUrl = `${apiUrl}/juegos/sudoku`;
    const pdfFileName = 'Sudoku.pdf';
    const pdfUrl = `${apiUrl}/pdf/${pdfFileName}`;

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'PDF_READY') {
                setCargando(false);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return(
        <>
        <HeaderPrincipal />
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
                        src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`}
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
        </>
    )
}