import "./GraficoModulo.css";

export function GraficoModulo({ url, pieDeFoto }) {
  if (!url) return null;

  return (
    <figure className="modulo-grafico">
      <img src={url} alt={pieDeFoto || "Gráfico explicativo"} className="grafico-img" />
      {pieDeFoto && <figcaption className="grafico-caption">{pieDeFoto}</figcaption>}
    </figure>
  );
}