import "./FormulaModulo.css";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { useRef, useEffect } from 'react';

export function FormulaModulo({ formula, explicacion }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // Solo interviene si la fórmula sobrepasa el ancho del contenedor
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault(); // Evita que la página suba o baje
        el.scrollLeft += e.deltaY;
      }
    };

    // passive: false permite usar e.preventDefault() sin advertencias del navegador
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [formula]);

  if (!formula) return null;

  return (
    <div className="modulo-formula">
      {/* Se agrega ref={containerRef} para conectar el nodo con React */}
      <div className="formula-expresion" ref={containerRef}>
        <BlockMath math={formula} />
      </div>
      {explicacion && <p className="formula-explicacion">{explicacion}</p>}
    </div>
  );
}