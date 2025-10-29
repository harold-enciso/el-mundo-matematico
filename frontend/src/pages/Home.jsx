import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect,useState } from "react";
import HeaderPrincipal from "../components/HeaderPrincipal";
//PAGINA INICIAL
export default function Home() {
  //Aquí van los estados
  //que es lo de arriba?? Los estados son variables que permiten almacenar y gestionar datos dentro de un componente funcional en React.
  const API_BASE_URL = "https://api.elmundomatematico.com";
  const [mensajeBienvenida,setMensajeBienvenida] = useState([]);
  //Debo usar un UseEffect no una funcion cuando es asi
  useEffect(() => {
    fetch(`${API_BASE_URL}/`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      setMensajeBienvenida(data.mensaje);
    })
  },[])
  

  
  
  
  
  //Aquí va el código de la página principal
  return (
    <>
    <HeaderPrincipal />
      <div className="fondo">
      <h1>Bienvenido a El mundo Matemático</h1>
      <p>La página aún está en construcción. {mensajeBienvenida}</p>
      <div className="contenedor-tarjetas">
        <Link to="/juegos/sudoku" className="tarjeta azul">
          <h1>SUDOKU</h1>
          <img src="/sudoku.png" width="46%" alt="Sudoku"></img>
        </Link>
        <Link to="/juegos/domino-fracciones" className="tarjeta roja">
          <h1>DOMINÓ DE FRACCIONES</h1>
          <img src="/domino-fracciones.png" width="46%" alt="Domino Fracciones"></img>
        </Link>
        <Link to="/juegos/pentomino" className="tarjeta verde">
            <h1>PENTOMINÓ</h1>
            <img src="/pentomino.png" width="46%" alt="Pentomino"></img>
        </Link>
      </div>

    </div>
    </>
  )
}