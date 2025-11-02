import "./Juegos.css";

import HeaderPrincipal from "../../components/HeaderPrincipal";
import { useEffect, useState } from "react";
export default function Sudoku(){
    const apiUrl = import.meta.env.VITE_API_URL;
    //Cuando se necesite la url completa se usara: const fullUrl = `${apiUrl}/juegos/sudoku`;
    const [pdfUrl, setPdfUrl] = useState("");
    //Declaro un useEffect al iniciar la pagina
    useEffect(() => {
        fetch(`${apiUrl}/pdf/Sudoku.pdf`)
        .then(res => res.json())
        .then(data => setPdfUrl(data.url))
    },[]);
    return(
        <>
        <HeaderPrincipal />
        <div className="fondo-juegos">
            
            <div className="area-juego">
                <h1>SUDOKU</h1>
                {pdfUrl && (
                    <object
                        data={pdfUrl}
                        type="application/pdf"
                        width="80%"
                        height="90%"
                    >
                        <p>
                        Tu navegador no puede mostrar el PDF.{" "}
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                            Descargar PDF
                        </a>
                        </p>
                    </object>
                    )}
            </div>
            <div className="area-puntaje">
                <h1>Puntaje</h1>
            </div>
        </div>
        </>
    )
}