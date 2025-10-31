import "./Juegos.css";

import HeaderPrincipal from "../../components/HeaderPrincipal";
import { useEffect, useState } from "react";
export default function Sudoku(){
    const apiUrl = import.meta.env.VITE_API_URL;
    //Cuando se necesite la url completa se usara: const fullUrl = `${apiUrl}/juegos/sudoku`;
    const [pdfUrl, setPdfUrl] = useState("");
    //Declaro un useEffect al iniciar la pagina
    useEffect(() => {
        fetch(`${apiUrl}/pdf/Numeros-Racionales.pdf`)
        .then(res => res.json())
        .then(data => setPdfUrl(data.url))
    },[]);
    return(
        <>
        <HeaderPrincipal />
        <div className="fondo-juegos">
            <div className="area-juego">
                <h1>SUDOKU</h1>
                <div>
                    {pdfUrl &&(
                        <embed
                            src={pdfUrl}
                            title="PDF"
                            className="pdf-frame"
                        ></embed>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}