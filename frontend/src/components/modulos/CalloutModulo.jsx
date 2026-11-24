import { TextoMatematico } from "./TextoMatematico";
import "./CalloutModulo.css";

export function CalloutModulo({ tipo_callout, variante = "info", titulo, texto, contenido }) {
  const tipoOriginal = tipo_callout || variante;

  const mapaClases = {
    tip: "consejo",
    warning: "advertencia",
    info: "info",
  };

  const claseTipo = mapaClases[tipoOriginal] || tipoOriginal;
  const textoMostrar = texto || contenido;

  return (
    <div className={`modulo-callout ${claseTipo}`}>
      {titulo && (
        <h4 className="callout-titulo">
          <TextoMatematico contenido={titulo} inline />
        </h4>
      )}
      {textoMostrar && (
        <div className="callout-texto">
          <TextoMatematico contenido={textoMostrar} />
        </div>
      )}
    </div>
  );
}