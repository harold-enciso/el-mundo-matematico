import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";

import HeaderPrincipal from "./components/layout/HeaderPrincipal";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PoliticaPrivacidad from "./pages/auth/PoliticaPrivacidad";


import DashboardUserLayout from "./pages/user/dashboard/DashboardUserLayout";
import MiProgreso from "./pages/user/dashboard/sections/MiProgreso";
import MiPerfil from "./pages/user/dashboard/sections/MiPerfil";

import Juegos from "./pages/games/Juegos";
import Pentomino  from "./pages/games/Pentomino";
import DominoFracciones from "./pages/games/DominoFracciones";
import Sudoku from "./pages/games/Sudoku";

import DashboardAdminLayout from "./pages/admin/dashboard/DashboardAdminLayout";
import GestionUsuarios from "./pages/admin/dashboard/sections/GestionUsuarios";
import GestionCursos from "./pages/admin/dashboard/sections/GestionCursos";



import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import LoadingScreen from "./components/common/LoadingScreen";
import ScrollToTop from "./components/common/ScrollToTop";

import CatalogoCursos from "./pages/cursos/CatalogoCursos";
import CursoTemas from "./pages/cursos/CursoTemas";
import TemaContenido from "./pages/cursos/TemaContenido";
import EditarCursoTemas from "./pages/admin/dashboard/sections/EditarCursoTemas";
import EditarTemaBloques from "./pages/admin/dashboard/sections/EditarTemaBloques";

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
            {/* Nivel 1: Lista todos los cursos */}
            <Route path="/cursos" element={<CatalogoCursos />} />

            {/* Nivel 2: Lista los temas de un curso (ej: /cursos/alg) */}
            <Route path="/cursos/:cursoId" element={<CursoTemas />} />

            {/* Nivel 3: Muestra la lección con los módulos dinámicos */}
            <Route path="/cursos/:cursoId/:temaSlug" element={<TemaContenido />} />
            <Route path="/dashboard" element={<DashboardUserLayout />}>
              <Route index element={<Navigate to="/dashboard/progreso" replace />} />
              <Route path="progreso" element={<MiProgreso />} />
              <Route path="perfil" element={<MiPerfil />} />
            </Route>

            <Route path="/admin/dashboard" element={<DashboardAdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard/cursos" replace />} />
              <Route path="cursos" element={<GestionCursos />} />
              <Route path="cursos/:cursoId/temas" element={<EditarCursoTemas />} />
              <Route path="cursos/:cursoId/temas/:temaId/bloques" element={<EditarTemaBloques />} />
              <Route path="usuarios" element={<GestionUsuarios />} />
            </Route>

            <Route path="/juegos" element={<Juegos />} />
            <Route path="/juegos/pentomino" element={<Pentomino />} />
            <Route path="/juegos/domino-fracciones" element={<DominoFracciones />} />
            <Route path="/juegos/sudoku" element={<Sudoku />} />
            
          </Routes>
        </main>
        <Footer/>
      </div>
      
    </BrowserRouter>
  );
}