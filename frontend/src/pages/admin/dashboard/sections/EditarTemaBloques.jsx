import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { UserContext } from "../../../../context/UserContext";
import { useToast } from "../../../../context/useToast";
import { useModal } from "../../../../context/useModal";
import { TextoMatematico } from "../../../../components/modulos/TextoMatematico";
import EditorFormulaVisual from "./EditorFormulaVisual";
import CampoTextoConFormulas from "./CampoTextoConFormulas";
import "./EditarCursoTemas.css";
import "./EditarTemaBloques.css";

const PLANTILLAS_BLOQUE = {
  texto: { titulo: "", texto: "" },
  formula: { formula: "", explicacion: "" },
  callout: { variante: "tip", titulo: "", texto: "" },
  ejemplo_resuelto: { enunciado: "", pasos: [""], resultado: "" },
  cuestionario: { pregunta: "", opciones: ["", "", "", ""], explicacion: "" },
  grafico: { url: "", titulo: "", descripcion: "" },
};

const ETIQUETAS_TIPO = {
  texto: "Texto Teórico",
  formula: "Fórmula KaTeX",
  callout: "Nota / Callout",
  ejemplo_resuelto: "Ejemplo Resuelto",
  cuestionario: "Cuestionario",
  grafico: "Gráfico / Imagen",
};

export default function EditarTemaBloques() {
  const { cursoId, temaId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { showToast } = useToast();
  const { showModal } = useModal();

  const apiUrl = import.meta.env.VITE_API_URL;
  const [tema, setTema] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardandoId, setGuardandoId] = useState(null);

  // 1. Cargar tema y sus bloques ordenados
  useEffect(() => {
    fetch(`${apiUrl}/cursos/${cursoId}/temas/${temaId}/bloques`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al cargar bloques`);
        return res.json();
      })
      .then((data) => {
        setTema(data.tema);
        const ordenados = (data.bloques || []).sort((a, b) => (a.orden || 0) - (b.orden || 0));
        setBloques(ordenados);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        showToast("Error al cargar las tarjetas del tema", "error");
        setCargando(false);
      });
  }, [apiUrl, cursoId, temaId, user.token]);

  // 2. Crear nueva tarjetita según el botón pulsado
  const handleAgregarBloque = (tipo) => {
    const siguienteOrden = bloques.length + 1;
    const sufijoUnico = Date.now().toString().slice(-4);
    const nuevoBloque = {
      id: `b-${temaId}-${sufijoUnico}`,
      tema_id: temaId,
      tipo,
      orden: siguienteOrden,
      contenido: structuredClone(PLANTILLAS_BLOQUE[tipo]),
    };

    fetch(`${apiUrl}/cursos/temas/${temaId}/bloques`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoBloque),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al crear bloque`);
        return res.json();
      })
      .then((creado) => {
        setBloques((prev) => [...prev, creado]);
        showToast(`Tarjeta de ${ETIQUETAS_TIPO[tipo]} agregada`, "success");
      })
      .catch((err) => {
        console.error(err);
        showToast("No se pudo crear la tarjeta", "error");
      });
  };

  // 3. Actualizar estado local de un campo dentro del JSONB contenido
  const actualizarContenido = (bloqueId, campo, valor) => {
    setBloques((prev) =>
      prev.map((b) =>
        b.id === bloqueId ? { ...b, contenido: { ...b.contenido, [campo]: valor } } : b
      )
    );
  };

  const actualizarItemArray = (bloqueId, campoArray, idxItem, valor) => {
    setBloques((prev) =>
      prev.map((b) => {
        if (b.id !== bloqueId) return b;
        const copia = [...(b.contenido[campoArray] || [])];
        copia[idxItem] = valor;
        return { ...b, contenido: { ...b.contenido, [campoArray]: copia } };
      })
    );
  };

  const agregarPasoEjemplo = (bloqueId) => {
    setBloques((prev) =>
      prev.map((b) => {
        if (b.id !== bloqueId) return b;
        const pasosActuales = b.contenido.pasos || [];
        return { ...b, contenido: { ...b.contenido, pasos: [...pasosActuales, ""] } };
      })
    );
  };

  const eliminarPasoEjemplo = (bloqueId, idxPaso) => {
    setBloques((prev) =>
      prev.map((b) => {
        if (b.id !== bloqueId) return b;
        const filtrados = (b.contenido.pasos || []).filter((_, i) => i !== idxPaso);
        return { ...b, contenido: { ...b.contenido, pasos: filtrados } };
      })
    );
  };

  // 4. Guardar cambios de una tarjeta en PostgreSQL
  const handleGuardarBloque = (bloque) => {
    const contenidoSerializado = JSON.stringify(bloque.contenido);
    if (/\^\{\}|_\{\}|\\frac\{\}\{\}|\\sqrt\{\}/.test(contenidoSerializado)) {
      showToast(
        "Tienes una casilla de fórmula vacía; complétala o bórrala antes de guardar",
        "warning"
      );
      return;
    }
    setGuardandoId(bloque.id);
    fetch(`${apiUrl}/cursos/bloques/${bloque.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: bloque.tipo,
        orden: bloque.orden,
        contenido: bloque.contenido,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al guardar bloque`);
        return res.json();
      })
      .then(() => {
        showToast("Tarjeta guardada", "success");
      })
      .catch((err) => {
        console.error(err);
        showToast("Error al guardar los cambios de la tarjeta", "error");
      })
      .finally(() => setGuardandoId(null));
  };

  // 5. Subir o bajar posición de tarjeta (↑ / ↓)
  const handleMoverBloque = (index, direccion) => {
    const nuevoIndex = index + direccion;
    if (nuevoIndex < 0 || nuevoIndex >= bloques.length) return;

    const copia = [...bloques];
    const [movido] = copia.splice(index, 1);
    copia.splice(nuevoIndex, 0, movido);

    const reordenados = copia.map((b, idx) => ({ ...b, orden: idx + 1 }));
    setBloques(reordenados);

    fetch(`${apiUrl}/cursos/temas/${temaId}/bloques/reordenar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: reordenados.map((b) => ({ id: b.id, orden: b.orden })),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al reordenar bloques`);
        showToast("Orden de tarjetas actualizado", "success");
      })
      .catch((err) => {
        console.error(err);
        showToast("No se pudo guardar el orden", "error");
      });
  };

  // 6. Eliminar tarjeta
  const handleEliminarBloque = (bloqueId) => {
    fetch(`${apiUrl}/cursos/bloques/${bloqueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al eliminar bloque`);
        setBloques((prev) => prev.filter((b) => b.id !== bloqueId));
        showToast("Tarjeta eliminada", "info");
      })
      .catch((err) => {
        console.error(err);
        showToast("Error al eliminar la tarjeta", "error");
      });
  };

  // Vista previa en vivo de cómo quedará la tarjeta en la web del estudiante
  const renderVistaPreviaIRL = (bloque) => {
    const { tipo, contenido } = bloque;

    if (tipo === "formula") {
      return (
        <div className="vista-previa-irl-box">
          <span className="etiqueta-vista-previa">Vista previa</span>
          <div className="vista-previa-formula-centro">
            {contenido.formula ? (
              <BlockMath math={contenido.formula} />
            ) : (
              <small>Escribe una fórmula arriba para verla aquí...</small>
            )}
          </div>
          {contenido.explicacion && (
            <div className="contenido-vista-previa" style={{ textAlign: "center" }}>
              <TextoMatematico contenido={contenido.explicacion} inline />
            </div>
          )}
        </div>
      );
    }

    if (tipo === "texto" || tipo === "callout") {
      const cuerpoTexto = contenido.texto ?? contenido.contenido ?? "";
      return (
        <div className="vista-previa-irl-box">
          <span className="etiqueta-vista-previa">Vista previa</span>
          <div className="contenido-vista-previa">
            {contenido.titulo && (
              <h4 style={{ margin: "0 0 8px 0", fontSize: "1.12rem", color: "#ffffff" }}>
                <TextoMatematico contenido={contenido.titulo} inline />
              </h4>
            )}
            <TextoMatematico contenido={cuerpoTexto} />
          </div>
        </div>
      );
    }

    if (tipo === "ejemplo_resuelto") {
      const enunciado = contenido.enunciado ?? contenido.problema ?? "";
      return (
        <div className="vista-previa-irl-box">
          <span className="etiqueta-vista-previa">Vista previa</span>
          <div className="contenido-vista-previa">
            <TextoMatematico contenido={enunciado} />
            {(contenido.pasos || []).map((p, i) =>
              p ? (
                <div key={`prev-paso-${i}`} style={{ marginTop: "6px" }}>
                  <strong>{i + 1}. </strong>
                  <TextoMatematico contenido={p} inline />
                </div>
              ) : null
            )}
            {(contenido.resultado || contenido.respuesta) && (
              <div style={{ marginTop: "8px", color: "#4ade80", fontWeight: 600 }}>
                Resultado:{" "}
                <TextoMatematico contenido={contenido.resultado || contenido.respuesta} inline />
              </div>
            )}
          </div>
        </div>
      );
    }

    if (tipo === "cuestionario") {
      return (
        <div className="vista-previa-irl-box">
          <span className="etiqueta-vista-previa">Vista previa</span>
          <div className="contenido-vista-previa">
            <strong>
              <TextoMatematico contenido={contenido.pregunta || ""} inline />
            </strong>
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {(contenido.opciones || []).map((op, i) =>
                op ? (
                  <div key={`prev-op-${i}`}>
                    • <TextoMatematico contenido={op} inline />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Renderiza los campos visuales de cada bloque
  const renderCamposBloque = (bloque) => {
    const { id, tipo, contenido } = bloque;

    if (tipo === "texto") {
      return (
        <>
          <div className="campo-form">
            <label htmlFor={`${id}-titulo`}>Título o subtítulo de sección (opcional)</label>
            <CampoTextoConFormulas
              id={`${id}-titulo`}
              valor={contenido.titulo || ""}
              onChange={(val) => actualizarContenido(id, "titulo", val)}
              placeholder="Ej: Introducción a la Potenciación"
            />
          </div>
          <div className="campo-form">
            <label htmlFor={`${id}-texto`}>Contenido teórico</label>
            <CampoTextoConFormulas
              id={`${id}-texto`}
              valor={contenido.texto || ""}
              onChange={(val) => actualizarContenido(id, "texto", val)}
              placeholder="Escribe el texto teórico y pulsa '+ ∑ Fórmula' o '$' cuando necesites ecuaciones..."
              multilinea
            />
          </div>
        </>
      );
    }

    if (tipo === "formula") {
      return (
        <>
          <div className="campo-form">
            <label htmlFor={`${id}-formula`}>Fórmula Principal (Editor tipo Word)</label>
            <EditorFormulaVisual
              id={`${id}-formula`}
              valor={contenido.formula || ""}
              onChange={(nuevoLatex) => actualizarContenido(id, "formula", nuevoLatex)}
            />
          </div>
          <div className="campo-form">
            <label htmlFor={`${id}-explicacion`}>Explicación de variables</label>
            <CampoTextoConFormulas
              id={`${id}-explicacion`}
              valor={contenido.explicacion || ""}
              onChange={(val) => actualizarContenido(id, "explicacion", val)}
              placeholder="Donde a es la base y n es el exponente..."
              multilinea
            />
          </div>
        </>
      );
    }

    if (tipo === "callout") {
      return (
        <>
          <div className="campo-form">
            <label htmlFor={`${id}-variante`}>Tipo de aviso</label>
            <select
              id={`${id}-variante`}
              className="input-admin"
              value={contenido.variante || contenido.tipo_callout || "tip"}
              onChange={(e) => actualizarContenido(id, "variante", e.target.value)}
            >
              <option value="tip">Tip / Consejo</option>
              <option value="info">Información</option>
              <option value="warning">Advertencia / Ojo</option>
            </select>
          </div>
          <div className="campo-form">
            <label htmlFor={`${id}-titulo`}>Título del recuadro</label>
            <CampoTextoConFormulas
              id={`${id}-titulo`}
              valor={contenido.titulo || ""}
              onChange={(val) => actualizarContenido(id, "titulo", val)}
              placeholder="Ej: Regla Importante"
            />
          </div>
          <div className="campo-form">
            <label htmlFor={`${id}-callout-texto`}>Mensaje</label>
            <CampoTextoConFormulas
              id={`${id}-callout-texto`}
              valor={contenido.texto ?? contenido.contenido ?? ""}
              onChange={(val) => actualizarContenido(id, "texto", val)}
              placeholder="Escribe el consejo o advertencia..."
              multilinea
            />
          </div>
        </>
      );
    }

    if (tipo === "ejemplo_resuelto") {
      const pasos = contenido.pasos || [];
      return (
        <>
          <div className="campo-form">
            <label htmlFor={`${id}-enunciado`}>Enunciado del problema</label>
            <CampoTextoConFormulas
              id={`${id}-enunciado`}
              valor={contenido.enunciado ?? contenido.problema ?? ""}
              onChange={(val) => actualizarContenido(id, "enunciado", val)}
              placeholder="Ej: Simplifica la siguiente expresión..."
              multilinea
            />
          </div>

          <div className="campo-form">
            <span className="subtitulo-campo-bloque">Pasos de resolución</span>
            {pasos.map((paso, idxPaso) => (
              <div key={`${id}-paso-${idxPaso}`} className="fila-paso-ejemplo">
                <div className="contenedor-input-paso">
                  <CampoTextoConFormulas
                    id={`${id}-paso-${idxPaso}`}
                    valor={paso}
                    onChange={(val) => actualizarItemArray(id, "pasos", idxPaso, val)}
                    placeholder={`Paso ${idxPaso + 1}...`}
                  />
                </div>
                <button
                  type="button"
                  className="boton-tabla peligro"
                  onClick={() => eliminarPasoEjemplo(id, idxPaso)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="boton-tabla secundario"
              onClick={() => agregarPasoEjemplo(id)}
            >
              + Añadir Paso
            </button>
          </div>

          <div className="campo-form">
            <label htmlFor={`${id}-resultado`}>Resultado final</label>
            <CampoTextoConFormulas
              id={`${id}-resultado`}
              valor={contenido.resultado ?? contenido.respuesta ?? ""}
              onChange={(val) => actualizarContenido(id, "resultado", val)}
              placeholder="Ej: E = 4"
            />
          </div>
        </>
      );
    }

    if (tipo === "cuestionario") {
      const opciones = contenido.opciones || ["", "", "", ""];
      return (
        <>
          <div className="campo-form">
            <label htmlFor={`${id}-pregunta`}>Pregunta</label>
            <CampoTextoConFormulas
              id={`${id}-pregunta`}
              valor={contenido.pregunta || ""}
              onChange={(val) => actualizarContenido(id, "pregunta", val)}
              placeholder="Ej: ¿Cuál es el resultado de simplificar..."
            />
          </div>
          <div className="campo-form">
            <span className="subtitulo-campo-bloque">
              Opciones (la Opción 1 es la respuesta correcta)
            </span>
            {opciones.map((op, idxOp) => (
              <div key={`${id}-opcion-${idxOp}`} className="input-opcion-cuestionario">
                <CampoTextoConFormulas
                  id={`${id}-opcion-${idxOp}`}
                  valor={op}
                  onChange={(val) => actualizarItemArray(id, "opciones", idxOp, val)}
                  placeholder={
                    idxOp === 0 ? "Opción 1 (Respuesta correcta)" : `Distractor ${idxOp}`
                  }
                />
              </div>
            ))}
          </div>
          <div className="campo-form">
            <label htmlFor={`${id}-cuest-exp`}>Explicación de la solución</label>
            <CampoTextoConFormulas
              id={`${id}-cuest-exp`}
              valor={contenido.explicacion || ""}
              onChange={(val) => actualizarContenido(id, "explicacion", val)}
              placeholder="Explica paso a paso por qué esa es la respuesta correcta..."
              multilinea
            />
          </div>
        </>
      );
    }

    // tipo === "grafico"
    return (
      <>
        <div className="campo-form">
          <label htmlFor={`${id}-url`}>URL de la imagen (S3 / R2 / Wasabi)</label>
          <input
            id={`${id}-url`}
            type="text"
            className="input-admin"
            value={contenido.url || ""}
            onChange={(e) => actualizarContenido(id, "url", e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="campo-form">
          <label htmlFor={`${id}-graf-desc`}>Pie de figura / Descripción</label>
          <CampoTextoConFormulas
            id={`${id}-graf-desc`}
            valor={contenido.descripcion ?? contenido.pieDeFoto ?? ""}
            onChange={(val) => actualizarContenido(id, "descripcion", val)}
            placeholder="Ej: Triángulo rectángulo notable de 37° y 53°"
          />
        </div>
      </>
    );
  };

  if (cargando) {
    return <div className="mensaje-cargando">Cargando tarjetas de la lección...</div>;
  }

  return (
    <div className="seccion-admin">
      <button
        type="button"
        className="boton-volver"
        onClick={() => navigate(`/admin/dashboard/cursos/${cursoId}/temas`)}
      >
        ← Volver a Temas
      </button>

      <div className="encabezado-seccion">
        <div>
          <h1>Bloques de: {tema?.titulo || temaId}</h1>
          <p>{tema?.descripcion || "Construye la lección apilando y ordenando tarjetas."}</p>
        </div>
      </div>

      {/* Barra de creación rápida (6 botones) */}
      <div className="barra-agregar-bloques">
        <button
          type="button"
          className="boton-tabla secundario"
          onClick={() => handleAgregarBloque("texto")}
        >
          + Texto
        </button>
        <button
          type="button"
          className="boton-tabla secundario"
          onClick={() => handleAgregarBloque("formula")}
        >
          + Fórmula
        </button>
        <button
          type="button"
          className="boton-tabla secundario"
          onClick={() => handleAgregarBloque("callout")}
        >
          + Callout
        </button>
        <button
          type="button"
          className="boton-tabla secundario"
          onClick={() => handleAgregarBloque("ejemplo_resuelto")}
        >
          + Ejemplo Resuelto
        </button>
        <button
          type="button"
          className="boton-tabla secundario"
          onClick={() => handleAgregarBloque("cuestionario")}
        >
          + Cuestionario
        </button>
        <button
          type="button"
          className="boton-tabla secundario"
          onClick={() => handleAgregarBloque("grafico")}
        >
          + Gráfico
        </button>
      </div>

      {/* Lista de tarjetitas apiladas */}
      {bloques.length === 0 ? (
        <div className="bloque-vacio-admin">
          Este tema aún no tiene tarjetas. Usa los botones de arriba para añadir texto, fórmulas o
          ejercicios.
        </div>
      ) : (
        <div className="lista-bloques-admin">
          {bloques.map((bloque, index) => (
            <div key={bloque.id} className="tarjeta-bloque-admin">
              <div className="cabecera-bloque-admin">
                <div className="info-bloque-admin">
                  <span className="numero-orden">{bloque.orden || index + 1}</span>
                  <span className="titulo-tipo-bloque">
                    {ETIQUETAS_TIPO[bloque.tipo] || bloque.tipo}
                  </span>
                  <small className="id-bloque-texto">({bloque.id})</small>
                </div>

                <div className="acciones-bloque-admin">
                  <button
                    type="button"
                    className="boton-tabla secundario"
                    disabled={index === 0}
                    onClick={() => handleMoverBloque(index, -1)}
                    title="Subir tarjeta"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="boton-tabla secundario"
                    disabled={index === bloques.length - 1}
                    onClick={() => handleMoverBloque(index, 1)}
                    title="Bajar tarjeta"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="boton-principal-admin"
                    disabled={guardandoId === bloque.id}
                    onClick={() => handleGuardarBloque(bloque)}
                  >
                    {guardandoId === bloque.id ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    className="boton-tabla peligro"
                    onClick={() =>
                      showModal({
                        title: "Eliminar Tarjeta",
                        message: "¿Seguro que deseas eliminar este bloque de la lección?",
                        onConfirm: () => handleEliminarBloque(bloque.id),
                      })
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {renderCamposBloque(bloque)}
              {renderVistaPreviaIRL(bloque)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}