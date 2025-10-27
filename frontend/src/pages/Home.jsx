import "./Home.css";
import { Link } from "react-router-dom";
import { use, useEffect,useState } from "react";
import HeaderPrincipal from "../components/HeaderPrincipal";
//PAGINA INICIAL
export default function Home() {
  //Aquí van los estados
  //que es lo de arriba?? Los estados son variables que permiten almacenar y gestionar datos dentro de un componente funcional en React.


  
  
  
  
  //Aquí va el código de la página principal
  return (
    <>
    <HeaderPrincipal />
      <div className="fondo">
      <h1>Bienvenido a Retos Matemáticos</h1>
      <p>La página aún está en construcción</p>
      <ul>
        <li>Dominó de fracciones</li>
        <li>Sudoku</li>
        <li>Pentominó</li>
      </ul>
    </div>
    </>
  )
}