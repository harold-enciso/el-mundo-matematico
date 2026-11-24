import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import SidebarAdmin from "../../../components/layout/SidebarAdmin";
import "./DashboardAdminLayout.css";

export default function DashboardAdminLayout() {
  const navigate = useNavigate();
  const { user, cargando } = useContext(UserContext);

  useEffect(() => {
    if (!cargando && !user?.token) {
      navigate("/login");
    } else if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, cargando, navigate]);

  if (cargando || !user) return null;

  return (
    <div className="contenedor-dashboard-admin">
      <SidebarAdmin />
      <main className="contenido-dashboard-admin">
        <Outlet />
      </main>
    </div>
  );
}