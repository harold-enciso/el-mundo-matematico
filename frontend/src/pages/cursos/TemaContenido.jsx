import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./TemaContenido.css";
//import LoadingScreen from "../../components/common/LoadingScreen";
import "./Cursos.css";
// Importación de componentes reutilizables
import { TextoModulo } from "../../components/modulos/TextoModulo";
import { CalloutModulo } from "../../components/modulos/CalloutModulo";
import { FormulaModulo } from "../../components/modulos/FormulaModulo";
import { EjemploResueltoModulo } from "../../components/modulos/EjemploResueltoModulo";
import { CuestionarioModulo } from "../../components/modulos/CuestionarioModulo";
import { GraficoModulo } from "../../components/modulos/GraficoModulo";

export default function TemaContenido() {
    const { cursoId, temaSlug } = useParams();
    const [tema, setTema] = useState(null);
    const [bloques, setBloques] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const bloquesUrl = `${apiUrl}/cursos/${cursoId}/temas/${temaSlug}`
        fetch(bloquesUrl)
        .then((res) => {
            if (!res.ok) throw new Error("Tema no encontrado");
            return res.json();
        })
        .then((data) => {
            setTema(data.tema);
            setBloques(data.bloques);
            setCargando(false);
        })
        .catch((err) => {
            console.error("Error al cargar la lección:", err);
            setCargando(false);
        });
    }, [cursoId, temaSlug]);

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

    if (!tema) {
        return (
        <div className="tema-no-encontrado">
            <p>El tema solicitado no existe.</p>
            <Link to={`/cursos/${cursoId}`} className="btn-volver-curso">
            ← Volver al curso
            </Link>
        </div>
        );
    }

    return (
        <div className="tema-pagina-container">
            {/* Botón de regreso al temario del curso */}
            <nav className="breadcrumb-leccion">
                <Link to={`/cursos/${cursoId}`} className="btn-volver-curso">
                ← Volver al curso
                </Link>
            </nav>
            <header className="tema-header">
                <h1 className="tema-titulo">{tema.titulo}</h1>
                <p className="tema-descripcion">{tema.descripcion}</p>
            </header>

        <main className="tema-bloques-lista">
            {bloques.map((bloque) => {
                const propsModulo = { id: bloque.id, ...bloque.contenido };
                switch (bloque.tipo) {
                    case "texto":
                    return <TextoModulo key={bloque.id} {...propsModulo} />;
                    case "callout":
                    return <CalloutModulo key={bloque.id} {...propsModulo} />;
                    case "formula":
                    return <FormulaModulo key={bloque.id} {...propsModulo} />;
                    case "ejemplo_resuelto":
                    return <EjemploResueltoModulo key={bloque.id} {...propsModulo} />;
                    case "cuestionario":
                    return <CuestionarioModulo key={bloque.id} {...propsModulo} />;
                    case "grafico":
                    return <GraficoModulo key={bloque.id} {...propsModulo} />;
                    default:
                    return null;
                }
            })}
        </main>
        </div>
    );
    }