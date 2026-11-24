import { useState } from "react";
import { TextoMatematico } from "./TextoMatematico";
import "./EjemploResueltoModulo.css";

export function EjemploResueltoModulo({ enunciado, problema, pasos = [], respuesta, resultado }) {
  const [abierto, setAbierto] = useState(false);
  const textoEnunciado = enunciado || problema || "";
  const textoRespuesta = respuesta || resultado || "";

  return (
    <div className="modulo-ejemplo">
      <div className="ejemplo-header">
        <span className="ejemplo-tag">Ejemplo Resuelto</span>
        <div className="ejemplo-enunciado">
          <TextoMatematico contenido={textoEnunciado} />
        </div>
      </div>

      <button type="button" className="ejemplo-toggle-btn" onClick={() => setAbierto(!abierto)}>
        {abierto ? "Ocultar Solución" : "Ver Solución Paso a Paso"}
      </button>

      {abierto && (
        <div className="ejemplo-solucion-box">
          <ol className="ejemplo-pasos">
            {pasos.map((paso, idx) => (
              <li key={`paso-${idx}-${String(paso).slice(0, 10)}`}>
                <TextoMatematico contenido={paso} inline />
              </li>
            ))}
          </ol>
          {textoRespuesta && (
            <div className="ejemplo-respuesta-final">
              <strong>Resultado:</strong>{" "}
              <TextoMatematico contenido={textoRespuesta} inline />
            </div>
          )}
        </div>
      )}
    </div>
  );
}