import "./FormulaModulo.css";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useRef, useEffect } from "react";
import { TextoMatematico } from "./TextoMatematico";

export function FormulaModulo({ formula, explicacion }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [formula]);

  if (!formula) return null;

  return (
    <div className="modulo-formula">
      <div className="formula-expresion" ref={containerRef}>
        <BlockMath math={formula} />
      </div>
      {explicacion && (
        <div className="formula-explicacion">
          <TextoMatematico contenido={explicacion} inline />
        </div>
      )}
    </div>
  );
}