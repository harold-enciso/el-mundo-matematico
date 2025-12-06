import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard  from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import Pentomino  from "./pages/games/Pentomino";
import DominoFracciones from "./pages/games/DominoFracciones";
import Sudoku from "./pages/games/Sudoku";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/juegos/pentomino" element={<Pentomino />} />
        <Route path="/juegos/domino-fracciones" element={<DominoFracciones />} />
        <Route path="/juegos/sudoku" element={<Sudoku />} />
      </Routes>
    </BrowserRouter>
  );
}