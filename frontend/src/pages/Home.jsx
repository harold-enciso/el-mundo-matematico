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
      <h1>Bienvenido a la KAHOOT de Matemáticas</h1>
      <p>Explora nuestras funcionalidades y disfruta de la experiencia.</p>
      <ul>
        <span>hola</span>
        <li>hola</li>
        <li>hola</li>
        <li>hola</li>
        <li>hola</li>
      </ul>
      <ol>
        <p>hola</p>
        <li>hola</li>
        <li>hola</li>
        <li>hola</li>
        <li>hola</li>
      </ol>
    </div>
    </>
  )
}