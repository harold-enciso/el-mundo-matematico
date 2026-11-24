import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import { useToast } from "../../../../context/useToast";
import { useModal } from "../../../../context/useModal";
import "./EditarCursoTemas.css";

// Convierte "Leyes de Exponentes" -> "leyes-de-exponentes"
function generarSlugTema(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditarCursoTemas() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { showToast } = useToast();
  const { showModal } = useModal();

  const apiUrl = import.meta.env.VITE_API_URL;
  const [curso, setCurso] = useState(null);
  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevoTema, setNuevoTema] = useState({
    titulo: "",
    slug: "",
    descripcion: "",
    duracion_estimada: "45 min",
  });

  // 1. Cargar información del curso y sus temas
  useEffect(() => {
    fetch(`${apiUrl}/cursos/${cursoId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener el curso");
        return res.json();
      })
      .then((data) => {
        setCurso(data.curso);
        const temasOrdenados = (data.temas || []).sort((a, b) => (a.orden || 0) - (b.orden || 0));
        setTemas(temasOrdenados);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        showToast("Error al cargar los temas del curso", "error");
        setCargando(false);
      });
  }, [apiUrl, cursoId, user.token]);

  const handleTituloChange = (valor) => {
    setNuevoTema((prev) => ({
      ...prev,
      titulo: valor,
      slug: generarSlugTema(valor),
    }));
  };

  // 2. Crear un nuevo tema en este curso
  const handleCrearTema = (e) => {
    e.preventDefault();

    if (!nuevoTema.titulo.trim()) {
      showToast("El título del tema es obligatorio", "warning");
      return;
    }

    const siguienteOrden = temas.length + 1;
    const payload = {
      id: `${cursoId}-t${siguienteOrden}`, // Sigue tu patrón: alg-t1, alg-t2...
      curso_id: cursoId,
      titulo: nuevoTema.titulo.trim(),
      slug: nuevoTema.slug.trim() || generarSlugTema(nuevoTema.titulo),
      descripcion: nuevoTema.descripcion.trim(),
      duracion_estimada: nuevoTema.duracion_estimada.trim() || "45 min",
      orden: siguienteOrden,
    };

    fetch(`${apiUrl}/cursos/${cursoId}/temas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al crear el tema`);
        return res.json();
      })
      .then((temaCreado) => {
        setTemas((prev) => [...prev, temaCreado]);
        setNuevoTema({ titulo: "", slug: "", descripcion: "", duracion_estimada: "45 min" });
        setMostrarFormulario(false);
        showToast("Tema creado exitosamente", "success");
      })
      .catch((err) => {
        console.error(err);
        showToast("Error al crear el tema", "error");
      });
  };

  // 3. Subir o bajar el orden de un tema (↑ / ↓)
  const handleMoverTema = (index, direccion) => {
    const nuevoIndex = index + direccion;
    if (nuevoIndex < 0 || nuevoIndex >= temas.length) return;

    const copiaTemas = [...temas];
    const [temaMovido] = copiaTemas.splice(index, 1);
    copiaTemas.splice(nuevoIndex, 0, temaMovido);

    const reordenados = copiaTemas.map((t, idx) => ({
      ...t,
      orden: idx + 1,
    }));

    setTemas(reordenados);

    fetch(`${apiUrl}/cursos/${cursoId}/temas/reordenar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: reordenados.map((t) => ({ id: t.id, orden: t.orden })),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al reordenar`);
        showToast("Orden actualizado", "success");
      })
      .catch((err) => {
        console.error(err);
        showToast("No se pudo guardar el nuevo orden", "error");
      });
  };

  // 4. Eliminar tema
  const handleEliminarTema = (temaId) => {
    fetch(`${apiUrl}/cursos/${cursoId}/temas/${temaId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al eliminar el tema`);
        setTemas((prev) => prev.filter((t) => t.id !== temaId));
        showToast("Tema eliminado", "info");
      })
      .catch((err) => {
        console.error(err);
        showToast("No se pudo eliminar el tema", "error");
      });
  };

  if (cargando) {
    return <div className="mensaje-cargando">Cargando contenido del curso...</div>;
  }

  return (
    <div className="seccion-admin">
      <button className="boton-volver" onClick={() => navigate("/admin/dashboard/cursos")}>
        ← Volver a Cursos
      </button>

      <div className="encabezado-seccion">
        <div>
          <h1>Temas de: {curso?.nombre || "Curso"}</h1>
          <p>{curso?.descripcion || "Gestión de capítulos y temas teóricos."}</p>
        </div>
        <button
          className="boton-principal-admin"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "+ Nuevo Tema"}
        </button>
      </div>

      {/* Formulario desplegable para crear tema */}
      {mostrarFormulario && (
        <form className="formulario-crear-curso" onSubmit={handleCrearTema}>
          <h3>Agregar Nuevo Tema a {curso?.nombre}</h3>

          <div className="campo-form">
            <label htmlFor="tema-titulo">Título del Tema</label>
            <input
              id="tema-titulo"
              type="text"
              placeholder="Ej: Inecuaciones Lineales"
              value={nuevoTema.titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              className="input-admin"
            />
          </div>

          <div className="campo-form">
            <label htmlFor="tema-slug">Slug (URL amigable)</label>
            <input
              id="tema-slug"
              type="text"
              placeholder="ej: inecuaciones-lineales"
              value={nuevoTema.slug}
              onChange={(e) => setNuevoTema({ ...nuevoTema, slug: e.target.value })}
              className="input-admin"
            />
          </div>

          <div className="campo-form">
            <label htmlFor="tema-duracion">Duración Estimada</label>
            <input
              id="tema-duracion"
              type="text"
              placeholder="Ej: 45 min"
              value={nuevoTema.duracion_estimada}
              onChange={(e) => setNuevoTema({ ...nuevoTema, duracion_estimada: e.target.value })}
              className="input-admin"
            />
          </div>

          <div className="campo-form">
            <label htmlFor="tema-descripcion">Descripción Breve</label>
            <textarea
              id="tema-descripcion"
              placeholder="Resumen de lo que aprenderá el estudiante..."
              value={nuevoTema.descripcion}
              onChange={(e) => setNuevoTema({ ...nuevoTema, descripcion: e.target.value })}
              className="input-admin textarea"
              rows={2}
            />
          </div>

          <button type="submit" className="boton-principal-admin">
            Guardar Tema
          </button>
        </form>
      )}

      {/* Lista de Temas */}
      {temas.length === 0 ? (
        <div className="bloque-vacio-admin">
          Este curso aún no tiene temas asignados. Haz clic en <strong>&quot;+ Nuevo Tema&quot;</strong> para agregar el primero.
        </div>
      ) : (
        <div className="lista-temas-container">
          {temas.map((tema, index) => (
            <div className="tarjeta-tema-admin" key={tema.id || index}>
              <div className="info-tema">
                <span className="numero-orden">{tema.orden || index + 1}</span>
                <div>
                  <h3>{tema.titulo}</h3>
                  <p>{tema.descripcion || "Sin descripción."}</p>
                </div>
              </div>

              <div className="acciones-tema">
                <button
                  type="button"
                  className="boton-tabla secundario"
                  disabled={index === 0}
                  onClick={() => handleMoverTema(index, -1)}
                  title="Subir orden"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="boton-tabla secundario"
                  disabled={index === temas.length - 1}
                  onClick={() => handleMoverTema(index, 1)}
                  title="Bajar orden"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="boton-tabla secundario"
                  onClick={() =>
                    navigate(`/admin/dashboard/cursos/${cursoId}/temas/${tema.id}/bloques`)
                  }
                >
                  Ver Bloques
                </button>
                <button
                  type="button"
                  className="boton-tabla peligro"
                  onClick={() =>
                    showModal({
                      title: "Eliminar Tema",
                      message: `¿Estás seguro de eliminar el tema "${tema.titulo}"?`,
                      onConfirm: () => handleEliminarTema(tema.id),
                    })
                  }
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}