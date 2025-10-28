import "./Juegos.css";

import HeaderPrincipal from "../../components/HeaderPrincipal";
export default function Sudoku(){

    return(
        <>
        <HeaderPrincipal />
        <div className="fondo-juegos">
            <div className="area-juego">
                <h1>SUDOKU</h1>
            </div>
        </div>
        </>
    )
}