import "./Dropdown.css";
import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Estados para datos dinámicos del backend
  const [cursos, setCursos] = useState([]);
  const [cursosAbiertos, setCursosAbiertos] = useState({});
  const [temasPorCurso, setTemasPorCurso] = useState({}); // Mapa { cursoId: [temas] }

  const menuRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Carga la lista inicial de cursos al montar el componente
  useEffect(() => {
    fetch(`${apiUrl}/cursos/listar`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener cursos");
        return res.json();
      })
      .then((data) => setCursos(data))
      .catch((err) => console.error("Error en DropdownMenu:", err));
  }, [apiUrl]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setOpen(false);
      setCursosAbiertos({});
    }, 350);
  };

  const toggleMenu = () => {
    if (open) {
      handleClose();
    } else {
      setOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  const toggleCurso = (id) => {
    const estaAbiertoActualmente = !!cursosAbiertos[id];

    // Si se va a abrir y no tenemos los temas guardados en estado, los pedimos a la API
    if (!estaAbiertoActualmente && !temasPorCurso[id]) {
      fetch(`${apiUrl}/cursos/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTemasPorCurso((prev) => ({ ...prev, [id]: data.temas }));
        })
        .catch((err) => console.error("Error al cargar temas del curso:", err));
    }

    setCursosAbiertos((prev) => ({
      ...prev,
      [id]: !estaAbiertoActualmente,
    }));
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) && open) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="dropdown-button menu" ref={menuRef}>
      <button className="icon-dropdown" onClick={toggleMenu} aria-label="Abrir catálogo de Cursos">
        <Menu size={26} />
      </button>
      <button className="text-dropdown" onClick={toggleMenu} aria-label="Abrir catálogo de Cursos">
        Cursos
      </button>

      {open && (
        <div className={`dropdown-menu ${isAnimating ? "visible" : "closing"}`}>
          <div className="cursos-header">
            <span>Catálogo de Cursos</span>
          </div>
          <Link to="/cursos" onClick={handleClose} className="ver-todos-btn">
            🚀 Ver todos los cursos →
          </Link>
          <div className="cursos-lista">
            {cursos.map((curso) => {
              const estaAbierto = !!cursosAbiertos[curso.id];
              const temas = temasPorCurso[curso.id] || [];

              return (
                <div key={curso.id} className="curso-seccion">
                  <button
                    className={`curso-btn ${estaAbierto ? "activo" : ""}`}
                    onClick={() => toggleCurso(curso.id)}
                  >
                    <span>{curso.icono_url || curso.icono} {curso.nombre}</span>
                    {estaAbierto ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {estaAbierto && (
                    <div className="temas-sublista">
                      {temas.length === 0 ? (
                        <span className="tema-loading-text">Cargando temas...</span>
                      ) : (
                        temas.map((tema) => (
                          <Link
                            key={tema.id}
                            to={`/cursos/${curso.id}/${tema.slug}`}
                            onClick={handleClose}
                            className="tema-link"
                          >
                            • {tema.titulo}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}