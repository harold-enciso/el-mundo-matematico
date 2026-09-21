import { useState } from "react";
import "./CuestionarioModulo.css";

export function CuestionarioModulo({ pregunta, opciones = [], respuesta_correcta, explicacion }) {
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(null);
  const [respondido, setRespondido] = useState(false);

  const manejarSeleccion = (index) => {
    if (respondido) return;
    setIndiceSeleccionado(index);
    setRespondido(true);
  };

  return (
    <div className="modulo-cuestionario">
      <h4 className="cuestionario-pregunta">{pregunta}</h4>
      
      <div className="cuestionario-opciones">
        {opciones.map((opcion, index) => {
          // Extrae el texto si la opción es un string directo o un objeto
          const textoOpcion = typeof opcion === "string" ? opcion : opcion.texto;
          
          // Evalúa si es correcta según el índice de la BD o la propiedad del objeto
          const esCorrecta = typeof opcion === "string" 
            ? index === respuesta_correcta 
            : opcion.esCorrecta;

          let claseBoton = "opcion-btn";
          if (respondido) {
            if (esCorrecta) claseBoton += " correcta";
            else if (index === indiceSeleccionado) claseBoton += " incorrecta";
          }

          return (
            <button
              key={index}
              className={claseBoton}
              onClick={() => manejarSeleccion(index)}
            >
              {textoOpcion}
            </button>
          );
        })}
      </div>

      {respondido && explicacion && (
        <div className="cuestionario-feedback">
          <p className="feedback-texto">{explicacion}</p>
        </div>
      )}
    </div>
  );
}