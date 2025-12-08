import { useNavigate } from "react-router-dom";
import "./NotificacionItem.css"
export default function NotificacionItem({children,to,onClick,disabled,className}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (disabled) return;
        if (to) navigate(to);
        if (onClick) onClick();
    };

    const notiSeleccionada = "";

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className= {className || "notificacion-item"}
        >
            {children}
        </button>
    );
}