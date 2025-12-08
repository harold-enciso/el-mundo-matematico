import { useNavigate, useLocation } from "react-router-dom";
import "./SidebarItem.css"
export default function DropdownItem({children,to,onClick,disabled}) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = to ? location.pathname === to : false;
    const handleClick = () => {
        if (disabled) return;
        if (to) navigate(to);
        if (onClick) onClick();
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className= {isActive ? "sidebar-item active" : "sidebar-item"}
        >
            {children}
        </button>
    );
}