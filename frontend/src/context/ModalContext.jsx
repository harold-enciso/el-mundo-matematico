import { createContext,useState,useEffect, useContext } from "react";
import "./Modal.css"

export const ModalContext = createContext();

export function ModalProvider({children}) {
    const [modalData,setModalData] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null
    });
    const [isVisible,setIsVisible] = useState(false);
    const showModal = ({ title, message, onConfirm = null, showCancel = true}) => {
        setModalData({
            isOpen: true,
            title,
            message,
            onConfirm,
            showCancel
        });
        setTimeout(() => setIsVisible(true), 10); // <- activar show
    };

    

    useEffect(() => {
        if (modalData.isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modalData.isOpen]);
    const hideModal = () => {
        setIsVisible(false);
        setTimeout(() => {
            setModalData(prev => ({...prev,isOpen: false}));
        },300)
    };

    return (
        <ModalContext.Provider value={{showModal, hideModal}}>
            {children}
            {modalData.isOpen && (
                <div className= {isVisible ? "modal-overlay show" : "modal-overlay"}>
                    <div className= {isVisible ? "modal-content show" : "modal-content"}>
                        <div className="modal-title">
                            <h2>
                                {modalData.title}
                            </h2>
                        </div>
                        <div className="modal-message">
                            <p>
                                {modalData.message}
                            </p>
                        </div>
                        <div className="modal-button-zone">
                            {modalData.showCancel && (
                                <button className="modal-button" onClick={hideModal}>
                                    Cancelar
                                </button>    
                            )}
                            
                            <button  className="modal-button" onClick={() => {
                                modalData.onConfirm && modalData.onConfirm();
                                hideModal();
                            }}>
                                OK
                            </button>
                        </div>
                        
                        
                    </div>
                </div>
                
            )}
        </ModalContext.Provider>
    )
}

