import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";

import HeaderPrincipal from "./components/HeaderPrincipal";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";

import Dashboard  from "./pages/user/dashboard/Dashboard";
import Progreso from "./pages/user/dashboard/sections/Progreso";
import Cursos from "./pages/user/dashboard/sections/Cursos";
import Metas from "./pages/user/dashboard/sections/Metas";
import Logros from "./pages/user/dashboard/sections/Logros";
import Puntos from "./pages/user/dashboard/sections/Puntos";
import Rankings from "./pages/user/dashboard/sections/Rankings";
import Suscripcion from "./pages/user/dashboard/sections/Suscripcion";
import Perfil from "./pages/user/dashboard/sections/Perfil";
import Notificaciones from "./pages/user/dashboard/sections/Notificaciones";


import Juegos from "./pages/games/Juegos";
import Pentomino  from "./pages/games/Pentomino";
import DominoFracciones from "./pages/games/DominoFracciones";
import Sudoku from "./pages/games/Sudoku";

import DashboardAdmin from "./pages/admin/dashboard/DashboardAdmin";
import GestionUsuarios from "./pages/admin/dashboard/sections/GestionUsuarios";
import GestionNotificaciones from "./pages/admin/dashboard/sections/GestionNotificaciones";
import GestionCursos from "./pages/admin/dashboard/sections/GestionCursos";
import GestionEjercicios from "./pages/admin/dashboard/sections/GestionEjercicios";
import GestionDocumentos from "./pages/admin/dashboard/sections/GestionDocumentos";
import GestionPresentaciones from "./pages/admin/dashboard/sections/GestionPresentaciones";
import GestionVideos from "./pages/admin/dashboard/sections/GestionVideos";
import GestionPuntos from "./pages/admin/dashboard/sections/GestionPuntos";
import GestionJuegos from "./pages/admin/dashboard/sections/GestionJuegos";
import GestionRankings from "./pages/admin/dashboard/sections/GestionRankings";
import GestionSuscripciones from "./pages/admin/dashboard/sections/GestionSuscripciones";
import Analitica from "./pages/admin/dashboard/sections/Analitica";
import Configuracion from "./pages/admin/dashboard/sections/Configuracion";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import LoadingScreen from "./pages/LoadingScreen";
import ScrollToTop from "./components/ScrollToTop";




export default function App() {

  const {cargando} = useContext(UserContext);

  if (cargando) {
    return <LoadingScreen/>
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-layout">
        <HeaderPrincipal/>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/privacy-policy" element={<PoliticaPrivacidad />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="/dashboard/progreso" />} />
              <Route path="progreso" element={<Progreso />} />
              <Route path="cursos" element={<Cursos />} />
              <Route path="metas" element={<Metas />} />
              <Route path="logros" element={<Logros />} />
              <Route path="puntos" element={<Puntos />} />
              <Route path="rankings" element={<Rankings />} />
              <Route path="suscripcion" element={<Suscripcion />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="notificaciones" element={<Notificaciones />}/>
            </Route>

            <Route path="/juegos" element={<Juegos />} />
            <Route path="/juegos/pentomino" element={<Pentomino />} />
            <Route path="/juegos/domino-fracciones" element={<DominoFracciones />} />
            <Route path="/juegos/sudoku" element={<Sudoku />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />}>
              <Route index element={<Navigate to="/admin/dashboard/usuarios" />} />
              <Route path="usuarios" element={<GestionUsuarios />} />
              <Route path="notificaciones" element={<GestionNotificaciones />} />
              <Route path="cursos" element={<GestionCursos />} />
              <Route path="ejercicios" element={<GestionEjercicios />} />
              <Route path="documentos" element={<GestionDocumentos />} />
              <Route path="presentaciones" element={<GestionPresentaciones />} />
              <Route path="videos" element={<GestionVideos />} />
              <Route path="puntos" element={<GestionPuntos />} />
              <Route path="juegos" element={<GestionJuegos />} />
              <Route path="rankings" element={<GestionRankings />} />
              <Route path="suscripciones" element={<GestionSuscripciones />} />
              <Route path="analitica" element={<Analitica />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>
          </Routes>
        </main>
        <Footer/>
      </div>
      
    </BrowserRouter>
  );
}