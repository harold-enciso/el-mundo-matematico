import { Link } from "react-router-dom";
import "./CatalogoCursos.css";
import "./Cursos.css";
import { useState, useEffect } from "react";
//import LoadingScreen from "../../components/common/LoadingScreen";
export default function CatalogoCursos() {
    
    
  
    const [cursos, setCursos] = useState([]);
    const [cargando, setCargando] = useState(true);
  
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const cursosUrl = `${apiUrl}/cursos/listar`
        fetch(cursosUrl)
        .then((res) => {
            if (!res.ok) throw new Error("Error al consultar el catálogo");
            return res.json();
        })
        .then((data) => {
            setCursos(data);
            setCargando(false);
        })
        .catch((err) => {
            console.error("Error al obtener los cursos:", err);
            setCargando(false);
        });
    }, []);

    if (cargando) {
        return (
            <div className="catalogo-container">
            <div className="skeleton-header animate-pulse" />
            <div className="catalogo-grid">
                {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card animate-pulse" />
                ))}
            </div>
            </div>
        );
    }
    return (
        <div className="catalogo-container">
        <header className="catalogo-header">
            <h1 className="catalogo-titulo">Catálogo de Cursos</h1>
            <p className="catalogo-subtitulo">
            Explora nuestras materias disponibles y selecciona una para ver su temario completo.
            </p>
        </header>

        <div className="catalogo-grid">
            {cursos.map((curso) => (
            <article key={curso.id} className="curso-card">
                <div className="curso-card-top">
                <span className="curso-icono">{curso.icono_url}</span>
                <h2 className="curso-nombre">{curso.nombre}</h2>
                </div>
                
                <p className="curso-descripcion">{curso.descripcion}</p>

                <div className="curso-card-bottom">
                <span className="curso-cant-temas">
                    📚 {curso.total_temas} {curso.total_temas === 1 ? "tema" : "temas"}
                </span>
                <Link to={`/cursos/${curso.id}`} className="curso-btn-explorar">
                    Ver Temario →
                </Link>
                </div>
            </article>
            ))}
        </div>
        </div>
    );
    }