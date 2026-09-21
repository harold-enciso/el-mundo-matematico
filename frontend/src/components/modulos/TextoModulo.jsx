import "./TextoModulo.css";

export function TextoModulo({ titulo, texto }) {
  return (
    <div className="modulo-texto">
      {titulo && <h2 className="texto-titulo">{titulo}</h2>}
      <p className="texto-contenido">{texto}</p>
    </div>
  );
}