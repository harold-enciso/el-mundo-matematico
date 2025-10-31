import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect,useState } from "react";
import HeaderPrincipal from "../components/HeaderPrincipal";
//PAGINA INICIAL
// 📢 AÑADE UN LOG PARA VER LA URL COMPLETA EN PRODUCCIÓN
  const apiUrl = import.meta.env.VITE_API_URL;
  const fullUrl = `${apiUrl}/`;
  console.log('API URL COMPLETA EN PRODUCCIÓN:', fullUrl); // <-- ¡Importante!
export default function Home() {
  //Aquí van los estados
  //que es lo de arriba?? Los estados son variables que permiten almacenar y gestionar datos dentro de un componente funcional en React.
  const [mensajeBienvenida,setMensajeBienvenida] = useState([]);
  //Debo usar un UseEffect no una funcion cuando es asi
  useEffect(() => {
    fetch(fullUrl)
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
        <h1>Bienvenido al mundo Matemático</h1>
        <p>La página aún está en construcción. {mensajeBienvenida}</p>
      <div className="contenedor-tarjetas">
        <Link to="/juegos/sudoku" className="tarjeta azul">
          <h1>SUDOKU</h1>
          <img src="/sudoku.png" className="imagen" alt="Sudoku"></img>
        </Link>
        <Link to="/juegos/domino-fracciones" className="tarjeta roja">
          <h1>DOMINÓ DE FRACCIONES</h1>
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