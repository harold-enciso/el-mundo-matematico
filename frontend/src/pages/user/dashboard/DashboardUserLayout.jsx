import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import "./DashboardUserLayout.css";

export default function DashboardUserLayout() {
  const navigate = useNavigate();
  const { user, cargando } = useContext(UserContext);

  useEffect(() => {
    if (!cargando && !user?.token) {
      navigate("/login");
    }
  }, [user, cargando, navigate]);

  if (cargando || !user) return null;

  return (
    <div className="contenedor-dashboard-usuario">
      <main className="contenido-dashboard-usuario">
        <Outlet />
      </main>
    </div>
  );
}