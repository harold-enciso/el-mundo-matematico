import { useParams, Link } from "react-router-dom";
import "./CursoTemas.css";
import { useState, useEffect } from "react";
//import LoadingScreen from "../../components/common/LoadingScreen";
import "./Cursos.css";

export default function CursoTemas() {
    const { cursoId } = useParams();
    const [curso, setCurso] = useState(null);
    const [temas, setTemas] = useState([]);
    const [cargando, setCargando] = useState(true);

    


    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const temasUrl = `${apiUrl}/cursos/${cursoId}`
        fetch(temasUrl)
        .then((res) => {
            if (!res.ok) throw new Error("Curso no encontrado");
            return res.json();
        })
        .then((data) => {
            setCurso(data.curso);
            setTemas(data.temas);
            setCargando(false);
        })
        .catch((err) => {
            console.error("Error al cargar temario:", err);
            setCargando(false);
        });
    }, [cursoId]);

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

    if (!curso) {
        return (
        <div className="curso-no-encontrado-box">
            <h2>Curso no encontrado</h2>
            <p>El curso especificado en la URL no existe en el sistema.</p>
            <Link to="/cursos" className="btn-volver-catalogo">← Volver al Catálogo</Link>
        </div>
        );
    }

    return (
        <div className="curso-temas-container">
        <div className="breadcrumb">
            <Link to="/cursos" className="breadcrumb-link">← Volver al Catálogo de Cursos</Link>
        </div>

        <header className="curso-header-banner">
            <div className="curso-header-main">
            <span className="curso-header-icono">{curso.icono_url}</span>
            <div>
                <h1 className="curso-header-titulo">{curso.nombre}</h1>
                <p className="curso-header-descripcion">{curso.descripcion}</p>
            </div>
            </div>
            <div className="curso-header-badge">
            {temas.length} {temas.length === 1 ? "Tema" : "Temas"} en total
            </div>
        </header>

        <section className="temas-lista-seccion">
            <h2 className="temario-subtitulo">Temas del curso</h2>

            <div className="temas-grid">
            {temas.map((tema, index) => (
                <div key={tema.id} className="tema-item-card">
                <div className="tema-numero">
                    {String(index + 1).padStart(2, "0")}
                </div>

                <div className="tema-info-content">
                    <h3 className="tema-item-titulo">{tema.titulo}</h3>
                    <p className="tema-item-descripcion">{tema.descripcion}</p>
                    <span className="tema-duracion-tag">⏱️ {tema.duracion_estimada}</span>
                </div>

                <div className="tema-accion">
                    <Link to={`/cursos/${curso.id}/${tema.slug}`} className="btn-iniciar-leccion">
                    Estudiar
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </section>
        </div>
    );
    }