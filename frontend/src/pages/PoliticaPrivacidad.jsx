import "./Login.css";

export default function PoliticaPrivacidad() {
  return (
    <div className="fondo-login">
      <div className="recuadro-login recuadro-legales">
        
        <h1>Política de Privacidad</h1>
        <p>
          Última actualización: Septiembre de 2026
        </p>

        <div className="contenido-legal">
          <h2>1. Introducción</h2>
          <p>
            En <strong>El Mundo Matemático</strong> nos tomamos en serio tu privacidad. Esta política 
            explica de forma transparente cómo recopilamos, utilizamos y protegemos la información personal 
            dentro de nuestra plataforma.
          </p>

          <h2>2. Información que recopilamos</h2>
          <p>
            Para el correcto funcionamiento del sistema y la gestión de tu cuenta, recopilamos:
          </p>
          <ul>
            <li>
              <strong>Datos obligatorios de la cuenta:</strong> Correo electrónico y contraseña almacenada de forma cifrada (encriptada).
            </li>
            <li>
              <strong>Datos opcionales del perfil:</strong> Nombre, apellidos, nombre de usuario y fecha de nacimiento (información que puedes ingresar o modificar voluntariamente desde la sección &quot;Tu Perfil&quot;).
            </li>
            <li>
              <strong>Seguridad y datos técnicos:</strong> Dirección IP y tokens temporales de verificación anti-bot.
            </li>
          </ul>

          <h2>3. Finalidad del uso de tus datos</h2>
          <p>
            La información recopilada se utiliza exclusivamente para:
          </p>
          <ul>
            <li>Gestionar el acceso y autenticación en tu cuenta.</li>
            <li>Enviar correos de verificación para activar tu cuenta tras el registro.</li>
            <li>Permitir la recuperación de acceso mediante el sistema de restablecimiento de contraseña.</li>
            <li>Proteger el sitio contra accesos no autorizados, ataques o automatizaciones (bots).</li>
          </ul>

          <h2>4. Servicios de terceros (Subprocesadores)</h2>
          <p>
            No vendemos ni comercializamos tus datos con terceros. Para prestar nuestros servicios, nos apoyamos en:
          </p>
          <ul>
            <li>
              <strong>Brevo (proveedor de correo):</strong> Para el envío exclusivo de correos transaccionales (códigos de verificación de cuenta y enlaces de recuperación de contraseña) desde nuestro dominio oficial.
            </li>
            <li>
              <strong>Cloudflare Turnstile:</strong> Para validar los formularios de registro y recuperación de cuenta, detectando automatizaciones mediante señales del navegador sin utilizar cookies publicitarias ni rastrear tu actividad.
            </li>
          </ul>

          <h2>5. Derechos del usuario y eliminación de cuenta (Ley N° 29733 - Perú)</h2>
          <p>
            De acuerdo con la <strong>Ley de Protección de Datos Personales de Perú (Ley N° 29733)</strong>, 
            tienes derecho a acceder, actualizar, rectificar o eliminar tus datos personales (Derechos ARCO).
          </p>
          <p>
            Si deseas eliminar definitivamente tu cuenta y borrar toda tu información almacenada en nuestra base de datos, 
            solo debes enviarnos una solicitud desde tu correo registrado a{" "}
            <strong>soporte@elmundomatematico.com</strong> y procesaremos la baja de tus datos manualmente.
          </p>

          <h2>6. Contacto</h2>
          <p>
            Si tienes dudas, consultas o solicitudes relacionadas con esta Política de Privacidad, escríbenos a nuestro canal oficial:{" "}
            <a href="mailto:soporte@elmundomatematico.com" style={{ color: "inherit", fontWeight: "bold" }}>
              soporte@elmundomatematico.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}