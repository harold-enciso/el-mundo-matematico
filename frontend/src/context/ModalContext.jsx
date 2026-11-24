import { createContext, useState } from "react";
import "./Modal.css";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    showCancel: true,
    isLoading: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  // Modal normal
  const showModal = ({ title, message, onConfirm = null, showCancel = true }) => {
    setModalData({
      isOpen: true,
      title,
      message,
      onConfirm,
      showCancel,
      isLoading: false,
    });
    setTimeout(() => setIsVisible(true), 10);
  };

  // Modal de carga
  const showLoading = (message = "Procesando...") => {
    setModalData({
      isOpen: true,
      title: "",
      message,
      onConfirm: null,
      showCancel: false,
      isLoading: true,
    });
    setTimeout(() => setIsVisible(true), 10);
  };

  const hideModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setModalData((prev) => ({ ...prev, isOpen: false }));
    }, 200);
  };

  const hideLoading = () => hideModal();



  return (
    <ModalContext.Provider value={{ showModal, hideModal, showLoading, hideLoading }}>
      {children}
      {modalData.isOpen && (
        <div className={isVisible ? "modal-overlay show" : "modal-overlay"}>
          <div className={isVisible ? "modal-content show" : "modal-content"}>
            {modalData.isLoading ? (
              <div className="modal-loading-container">
                <div className="loading-spinner"></div>
                <p>{modalData.message}</p>
              </div>
            ) : (
              <>
                {modalData.title && (
                  <div className="modal-title">
                    <h2>{modalData.title}</h2>
                  </div>
                )}

                <div className="modal-message">
                  <p>{modalData.message}</p>
                </div>

                <div className="modal-button-zone">
                  {modalData.showCancel && (
                    <button className="modal-button cancel" onClick={hideModal}>
                      Cancelar
                    </button>
                  )}

                  <button
                    className="modal-button confirm"
                    onClick={() => {
                      if (modalData.onConfirm) modalData.onConfirm();
                      hideModal();
                    }}
                  >
                    Aceptar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}