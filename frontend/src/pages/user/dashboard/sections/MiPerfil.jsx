import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useToast } from "../../../../context/useToast";
import { useModal } from "../../../../context/useModal";
import "./MiPerfil.css";

export default function MiPerfil() {
  const { showModal } = useModal();
  const { showToast } = useToast();
  const { user, setUser } = useContext(UserContext);

  const apiUrl = import.meta.env.VITE_API_URL;
  const meUrl = `${apiUrl}/auth/me`;

  const [copiaUser, setCopiaUser] = useState(null);
  const [editable, setEditable] = useState(false);

  // Sincroniza la copia local con el usuario cargado en el contexto
  useEffect(() => {
    if (user) {
      setCopiaUser({ ...user });
    }
  }, [user]);

  const handleUpdate = () => {
    return fetch(meUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: copiaUser.username,
        first_name: copiaUser.first_name,
        last_name: copiaUser.last_name,
        birth_date: copiaUser.birth_date,
        country: copiaUser.country,
      }),
    })
      .then((res) =>
        res
          .json()
          .catch(() => ({}))
          .then((data) => {
            if (!res.ok) throw data;
            return data;
          })
      )
      .then((data) => {
        // Actualizamos el contexto global con la respuesta del servidor
        setUser((prevUser) => ({
          ...prevUser,
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          birth_date: data.birth_date,
          country: data.country,
        }));
        setEditable(false);
        showToast("Tus datos han sido actualizados correctamente", "success");
      })
      .catch((err) => {
        console.error(err);
        showToast("Ocurrió un error al actualizar tus datos", "error");
      });
  };

  const handleCancelar = () => {
    setCopiaUser({ ...user }); // Resetea los inputs a los datos guardados
    setEditable(false);
  };

  if (!copiaUser) return null;

  return (
    <div className="tarjeta-perfil">
      <h1 className="titulo-perfil">Datos Personales</h1>

      <div className="grid-perfil">
        {/* Columna 1 */}
        <div className="columna-perfil">
          <div className="campo-grupo">
            <label className="etiqueta-input">Correo Electrónico</label>
            <input
              type="text"
              value={copiaUser.email || ""}
              readOnly
              className="input-perfil deshabilitado"
            />
          </div>

          <div className="campo-grupo">
            <label className="etiqueta-input">Nombre de Usuario</label>
            <input
              type="text"
              value={copiaUser.username ?? ""}
              onChange={(e) => setCopiaUser({ ...copiaUser, username: e.target.value })}
              readOnly={!editable}
              className={`input-perfil ${!editable ? "deshabilitado" : ""}`}
            />
          </div>

          <div className="campo-grupo">
            <label className="etiqueta-input">Nombre</label>
            <input
              type="text"
              value={copiaUser.first_name ?? ""}
              onChange={(e) => setCopiaUser({ ...copiaUser, first_name: e.target.value })}
              readOnly={!editable}
              className={`input-perfil ${!editable ? "deshabilitado" : ""}`}
            />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="columna-perfil">
          <div className="campo-grupo">
            <label className="etiqueta-input">Apellidos</label>
            <input
              type="text"
              value={copiaUser.last_name ?? ""}
              onChange={(e) => setCopiaUser({ ...copiaUser, last_name: e.target.value })}
              readOnly={!editable}
              className={`input-perfil ${!editable ? "deshabilitado" : ""}`}
            />
          </div>

          <div className="campo-grupo">
            <label className="etiqueta-input">Fecha de Nacimiento</label>
            <input
              type="date"
              value={copiaUser.birth_date ?? ""}
              onChange={(e) => setCopiaUser({ ...copiaUser, birth_date: e.target.value })}
              disabled={!editable}
              className={`input-perfil ${!editable ? "deshabilitado" : ""}`}
            />
          </div>

          <div className="campo-grupo">
            <label className="etiqueta-input">País</label>
            <input
              type="text"
              value={copiaUser.country ?? ""}
              onChange={(e) => setCopiaUser({ ...copiaUser, country: e.target.value })}
              readOnly={!editable}
              className={`input-perfil ${!editable ? "deshabilitado" : ""}`}
            />
          </div>
        </div>
      </div>

      <div className="acciones-perfil">
        <button
          className="boton-accion primario"
          onClick={() => {
            if (!editable) {
              setEditable(true);
              return;
            }
            showModal({
              title: "Editar datos",
              message: "¿Estás seguro de que deseas guardar tus datos actualizados?",
              onConfirm: () => handleUpdate(),
            });
          }}
        >
          {!editable ? "Editar Datos" : "Guardar Cambios"}
        </button>

        {editable && (
          <button className="boton-accion secundario" onClick={handleCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}