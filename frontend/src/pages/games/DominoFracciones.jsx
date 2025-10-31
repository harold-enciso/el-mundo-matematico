import "./Juegos.css";

import HeaderPrincipal from "../../components/HeaderPrincipal";
import { useEffect, useState } from "react";
export default function DominoFracciones(){
    const apiUrl = import.meta.env.VITE_API_URL;
    //Cuando se necesite la url completa se usara: const fullUrl = `${apiUrl}/juegos/sudoku`;
    const [pdfUrl, setPdfUrl] = useState("");
    //Declaro un useEffect al iniciar la pagina
    useEffect(() => {
        fetch(`${apiUrl}/pdf/Domino-fracciones.pdf`)
        .then(res => res.json())
        .then(data => setPdfUrl(data.url))
    },[]);
    return(
        <>
        <HeaderPrincipal />
        <div className="fondo-juegos">
            <div className="area-puntaje">
                <h1>Puntaje</h1>
            </div>
            <div className="area-juego">
                <h1>DOMINÓ FRACCIONES</h1>
                {pdfUrl &&(
                        <iframe
                            src={pdfUrl}
                            title="PDF"
                            className="pdf-frame"
                        ></iframe>
                    )}
            </div>
        </div>
        </>
    )
}