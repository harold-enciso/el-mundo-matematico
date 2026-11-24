import { useEffect, useRef } from "react";
import "mathlive";
import "./EditorFormulaVisual.css";

const BOTONES_ECUACION = [
  { etiqueta: "a / b", titulo: "Fracción", latex: "\\frac{#0}{#?}" },
  { etiqueta: "xⁿ", titulo: "Exponente / Potencia", latex: "^{#0}" },
  { etiqueta: "xₙ", titulo: "Subíndice", latex: "_{#0}" },
  { etiqueta: "√x", titulo: "Raíz cuadrada", latex: "\\sqrt{#0}" },
  { etiqueta: "ⁿ√x", titulo: "Raíz n-ésima", latex: "\\sqrt[#0]{#?}" },
  { etiqueta: "( )", titulo: "Paréntesis ajustables", latex: "\\left(#0\\right)" },
  { etiqueta: "·", titulo: "Multiplicación (punto)", latex: "\\cdot " },
  { etiqueta: "×", titulo: "Multiplicación (cruz)", latex: "\\times " },
  { etiqueta: "÷", titulo: "División", latex: "\\div " },
  { etiqueta: "±", titulo: "Más menos", latex: "\\pm " },
  { etiqueta: "≠", titulo: "Diferente", latex: "\\neq " },
  { etiqueta: "≤", titulo: "Menor o igual", latex: "\\leq " },
  { etiqueta: "≥", titulo: "Mayor o igual", latex: "\\geq " },
  { etiqueta: "π", titulo: "Pi", latex: "\\pi " },
  { etiqueta: "θ", titulo: "Theta", latex: "\\theta " },
  { etiqueta: "∞", titulo: "Infinito", latex: "\\infty " },
];

function limpiarPlaceholders(latex) {
  return (latex || "").replace(/\\placeholder\{[^}]*\}/g, "");
}

export default function EditorFormulaVisual({ valor = "", onChange, id }) {
  const mathFieldRef = useRef(null);

  useEffect(() => {
    const mf = mathFieldRef.current;
    if (!mf) return;
    if (limpiarPlaceholders(mf.value) !== valor) {
      mf.value = valor || "";
    }
  }, [valor]);

  useEffect(() => {
    const mf = mathFieldRef.current;
    if (!mf) return;

    const manejarInput = (e) => {
      onChange(limpiarPlaceholders(e.target.value));
    };

    mf.addEventListener("input", manejarInput);
    return () => mf.removeEventListener("input", manejarInput);
  }, [onChange]);

  const insertarPlantilla = (latexPlantilla) => {
    const mf = mathFieldRef.current;
    if (!mf) return;
    mf.focus();
    mf.executeCommand(["insert", latexPlantilla]);
    onChange(limpiarPlaceholders(mf.value));
  };

  return (
    <div className="editor-formula-visual">
      <div className="barra-herramientas-math">
        {BOTONES_ECUACION.map((btn) => (
          <button
            key={btn.titulo}
            type="button"
            className="btn-simbolo-math"
            title={btn.titulo}
            onClick={() => insertarPlantilla(btn.latex)}
          >
            {btn.etiqueta}
          </button>
        ))}
      </div>

      <div className="contenedor-math-field">
        <math-field id={id} ref={mathFieldRef} class="campo-math-live" />
      </div>

      <div className="pie-latex-generado">
        <span>Escribe directo (ej: / para fracción, ^ para exponente) o usa los botones</span>
        <span>LaTeX: {valor || "vacío"}</span>
      </div>
    </div>
  );
}