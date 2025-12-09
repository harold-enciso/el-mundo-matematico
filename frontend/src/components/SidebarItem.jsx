import { useNavigate, useLocation } from "react-router-dom";
import "./SidebarItem.css"
export default function DropdownItem({to,onClick,disabled,source,text}) {
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
            {source && <img src={source} className={isActive ? "sidebar-imagen active" : "sidebar-imagen"}></img>}
            {text && <span className={isActive ? "sidebar-texto active" : "sidebar-texto"}>{text}</span>}
        </button>
    );
}