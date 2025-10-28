import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Pentomino  from "./pages/games/Pentomino";
import DominoFracciones from "./pages/games/DominoFracciones";
import Sudoku from "./pages/games/Sudoku";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/juegos/pentomino" element={<Pentomino />} />
        <Route path="/juegos/domino-fracciones" element={<DominoFracciones />} />
        <Route path="/juegos/sudoku" element={<Sudoku />} />
      </Routes>
    </BrowserRouter>
  );
}