import { useState } from "react";
import "./EjemploResueltoModulo.css";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export function EjemploResueltoModulo({ enunciado, pasos = [], respuesta }) {
  const [abierto, setAbierto] = useState(false);

  // Función auxiliar para renderizar KaTeX si detecta símbolos de fórmulas (\cdot, ^, \frac, etc.)
  const renderizarTextoOMath = (texto) => {
    if (!texto) return null;
    const contieneMath = /[\\^_{}]/.test(texto);
    return contieneMath ? <InlineMath math={texto} /> : texto;
  };

  return (
    <div className="modulo-ejemplo">
      <div className="ejemplo-header">
        <span className="ejemplo-tag">Ejemplo Resuelto</span>
        <div className="ejemplo-enunciado">
          {renderizarTextoOMath(enunciado)}
        </div>
      </div>

      <button className="ejemplo-toggle-btn" onClick={() => setAbierto(!abierto)}>
        {abierto ? "Ocultar Solución" : "Ver Solución Paso a Paso"}
      </button>

      {abierto && (
        <div className="ejemplo-solucion-box">
          <ol className="ejemplo-pasos">
            {pasos.map((paso, idx) => (
              <li key={idx}>{renderizarTextoOMath(paso)}</li>
            ))}
          </ol>
          {respuesta && (
            <div className="ejemplo-respuesta-final">
              <strong>Resultado:</strong> {renderizarTextoOMath(respuesta)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}