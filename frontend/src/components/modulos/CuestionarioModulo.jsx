import { useState } from "react";
import { TextoMatematico } from "./TextoMatematico";
import "./CuestionarioModulo.css";

export function CuestionarioModulo({ pregunta, opciones = [], respuesta_correcta, explicacion }) {
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(null);
  const [respondido, setRespondido] = useState(false);

  const manejarSeleccion = (index) => {
    if (respondido) return;
    setIndiceSeleccionado(index);
    setRespondido(true);
  };

  const indiceCorrecto = respuesta_correcta ?? 0;

  return (
    <div className="modulo-cuestionario">
      <h4 className="cuestionario-pregunta">
        <TextoMatematico contenido={pregunta} inline />
      </h4>

      <div className="cuestionario-opciones">
        {opciones.map((opcion, index) => {
          const textoOpcion = typeof opcion === "string" ? opcion : opcion.texto;
          const esCorrecta =
            typeof opcion === "string" ? index === indiceCorrecto : opcion.esCorrecta;

          let claseBoton = "opcion-btn";
          if (respondido) {
            if (esCorrecta) claseBoton += " correcta";
            else if (index === indiceSeleccionado) claseBoton += " incorrecta";
          }

          return (
            <button
              key={`opcion-${index}-${String(textoOpcion).slice(0, 12)}`}
              type="button"
              className={claseBoton}
              onClick={() => manejarSeleccion(index)}
            >
              <TextoMatematico contenido={textoOpcion} inline />
            </button>
          );
        })}
      </div>

      {respondido && explicacion && (
        <div className="cuestionario-feedback">
          <div className="feedback-texto">
            <TextoMatematico contenido={explicacion} />
          </div>
        </div>
      )}
    </div>
  );
}