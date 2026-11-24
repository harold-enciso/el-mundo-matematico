import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useToast } from "../../../../context/useToast";
import { useModal } from "../../../../context/useModal";
import "./GestionUsuarios.css";

export default function GestionUsuarios() {
  const { user } = useContext(UserContext);
  const { showToast } = useToast();
  const { showModal } = useModal();

  const apiUrl = import.meta.env.VITE_API_URL;
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar lista de usuarios al montar
  useEffect(() => {
    fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setUsuarios(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        showToast("Error al cargar la lista de usuarios", "error");
        setCargando(false);
      });
  }, [apiUrl, user.token]);

  // Cambiar rol de un usuario
  const handleCambiarRol = (usuarioId, nuevoRol) => {
    fetch(`${apiUrl}/users/${usuarioId}/role`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: nuevoRol }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuarioId ? { ...u, role: nuevoRol } : u))
        );
        showToast("Rol actualizado con éxito", "success");
      })
      .catch(() => showToast("No se pudo cambiar el rol", "error"));
  };

  // Eliminar un usuario
  const handleEliminarUsuario = (usuarioId) => {
    fetch(`${apiUrl}/users/${usuarioId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setUsuarios((prev) => prev.filter((u) => u.id !== usuarioId));
        showToast("Usuario eliminado correctamente", "info");
      })
      .catch(() => showToast("Error al eliminar usuario", "error"));
  };

  return (
    <div className="seccion-admin">
      <div className="encabezado-seccion">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios registrados en la plataforma.</p>
        </div>
      </div>

      {cargando ? (
        <div className="mensaje-cargando">Cargando usuarios...</div>
      ) : usuarios.length === 0 ? (
        <div className="bloque-vacio-admin">No hay usuarios registrados aún.</div>
      ) : (
        <div className="contenedor-tabla">
          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Usuario / Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="nombre-usuario-col">
                      <strong>{u.username || "Sin usuario"}</strong>
                      <small>{u.first_name ? `${u.first_name} ${u.last_name || ""}` : "Sin nombre"}</small>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge-rol ${u.role === "admin" ? "admin" : "user"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-celda">
                      <button
                        className="boton-tabla secundario"
                        onClick={() =>
                          showModal({
                            title: "Cambiar Rol",
                            message: `¿Deseas cambiar el rol de ${u.email} a ${u.role === "admin" ? "usuario" : "admin"}?`,
                            onConfirm: () =>
                              handleCambiarRol(u.id, u.role === "admin" ? "user" : "admin"),
                          })
                        }
                      >
                        {u.role === "admin" ? "Hacer Usuario" : "Hacer Admin"}
                      </button>

                      <button
                        className="boton-tabla peligro"
                        onClick={() =>
                          showModal({
                            title: "Eliminar Usuario",
                            message: `¿Estás seguro de eliminar la cuenta de ${u.email}? Esta acción no se puede deshacer.`,
                            onConfirm: () => handleEliminarUsuario(u.id),
                          })
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}