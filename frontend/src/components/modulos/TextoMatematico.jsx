import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./TextoMatematico.css";

const CONECTORES_MATH = new Set([
  "+",
  "-",
  "*",
  "/",
  "=",
  "·",
  "×",
  "÷",
  "±",
  "≠",
  "≤",
  "≥",
  "<",
  ">",
  "≈",
  "≡",
  "→",
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

function normalizarLatex(expr) {
  return expr
    // Envuelve en llaves exponentes/subíndices negativos o de varios dígitos sin llaves (ej: x^-1 -> x^{-1})
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
  if (/\\[a-zA-Z]+/.test(nucleo)) return true; // \cdot, \frac, \sqrt, \theta...
  if (/[\^_]/.test(nucleo)) return true; // x^2, a_1, x^-1
  if (/[=≠≤≥±×÷√∞≈≡→]/.test(nucleo)) return true; // operadores y símbolos
  if (/\)\s*\(/.test(nucleo)) return true; // productos como (x+5)(x-5)
  if (/^[+-]?\d+[a-zA-Z](\b|[)\]}])/.test(nucleo)) return true; // 2x, 10x, -5y
  if (/^\(?[a-zA-Z0-9]+\s*[+-]\s*[a-zA-Z0-9]+\)?/.test(nucleo)) return true; // (x+5)
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

  const esPalabraCorta = PALABRAS_ESPANOL_CORTAS.has(minuscula);
  const esNumero = /^[+-]?\d+(\.\d+)?$/.test(sinParens);
  const esVariable = /^[+-]?[a-zA-Z]{1,3}$/.test(sinParens);

  return {
    esTermino: esNumero || esVariable,
    esPalabraCorta,
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
    } else {
      break;
    }
  }

  while (limpia.endsWith(")")) {
    const aperturas = (limpia.match(/\(/g) || []).length;
    const cierres = (limpia.match(/\)/g) || []).length;
    if (cierres > aperturas) {
      sufijoExtra = ")" + sufijoExtra;
      limpia = limpia.slice(0, -1);
    } else {
      break;
    }
  }

  return { prefijoExtra, limpia, sufijoExtra };
}

function segmentarTextoAutoMath(textoPlano) {
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
      fuerte,
      conector,
      terminoAlg: esTermino,
      palabraEspanolCorta: esPalabraCorta,
      esMath: fuerte,
    };
  });

  // Unir conectores (+, -, =, /) y términos algebraicos (bx, c, 0, E) adyacentes a fórmulas
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
          (prev && prev.conector && !prev.sufijo) ||
          (next && next.conector && !actual.sufijo);
        if (tocadaPorOperador) {
          actual.esMath = true;
        }
      } else if (prevEsMathSinCorte || nextEsMathSinCorte) {
        actual.esMath = true;
      }
    }
  }

  // Asegurar conectores que quedaron entre dos bloques matemáticos
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
      const separador = segmentos.length > 0 ? " " : "";
      segmentos.push({ tipo: "texto", valor: separador + tok.original });
      i += 1;
      continue;
    }

    if (segmentos.length > 0) {
      segmentos.push({ tipo: "texto", valor: " " });
    }

    if (tok.prefijo) {
      segmentos.push({ tipo: "texto", valor: tok.prefijo });
    }

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

    const expresionUnida = partesMath.join(" ");
    const { prefijoExtra, limpia, sufijoExtra } = balancearParentesis(expresionUnida);

    if (prefijoExtra) {
      segmentos.push({ tipo: "texto", valor: prefijoExtra });
    }
    if (limpia) {
      segmentos.push({ tipo: "math", valor: normalizarLatex(limpia) });
    }
    if (sufijoExtra || sufijoFinal) {
      segmentos.push({ tipo: "texto", valor: sufijoExtra + sufijoFinal });
    }
  }

  return segmentos;
}

export function TextoMatematico({ contenido, inline = false }) {
  if (!contenido) return null;
  const texto = String(contenido);

  const partesDelimitadas = texto.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);

  const nodos = partesDelimitadas.flatMap((parte, idxParte) => {
    if (!parte) return [];

    if (parte.startsWith("$$") && parte.endsWith("$$")) {
      const formulaBloque = normalizarLatex(parte.slice(2, -2).trim());
      return [
        <span key={`block-${idxParte}`} className="texto-matematico-bloque">
          <BlockMath math={formulaBloque} />
        </span>,
      ];
    }

    if (parte.startsWith("$") && parte.endsWith("$")) {
      const formulaInline = normalizarLatex(parte.slice(1, -1).trim());
      return [
        <span key={`inline-${idxParte}`} className="texto-matematico-inline">
          <InlineMath math={formulaInline} />
        </span>,
      ];
    }

    const segmentos = segmentarTextoAutoMath(parte);
    return segmentos.map((seg, idxSeg) => {
      if (seg.tipo === "math") {
        return (
          <span key={`auto-${idxParte}-${idxSeg}`} className="texto-matematico-inline">
            <InlineMath math={seg.valor} />
          </span>
        );
      }
      return <span key={`txt-${idxParte}-${idxSeg}`}>{seg.valor}</span>;
    });
  });

  if (inline) {
    return <span className="texto-matematico-contenedor">{nodos}</span>;
  }

  return <div className="texto-matematico-contenedor">{nodos}</div>;
}