import { useEffect, useRef, useState, useCallback } from "react";
import "mathlive";
import "./CampoTextoConFormulas.css";

const SIMBOLOS_RAPIDOS = [
  { etiqueta: "a/b", titulo: "Fracción", latex: "\\frac{#0}{#?}" },
  { etiqueta: "xⁿ", titulo: "Exponente", latex: "^{#0}" },
  { etiqueta: "xₙ", titulo: "Subíndice", latex: "_{#0}" },
  { etiqueta: "√x", titulo: "Raíz cuadrada", latex: "\\sqrt{#0}" },
  { etiqueta: "ⁿ√x", titulo: "Raíz n-ésima", latex: "\\sqrt[#0]{#?}" },
  { etiqueta: "·", titulo: "Multiplicación", latex: "\\cdot " },
  { etiqueta: "×", titulo: "Por", latex: "\\times " },
  { etiqueta: "±", titulo: "Más menos", latex: "\\pm " },
  { etiqueta: "≠", titulo: "Diferente", latex: "\\neq " },
  { etiqueta: "≤", titulo: "Menor o igual", latex: "\\leq " },
  { etiqueta: "≥", titulo: "Mayor o igual", latex: "\\geq " },
  { etiqueta: "π", titulo: "Pi", latex: "\\pi " },
  { etiqueta: "θ", titulo: "Theta", latex: "\\theta " },
];

const CONECTORES_MATH = new Set([
  "+", "-", "*", "/", "=", "·", "×", "÷", "±", "≠", "≤", "≥", "<", ">", "≈", "≡", "→",
]);

const PALABRAS_ESPANOL_CORTAS = new Set(["a", "y", "o", "e", "u"]);

const STOPWORDS_ESPANOL = new Set([
  "de", "la", "el", "en", "es", "un", "al", "lo", "le", "se", "su", "no",
  "si", "sí", "me", "te", "mi", "tu", "ni", "ya", "con", "por", "sin", "del",
  "los", "las", "una", "uno", "son", "sus", "ese", "esa", "eso", "que", "qué",
  "como", "cómo", "para", "pero", "más", "mas", "muy", "hay", "ser", "ver",
  "vez", "dos", "tres", "cada", "todo", "esta", "este", "esto", "forma",
]);

function limpiarPuntuacionExterna(token) {
  const matchInicio = /^([¿¡]+)/.exec(token);
  const prefijo = matchInicio ? matchInicio[1] : "";
  let nucleo = token.slice(prefijo.length);

  const matchFin = /([.,;:?!]+)$/.exec(nucleo);
  const sufijo = matchFin ? matchFin[1] : "";
  if (sufijo) {
    nucleo = nucleo.slice(0, -sufijo.length);
  }
  return { prefijo, nucleo, sufijo };
}

function normalizarLatexInicial(expr) {
  return expr
    .replace(/([\^_])([+-]?[a-zA-Z0-9]{2,}|[+-][a-zA-Z0-9]+)/g, "$1{$2}")
    .replace(/≠/g, "\\neq ")
    .replace(/≤/g, "\\leq ")
    .replace(/≥/g, "\\geq ")
    .replace(/±/g, "\\pm ")
    .replace(/×/g, "\\times ")
    .replace(/÷/g, "\\div ")
    .replace(/∞/g, "\\infty ");
}

function esTokenMatematicoFuerte(nucleo) {
  if (!nucleo) return false;
  if (/\\[a-zA-Z]+/.test(nucleo)) return true;
  if (/[\^_]/.test(nucleo)) return true;
  if (/[=≠≤≥±×÷√∞≈≡→]/.test(nucleo)) return true;
  if (/\)\s*\(/.test(nucleo)) return true;
  if (/^[+-]?\d+[a-zA-Z](\b|[)\]}])/.test(nucleo)) return true;
  if (/^\(?[a-zA-Z0-9]+\s*[+-]\s*[a-zA-Z0-9]+\)?/.test(nucleo)) return true;
  return false;
}

function evaluarTerminoAlgebraico(nucleo) {
  if (!nucleo) return { esTermino: false, esPalabraCorta: false };
  const sinParens = nucleo.replace(/^[([{]+|[)\]}]+$/g, "");
  if (!sinParens) return { esTermino: false, esPalabraCorta: false };

  const minuscula = sinParens.toLowerCase();
  if (STOPWORDS_ESPANOL.has(minuscula)) {
    return { esTermino: false, esPalabraCorta: false };
  }

  return {
    esTermino: /^[+-]?\d+(\.\d+)?$/.test(sinParens) || /^[+-]?[a-zA-Z]{1,3}$/.test(sinParens),
    esPalabraCorta: PALABRAS_ESPANOL_CORTAS.has(minuscula),
  };
}

function balancearParentesis(expresion) {
  let prefijoExtra = "";
  let sufijoExtra = "";
  let limpia = expresion;

  while (limpia.startsWith("(")) {
    const aperturas = (limpia.match(/\(/g) || []).length;
    const cierres = (limpia.match(/\)/g) || []).length;
    if (aperturas > cierres) {
      prefijoExtra += "(";
      limpia = limpia.slice(1);
    } else break;
  }

  while (limpia.endsWith(")")) {
    const aperturas = (limpia.match(/\(/g) || []).length;
    const cierres = (limpia.match(/\)/g) || []).length;
    if (cierres > aperturas) {
      sufijoExtra = ")" + sufijoExtra;
      limpia = limpia.slice(0, -1);
    } else break;
  }

  return { prefijoExtra, limpia, sufijoExtra };
}

// Convierte cadenas antiguas sin $ (ej: "E = (2^3 \cdot 2^4) / 2^5") en segmentos texto + math
function segmentarTextoLegacy(textoPlano) {
  const palabras = textoPlano.split(" ");
  const infoTokens = palabras.map((palabra) => {
    const { prefijo, nucleo, sufijo } = limpiarPuntuacionExterna(palabra);
    const fuerte = esTokenMatematicoFuerte(nucleo);
    const conector = CONECTORES_MATH.has(nucleo);
    const { esTermino, esPalabraCorta } = evaluarTerminoAlgebraico(nucleo);
    return {
      original: palabra,
      prefijo,
      nucleo,
      sufijo,
      conector,
      terminoAlg: esTermino,
      palabraEspanolCorta: esPalabraCorta,
      esMath: fuerte,
    };
  });

  for (let i = 0; i < infoTokens.length; i += 1) {
    const actual = infoTokens[i];
    if (actual.esMath || !actual.nucleo) continue;
    const prev = i > 0 ? infoTokens[i - 1] : null;
    const next = i < infoTokens.length - 1 ? infoTokens[i + 1] : null;
    const prevEsMathSinCorte = prev && prev.esMath && !prev.sufijo;
    const nextEsMathSinCorte = next && (next.esMath || next.conector) && !actual.sufijo;

    if (actual.conector && (prevEsMathSinCorte || nextEsMathSinCorte)) {
      actual.esMath = true;
      continue;
    }

    if (actual.terminoAlg) {
      if (actual.palabraEspanolCorta) {
        const tocadaPorOperador =
          (prev && prev.conector && !prev.sufijo) || (next && next.conector && !actual.sufijo);
        if (tocadaPorOperador) actual.esMath = true;
      } else if (prevEsMathSinCorte || nextEsMathSinCorte) {
        actual.esMath = true;
      }
    }
  }

  for (let i = 1; i < infoTokens.length - 1; i += 1) {
    const actual = infoTokens[i];
    if (
      actual.conector &&
      infoTokens[i - 1].esMath &&
      !infoTokens[i - 1].sufijo &&
      infoTokens[i + 1].esMath
    ) {
      actual.esMath = true;
    }
  }

  const segmentos = [];
  let i = 0;
  while (i < infoTokens.length) {
    const tok = infoTokens[i];
    if (!tok.esMath) {
      const sep = segmentos.length > 0 ? " " : "";
      segmentos.push({ tipo: "texto", valor: sep + tok.original });
      i += 1;
      continue;
    }

    if (segmentos.length > 0) segmentos.push({ tipo: "texto", valor: " " });
    if (tok.prefijo) segmentos.push({ tipo: "texto", valor: tok.prefijo });

    const partesMath = [tok.nucleo];
    let sufijoFinal = tok.sufijo;
    i += 1;

    while (i < infoTokens.length && infoTokens[i].esMath && !sufijoFinal) {
      const sig = infoTokens[i];
      if (sig.prefijo) break;
      partesMath.push(sig.nucleo);
      sufijoFinal = sig.sufijo;
      i += 1;
    }

    const { prefijoExtra, limpia, sufijoExtra } = balancearParentesis(partesMath.join(" "));
    if (prefijoExtra) segmentos.push({ tipo: "texto", valor: prefijoExtra });
    if (limpia) segmentos.push({ tipo: "math", valor: normalizarLatexInicial(limpia) });
    if (sufijoExtra || sufijoFinal) {
      segmentos.push({ tipo: "texto", valor: sufijoExtra + sufijoFinal });
    }
  }

  return segmentos;
}

function parsearContenidoInicial(texto) {
  if (!texto) return [];
  const partes = String(texto).split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);

  return partes.flatMap((parte) => {
    if (!parte) return [];
    if (parte.startsWith("$$") && parte.endsWith("$$")) {
      return [{ tipo: "math", valor: normalizarLatexInicial(parte.slice(2, -2).trim()) }];
    }
    if (parte.startsWith("$") && parte.endsWith("$")) {
      return [{ tipo: "math", valor: normalizarLatexInicial(parte.slice(1, -1).trim()) }];
    }
    return segmentarTextoLegacy(parte);
  });
}

function limpiarLatexMathLive(raw) {
  return raw
    .replace(/\\placeholder\{[^}]*\}/g, "")
    .replace(/\\exponentialE/g, "e")
    .replace(/\\imaginaryI/g, "i")
    .replace(/\\differentialD/g, "d");
}

function serializarNodo(nodo) {
  if (nodo.nodeType === Node.TEXT_NODE) {
    return (nodo.textContent || "").replace(/\u200B/g, "");
  }
  if (nodo.nodeType === Node.ELEMENT_NODE) {
    if (nodo.tagName === "MATH-FIELD") {
      const latex = limpiarLatexMathLive(nodo.value || "").trim();
      return latex ? `$${latex}$` : "";
    }
    if (nodo.tagName === "BR") {
      return "\n";
    }
    let interno = "";
    nodo.childNodes.forEach((hijo) => {
      interno += serializarNodo(hijo);
    });
    return interno;
  }
  return "";
}

export default function CampoTextoConFormulas({
  id,
  valor = "",
  onChange,
  placeholder = "",
  multilinea = false,
}) {
  const editorRef = useRef(null);
  const ultimoValorEmitidoRef = useRef(null);
  const mathFieldActivoRef = useRef(null);
  const [estaEnfocado, setEstaEnfocado] = useState(false);

  const emitirCambio = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    let resultado = "";
    el.childNodes.forEach((nodo, idx) => {
      if (
        nodo.nodeType === Node.ELEMENT_NODE &&
        (nodo.tagName === "DIV" || nodo.tagName === "P") &&
        idx > 0 &&
        !resultado.endsWith("\n")
      ) {
        resultado += "\n";
      }
      resultado += serializarNodo(nodo);
    });

    ultimoValorEmitidoRef.current = resultado;
    onChange(resultado);
  }, [onChange]);

  const salirDeMathField = useCallback((mf, direccion = "forward") => {
    const contenedor = editorRef.current;
    if (!contenedor || !mf.parentNode) return;

    contenedor.focus();
    const seleccion = window.getSelection();
    const rango = document.createRange();

    if (direccion === "backward") {
      rango.setStartBefore(mf);
      rango.collapse(true);
    } else {
      // Asegura un nodo de texto después del math-field para colocar el cursor cómodo
      let siguiente = mf.nextSibling;
      if (!siguiente || siguiente.nodeType !== Node.TEXT_NODE) {
        siguiente = document.createTextNode("\u200B");
        mf.parentNode.insertBefore(siguiente, mf.nextSibling);
      }
      rango.setStart(siguiente, siguiente.textContent.startsWith("\u200B") ? 1 : 0);
      rango.collapse(true);
    }

    seleccion.removeAllRanges();
    seleccion.addRange(rango);
    mathFieldActivoRef.current = null;
  }, []);

  const crearElementoMathField = useCallback(
    (latexInicial = "") => {
      const mf = document.createElement("math-field");
      mf.className = "math-inline-embed";
      mf.value = latexInicial;

      mf.addEventListener("focus", () => {
        mathFieldActivoRef.current = mf;
        setEstaEnfocado(true);
      });

      mf.addEventListener("blur", () => {
        if (mathFieldActivoRef.current === mf) {
          mathFieldActivoRef.current = null;
        }
        emitirCambio();
      });

      mf.addEventListener("input", () => {
        emitirCambio();
      });

      // Salir de la fórmula con flechas izquierda/derecha igual que en Word
      mf.addEventListener("move-out", (ev) => {
        ev.preventDefault();
        salirDeMathField(mf, ev.detail?.direction || "forward");
      });

      // Salir con Enter o Escape, o borrar cajita si está vacía con Backspace
      mf.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === "Escape") {
          ev.preventDefault();
          ev.stopPropagation();
          salirDeMathField(mf, "forward");
        } else if (ev.key === "Backspace" && !mf.value) {
          ev.preventDefault();
          ev.stopPropagation();
          const padre = mf.parentNode;
          const prev = mf.previousSibling;
          mf.remove();
          if (padre) {
            padre.focus();
            const sel = window.getSelection();
            const rango = document.createRange();
            if (prev && prev.nodeType === Node.TEXT_NODE) {
              rango.setStart(prev, prev.textContent.length);
            } else {
              rango.selectNodeContents(padre);
              rango.collapse(false);
            }
            sel.removeAllRanges();
            sel.addRange(rango);
          }
          emitirCambio();
        }
      });

      return mf;
    },
    [emitirCambio, salirDeMathField]
  );

  // Poblar el DOM inicial o cuando cambia el valor externamente
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (valor === ultimoValorEmitidoRef.current) return;

    el.innerHTML = "";
    const segmentos = parsearContenidoInicial(valor);

    segmentos.forEach((seg) => {
      if (seg.tipo === "math") {
        const mf = crearElementoMathField(seg.valor);
        el.appendChild(mf);
        el.appendChild(document.createTextNode("\u200B"));
      } else {
        const lineas = seg.valor.split("\n");
        lineas.forEach((linea, idxLinea) => {
          if (idxLinea > 0) {
            el.appendChild(document.createElement("br"));
          }
          if (linea) {
            el.appendChild(document.createTextNode(linea));
          }
        });
      }
    });

    ultimoValorEmitidoRef.current = valor;
  }, [valor, crearElementoMathField]);

  // Inserta una nueva cajita de fórmula visual en la posición exacta del cursor
  const insertarFormulaEnCursor = (plantillaLatex = "") => {
    const el = editorRef.current;
    if (!el) return;

    // Si ya estamos dentro de una cajita math-field, inserta el símbolo ahí mismo
    if (mathFieldActivoRef.current && el.contains(mathFieldActivoRef.current)) {
      const mfActual = mathFieldActivoRef.current;
      mfActual.focus();
      if (plantillaLatex) {
        mfActual.executeCommand(["insert", plantillaLatex]);
        emitirCambio();
      }
      return;
    }

    el.focus();
    const sel = window.getSelection();
    let rango;

    if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
      rango = sel.getRangeAt(0);
    } else {
      rango = document.createRange();
      rango.selectNodeContents(el);
      rango.collapse(false);
    }

    rango.deleteContents();
    const mf = crearElementoMathField("");
    const espacioPosterior = document.createTextNode("\u200B");

    rango.insertNode(espacioPosterior);
    rango.insertNode(mf);

    requestAnimationFrame(() => {
      mf.focus();
      if (plantillaLatex) {
        mf.executeCommand(["insert", plantillaLatex]);
      }
      emitirCambio();
    });
  };

  const manejarKeyDownContenedor = (e) => {
    // Si está dentro de math-field, ese componente maneja sus propias teclas
    if (e.target && e.target.tagName === "MATH-FIELD") return;

    // Escribir "$" o pulsar Ctrl+M abre una cajita de fórmula visual al instante
    if (e.key === "$" || (e.ctrlKey && e.key.toLowerCase() === "m")) {
      e.preventDefault();
      insertarFormulaEnCursor("");
      return;
    }

    // En campos de 1 sola línea (títulos, opciones, pasos), evitar saltos de línea con Enter
    if (!multilinea && e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className={`campo-hibrido-wrapper ${estaEnfocado ? "enfocado" : ""}`}>
      <div className="barra-campo-hibrido">
        <div className="grupo-botones-math-inline">
          <button
            type="button"
            className="btn-insertar-math-inline"
            onMouseDown={(e) => {
              e.preventDefault();
              insertarFormulaEnCursor("");
            }}
          >
            + ∑ Fórmula
          </button>

          {SIMBOLOS_RAPIDOS.map((sim) => (
            <button
              key={sim.titulo}
              type="button"
              className="btn-mini-simbolo"
              title={sim.titulo}
              onMouseDown={(e) => {
                e.preventDefault();
                insertarFormulaEnCursor(sim.latex);
              }}
            >
              {sim.etiqueta}
            </button>
          ))}
        </div>

      </div>

      <div
        id={id}
        ref={editorRef}
        role="textbox"
        tabIndex={0}
        aria-multiline={multilinea}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={`area-editable-hibrida ${multilinea ? "multilinea" : ""}`}
        onFocus={() => setEstaEnfocado(true)}
        onBlur={() => {
          setEstaEnfocado(false);
          emitirCambio();
        }}
        onInput={emitirCambio}
        onKeyDown={manejarKeyDownContenedor}
      />
    </div>
  );
}