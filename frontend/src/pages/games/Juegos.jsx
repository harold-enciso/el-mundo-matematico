import "./Juegos.css";
import "../Home.css";
import { Link } from "react-router-dom";
import { useEffect,useState } from "react";
  
  
export default function Juegos() {
  //Aquí van los estados
  const apiUrl = import.meta.env.VITE_API_URL;
  const juegosUrl = `${apiUrl}/juegos`;
  

  
  
  
  
  //Aquí va el código de la página principal
  return (
    <>
      <div className="fondo">
        <h1>Bienvenido a la sección de JUEGOS</h1>
        <p>Selecciona un juego</p>
      <div className="contenedor-tarjetas">
        <Link to="/juegos/sudoku" className="tarjeta azul">
          <h1>SUDOKU</h1>
          <img src="/sudoku.png" className="imagen" alt="Sudoku"></img>
        </Link>
        <Link to="/juegos/domino-fracciones" className="tarjeta roja">
          <div className="ajuste-linea">
            <h1>DOMINÓ DE</h1>
            <br className="salto-linea"/>
            <h1>FRACCIONES</h1>
          </div>
          <img src="/domino-fracciones.png" className="imagen" alt="Domino Fracciones"></img>
        </Link>
        <Link to="/juegos/pentomino" className="tarjeta verde">
            <h1>PENTOMINÓ</h1>
            <img src="/pentomino.png" className="imagen" alt="Pentomino"></img>
        </Link>
      </div>

    </div>
    </>
  )
}