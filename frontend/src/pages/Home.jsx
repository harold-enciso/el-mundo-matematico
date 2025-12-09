import "./Home.css";
import logo from "/elmundomatematico.png";
import { useEffect,useState } from "react";
//PAGINA INICIAL
  const apiUrl = import.meta.env.VITE_API_URL;
  const fullUrl = `${apiUrl}/`;
  console.log('API URL COMPLETA EN PRODUCCIÓN:', fullUrl); // <-- ¡Importante!
export default function Home() {
  const [mensajeBienvenida,setMensajeBienvenida] = useState([]);
  
  useEffect(() => {
    fetch(fullUrl)
    .then(res => {
      return res.json();
    })
    .then(data => {
      setMensajeBienvenida(data.status);
    })
  },[])

  return (
    <>
      <div className="fondo">
        <h1>Bienvenido a El Mundo Matemático</h1>
        <p>La página aún está en construcción. Gracias por acceder, pronto todo estará {mensajeBienvenida}</p>
        <img src={logo} className="imagen-home" alt="logo"/>

    </div>
    </>
  )
}