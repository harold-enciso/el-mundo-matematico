import "./Juegos.css";

import HeaderPrincipal from "../../components/HeaderPrincipal";
export default function Pentomino(){
    const apiUrl = import.meta.env.VITE_API_URL;
    const pdfFileName = 'Pentomino.pdf';
    const pdfUrl = `${apiUrl}/pdf/${pdfFileName}`;
    return(
        <>
        <HeaderPrincipal />
        <div className="fondo-juegos">
            
            <div className="area-juego">
                <h1>PENTOMINO</h1>
                <iframe
                    src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`}
                    width="100%"
                    height="900px" 
                    title="PDF Sudoku"
                />
            </div>
            <div className="area-puntaje">
                <h1>Puntaje</h1>
            </div>
        </div>
        </>
    )
}