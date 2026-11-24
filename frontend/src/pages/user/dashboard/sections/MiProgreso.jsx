import "./MiProgreso.css";

export default function MiProgreso() {
  return (
    <section className="tarjeta-progreso">
      <h1 className="titulo-seccion">Mi Progreso</h1>
      <p className="descripcion-seccion">
        Aquí podrás ver los cursos teóricos que has completado y tus temas guardados.
      </p>
      
      <div className="bloque-vacio">
        <span className="icono-estado">📚</span>
        <h3>Aún no has iniciado ningún curso</h3>
        <p>Explora el catálogo gratuito para comenzar a aprender.</p>
      </div>
    </section>
  );
}