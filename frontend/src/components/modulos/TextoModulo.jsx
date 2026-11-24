import { TextoMatematico } from "./TextoMatematico";
import "./TextoModulo.css";

export function TextoModulo({ titulo, texto }) {
  return (
    <div className="modulo-texto">
      {titulo && (
        <h2 className="texto-titulo">
          <TextoMatematico contenido={titulo} inline />
        </h2>
      )}
      <div className="texto-contenido">
        <TextoMatematico contenido={texto} />
      </div>
    </div>
  );
}