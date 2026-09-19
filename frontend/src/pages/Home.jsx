import "./Home.css";
import Seo from "../components/Seo";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
//PAGINA INICIAL

export default function Home() {
  //NADA P CAUSA
  return (
      <div className="landing-container">
        <Seo
          title="El Mundo Matemático | Aprende Matemática Gratis"
          description="Aprende matemáticas gratis con teoría clara, ejemplos y ejercicios resueltos de Primaria, Secundaria y Preuniversitario."
        />
        {/*HERO SECTION*/}
        <section className="hero-section">
          <div className="hero-contenido">
            
            <div className="badge">
              <Rocket size={18} color="#4ade80" />
              <span>100% gratuito y accesible</span>
            </div>
            <h1>Aprende matemáticas a tu ritmo: Teoría y ejercicios.</h1>
            <p className="hero-descripcion">
              Dominar las matemáticas nunca fue tan fácil. Accede a explicaciones claras, resuelve cuestionarios interactivos y descarga material de práctica.
            </p>
            <div className="hero-acciones">
              <Link to="/register" className="btn-primario">⚡ Empezar a Aprender Gratis</Link>
              <Link to="/login" className="btn-secundario">📄 Ver Material Descargable</Link>
              
            </div>
            <div className="hero-checks">
              <span>✓ Sin tarjeta de crédito</span>
              <span>✓ Para Primaria y Secundaria</span>
            </div>
          </div>
          <div className="hero-visual">
          <div className="card-demo">
            <p className="demo-pregunta">¿Respuesta de 2x + 5 = 11?</p>
            <span className="demo-respuesta">✔️ x = 3 (¡Correcto!)</span>
          </div>
          <div className="card-demo">
            <p className="demo-archivo">📄 Guía Álgebra 1.pdf</p>
            <button className="btn-demo-descarga">Descargar PDF</button>
          </div>
          </div>
        </section>
        {/* SECCIÓN NIVELES (NÚCLEO SEO) */}
        <section className="seccion-niveles">
          <h2>Explora el Contenido por Nivel Académico</h2>
          <p className="subtitulo">Selecciona tu grado para ver la teoría, ejercicios y material listo para descargar.</p>
          <div className="grid-niveles">
            <div className="card-nivel verde">
              <h3>🟢 PRIMARIA</h3>
              <ul>
                <li>Aritmética Básica</li>
                <li>Fracciones y Decimales</li>
                <li>Geometría Básica</li>
              </ul>
              <Link to="/juegos" className="btn-link">Explorar Primaria →</Link>
            </div>

            <div className="card-nivel azul">
              <h3>🔵 SECUNDARIA</h3>
              <ul>
                <li>Álgebra y Ecuaciones</li>
                <li>Geometría Plana</li>
                <li>Estadística y Probabilidad</li>
              </ul>
              <Link to="/juegos" className="btn-link">Explorar Secundaria →</Link>
            </div>

            <div className="card-nivel morado">
              <h3>🟣 PRE / ADMISIÓN</h3>
              <ul>
                <li>Trigonometría</li>
                <li>Cálculo Diferencial</li>
                <li>Razonamiento Matemático</li>
              </ul>
              <Link to="/juegos" className="btn-link">Explorar Pre →</Link>
            </div>
          </div>
        </section>
        {/* BARRERA FREEMIUM */}
        <section className="seccion-freemium">
          <h2>Todo el conocimiento es libre. El registro potencia tu aprendizaje.</h2>
          <br/>
          <div className="tabla-comparativa">
            <div className="columna-comparativa">
              <h3>🌐 SIN REGISTRO (Visitante)</h3>
              <ul>
                <li>✔️ Acceso a TODA la teoría redactada</li>
                <li>✔️ Prueba de 3 a 5 ejercicios por tema</li>
                <li>✔️ Lectura de material en pantalla</li>
                <li className="inactivo">❌ Sin guardado de puntajes</li>
                <li className="inactivo">❌ Límite de descargas directas</li>
              </ul>
              <Link to="/juegos" className="btn-secundario">Explorar como Invitado</Link>
            </div>

            <div className="columna-comparativa destacada">
              <h3>🔑 CON CUENTA GRATUITA</h3>
              <ul>
                <li>✔️ Todo lo del acceso visitante</li>
                <li>✔️ Descarga ILIMITADA de Guías y PDFs</li>
                <li>✔️ Guardado de progreso y estadísticas</li>
                <li>✔️ Diplomas digitales al completar módulos</li>
                <li>✔️ Marcar temas favoritos</li>
              </ul>
              <Link to="/register" className="btn-primario">Crear Cuenta Gratis en 30s</Link>
            </div>
          </div>
        </section>
        {/* CARACTERÍSTICAS */}
        <section className="seccion-caracteristicas">
          <h2>¿Por qué aprender con El Mundo Matemático?</h2>
          <br/>
          <div className="grid-caracteristicas">
            <div className="card-caracteristica">
              <h3>📘 TEORÍA PASO A PASO</h3>
              <p>Conceptos explicados con lenguaje sencillo, ejemplos resueltos y diagramas claros.</p>
            </div>
            <div className="card-caracteristica">
              <h3>⚡ PRÁCTICA INTERACTIVA</h3>
              <p>Preguntas adaptadas con retroalimentación instantánea para resolver tus dudas.</p>
            </div>
            <div className="card-caracteristica">
              <h3>📄 MATERIAL EN PDF</h3>
              <p>Hojas de trabajo listas para imprimir y practicar sin conexión a internet.</p>
            </div>
          </div>
        </section>
        {/* PREGUNTAS FRECUENTES (RICH SNIPPETS READY) */}
        <section className="seccion-faq">
          <h2>Preguntas Frecuentes</h2>
          <br/>
          <div className="faq-lista">
            <details className="faq-item">
              <summary>¿El contenido de El Mundo Matemático es completamente gratuito?</summary>
              <p>Sí, la teoría, las explicaciones y las prácticas iniciales son 100% libres sin costo alguno.</p>
            </details>
            <details className="faq-item">
              <summary>¿Necesito crear una cuenta para descargar las guías PDF?</summary>
              <p>Puedes visualizar el material en la web sin registro, pero registrarte (gratis) te permite descargar todos los PDFs de forma directa e ilimitada.</p>
            </details>
            <details className="faq-item">
              <summary>¿Qué temas y niveles cubre la plataforma?</summary>
              <p>Abarcamos desde aritmética elemental de primaria hasta álgebra, geometría, trigonometría y cálculo preuniversitario.</p>
            </details>
          </div>
        </section>
        {/* CTA FINAL */}
        <section className="cta-banner">
          <h2>¿Listo para dominar las matemáticas?</h2>
          <p>Únete gratis a cientos de estudiantes y docentes que ya usan nuestras herramientas.</p>
          <Link to="/register" className="btn-primario grande">🚀 Crear Mi Cuenta Gratuita</Link>
        </section>

    </div>
  );
}