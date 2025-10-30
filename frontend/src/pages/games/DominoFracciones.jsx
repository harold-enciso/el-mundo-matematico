import "./Juegos.css";
import { useState } from "react";
import HeaderPrincipal from "../../components/HeaderPrincipal";
export default function DominoFracciones(){

    //Fichas iniciales de prueba front
    const [fichas,setFichas] = useState([
        {id: 1, fracciones: ["1/2","1/4"]},
        {id: 2, fracciones: ["2/8","1/3"]},
        {id: 3, fracciones: ["3/9","1/6"]}
    ])
    //Espacios
    const [espacios,setEspacios] = useState([null,null,null])

    
    return(
        <>
        <HeaderPrincipal />
        <div className="fondo-juegos">
            <div className="area-juego">
                <h1>DOMINO FRACCIONES</h1>
            </div>
        </div>
        </>
    )
}