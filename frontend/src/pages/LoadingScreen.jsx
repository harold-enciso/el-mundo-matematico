import "./LoadingScreen.css";
import logo from "/elmundomatematico.png";

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <img src={logo} alt="El Mundo Matemático" className="loading-logo" />

      <h2 className="loading-title">El Mundo Matemático</h2>

      <div className="simbolo-carga"></div>
    </div>
  );
}