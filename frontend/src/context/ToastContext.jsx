import "./Toast.css";
import { createContext, useRef, useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";

export const ToastContext = createContext();

export function ToastProvider({children}) {
    const [toast,setToast] = useState({
        isOpen: false,
        type: "success",
        message: "",
        key: 0
    });

    const timeoutRef = useRef(null);

    const showToast = useCallback((message,type="success") => {
        
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setToast({isOpen:true,message,type,key:Date.now()});

        timeoutRef.current = setTimeout(() => {
            setToast(prev => ({...prev,isOpen:false}))
        },2000); //duracion
    },[]);
    const closeToast = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setToast(prev => ({ ...prev, isOpen: false }));
    },[]);

    const value = useMemo(() => ({ showToast }), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}

            {toast.isOpen && (
                <div className="toast-container">
                    <div className="toast" key={toast.key}>
                        <div className={`toast-header ${toast.type}`}>

                        </div>
                        <div className={`toast-body ${toast.type}`}>
                            <span>{toast.message}</span>
                            <button className="toast-x" onClick={closeToast}>
                                <X size={20} strokeWidth={2}/>
                            </button>
                        </div>
                    </div>    
                </div>
            )}
        </ToastContext.Provider>
    )
}