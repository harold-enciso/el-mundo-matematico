import "./CalloutModulo.css";

export function CalloutModulo({ tipo_callout, variante = "info", titulo, texto, contenido }) {
  const tipoOriginal = tipo_callout || variante;
  
  // Mapeo del SQL a las clases exactas de tu CalloutModulo.css
  const mapaClases = {
    tip: "consejo",
    warning: "advertencia",
    info: "info"
  };

  const claseTipo = mapaClases[tipoOriginal] || tipoOriginal;
  const textoMostrar = texto || contenido;

  return (
    <div className={`modulo-callout ${claseTipo}`}>
      {titulo && <h4 className="callout-titulo">{titulo}</h4>}
      {textoMostrar && <p className="callout-texto">{textoMostrar}</p>}
    </div>
  );
}