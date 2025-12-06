import "./Dropdown.css";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function DropdownMenu(){
    const [open,setOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return(
        <div className="dropdown" ref={menuRef}>
            <button className="icon-menu" onClick={() => setOpen(!open)}>
                <Menu size={24}/>
            </button>
            {open &&(
                <div className="dropdown-menu right">
                    <Link to="/juegos/sudoku" onClick={()=>setOpen(false)}>
                    Sudoku
                    </Link>
                    <Link to="/juegos/domino-fracciones" onClick={()=>setOpen(false)}>
                    Dominó de fracciones
                    </Link>
                    <Link to="/juegos/pentomino" onClick={()=>setOpen(false)}>
                    Pentomi
                    </Link>
                    
                </div>
            )}    
        </div>
    )
}