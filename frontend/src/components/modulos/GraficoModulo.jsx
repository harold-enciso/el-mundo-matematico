import { TextoMatematico } from "./TextoMatematico";
import "./GraficoModulo.css";

export function GraficoModulo({ url, pieDeFoto, descripcion }) {
  if (!url) return null;
  const textoPie = pieDeFoto || descripcion || "";

  return (
    <figure className="modulo-grafico">
      <img src={url} alt={textoPie || "Gráfico explicativo"} className="grafico-img" />
      {textoPie && (
        <figcaption className="grafico-caption">
          <TextoMatematico contenido={textoPie} inline />
        </figcaption>
      )}
    </figure>
  );
}