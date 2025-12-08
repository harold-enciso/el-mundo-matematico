import { useNavigate } from "react-router-dom";
import "./DropdownItem.css"
export default function DropdownItem({children,to,onClick,disabled,className}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (disabled) return;
        if (to) navigate(to);
        if (onClick) onClick();
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className= {className || "dropdown-item"}
        >
            {children}
        </button>
    );
}