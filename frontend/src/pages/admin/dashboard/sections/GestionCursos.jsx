import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import { useToast } from "../../../../context/useToast";
import { useModal } from "../../../../context/useModal";
import "./GestionCursos.css";

// Genera un ID corto sugerido a partir del nombre (ej: "Cálculo" -> "calculo")
function generarSlugCurso(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20);
}

export default function GestionCursos() {
  const { user } = useContext(UserContext);
  const { showToast } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditadoManualmente, setIdEditadoManualmente] = useState(false);

  const [nuevoCurso, setNuevoCurso] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    icono_url: "📚",
  });

  // 1. Cargar catálogo (/cursos/listar)
  useEffect(() => {
    fetch(`${apiUrl}/cursos/listar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCursos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        showToast("Error al obtener los cursos", "error");
        setCargando(false);
      });
  }, [apiUrl, user.token]);

  const handleNombreChange = (valor) => {
    setNuevoCurso((prev) => ({
      ...prev,
      nombre: valor,
      id: idEditadoManualmente ? prev.id : generarSlugCurso(valor),
    }));
  };

  // 2. Crear curso (/cursos/create) alineado a las columnas de PostgreSQL
  const handleCrearCurso = (e) => {
    e.preventDefault();

    if (!nuevoCurso.id.trim() || !nuevoCurso.nombre.trim()) {
      showToast("El identificador (ID) y el nombre del curso son obligatorios", "warning");
      return;
    }

    const payload = {
      id: nuevoCurso.id.trim().toLowerCase(),
      nombre: nuevoCurso.nombre.trim(),
      descripcion: nuevoCurso.descripcion.trim(),
      icono_url: nuevoCurso.icono_url.trim() || "📚",
      orden: cursos.length + 1,
    };

    fetch(`${apiUrl}/cursos/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status} al crear el curso`);
        }
        return res.json();
      })
      .then((data) => {
        setCursos((prev) => [...prev, data]);
        setNuevoCurso({ id: "", nombre: "", descripcion: "", icono_url: "📚" });
        setIdEditadoManualmente(false);
        setMostrarFormulario(false);
        showToast("Curso creado exitosamente", "success");
      })
      .catch((err) => {
        console.error(err);
        showToast("Error al crear el curso", "error");
      });
  };

  // 3. Eliminar curso (/cursos/{id})
  const handleEliminarCurso = (cursoId) => {
    fetch(`${apiUrl}/cursos/${cursoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status} al eliminar el curso`);
        }
        setCursos((prev) => prev.filter((c) => c.id !== cursoId));
        showToast("Curso eliminado", "info");
      })
      .catch((err) => {
        console.error(err);
        showToast("No se pudo eliminar el curso", "error");
      });
  };

  // Renderizado extraído para evitar ternarios anidados (SonarQube S3358)
  const renderContenidoCursos = () => {
    if (cargando) {
      return <div className="mensaje-cargando">Cargando catálogo...</div>;
    }

    if (cursos.length === 0) {
      return (
        <div className="bloque-vacio-admin">
          No hay cursos creados. Haz clic en <strong>&quot;+ Nuevo Curso&quot;</strong> para empezar.
        </div>
      );
    }

    return (
      <div className="grid-cursos-admin">
        {cursos.map((curso) => (
          <div className="tarjeta-curso-admin" key={curso.id}>
            <div className="header-tarjeta-curso">
              <span className="categoria-tag">{curso.icono_url || "📚"}</span>
            </div>

            <h2>{curso.nombre}</h2>
            <p>{curso.descripcion || "Sin descripción asignada."}</p>

            <div className="footer-tarjeta-curso">
              <button
                className="boton-tabla secundario"
                onClick={() => navigate(`/admin/dashboard/cursos/${curso.id}/temas`)}
              >
                Editar Contenido
              </button>
              <button
                className="boton-tabla peligro"
                onClick={() =>
                  showModal({
                    title: "Eliminar Curso",
                    message: `¿Estás seguro de eliminar el curso "${curso.nombre}"?`,
                    onConfirm: () => handleEliminarCurso(curso.id),
                  })
                }
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="seccion-admin">
      <div className="encabezado-seccion">
        <div>
          <h1>Gestión de Cursos</h1>
          <p>Crea, edita y organiza el contenido teórico de tus cursos.</p>
        </div>
        <button
          className="boton-principal-admin"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "+ Nuevo Curso"}
        </button>
      </div>

      {mostrarFormulario && (
        <form className="formulario-crear-curso" onSubmit={handleCrearCurso}>
          <h3>Crear Nuevo Curso Teórico</h3>

          <div className="campo-form">
            <label htmlFor="curso-nombre">Nombre del Curso</label>
            <input
              id="curso-nombre"
              type="text"
              placeholder="Ej: Cálculo Diferencial"
              value={nuevoCurso.nombre}
              onChange={(e) => handleNombreChange(e.target.value)}
              className="input-admin"
            />
          </div>

          <div className="campo-form">
            <label htmlFor="curso-id">Código / ID del Curso (slug corto)</label>
            <input
              id="curso-id"
              type="text"
              placeholder="Ej: calc (como alg, geo, ari)"
              value={nuevoCurso.id}
              onChange={(e) => {
                setIdEditadoManualmente(true);
                setNuevoCurso({ ...nuevoCurso, id: e.target.value });
              }}
              className="input-admin"
            />
          </div>

          <div className="campo-form">
            <label htmlFor="curso-icono">Icono (Emoji)</label>
            <input
              id="curso-icono"
              type="text"
              placeholder="Ej: 📐, 🧮, ⚡"
              value={nuevoCurso.icono_url}
              onChange={(e) => setNuevoCurso({ ...nuevoCurso, icono_url: e.target.value })}
              className="input-admin"
            />
          </div>

          <div className="campo-form">
            <label htmlFor="curso-descripcion">Descripción Breve</label>
            <textarea
              id="curso-descripcion"
              placeholder="De qué trata este curso..."
              value={nuevoCurso.descripcion}
              onChange={(e) => setNuevoCurso({ ...nuevoCurso, descripcion: e.target.value })}
              className="input-admin textarea"
              rows={3}
            />
          </div>

          <button type="submit" className="boton-principal-admin">
            Guardar Curso
          </button>
        </form>
      )}

      {renderContenidoCursos()}
    </div>
  );
}