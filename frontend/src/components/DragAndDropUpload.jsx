import { useState, useEffect } from "react";
import { useToast } from "../context/useToast";
import "./DragAndDropUpload.css"
import PdfPreview from "./PDFpreview";

export default function DragAndDropUpload({ onFileSelect, file }) {
    const { showToast } = useToast();
    const [dragOver,setDragOver] = useState(false);
    const [preview,setPreview] = useState(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const fileType = file.type;
        if (fileType.startsWith("image/")) {
            setPreview(URL.createObjectURL(file));
            return () => {
                URL.revokeObjectURL(URL.createObjectURL(file))
            }
        } else if (fileType === "application/pdf") {
            setPreview(file.name);
            return () => {}
        } else {
            setPreview(file.name);
            return () => {}
        }

        
    },[file]);


    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (file) return;
        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        if (files.length>1) {
            showToast("Solo puedes subir un archivo a la vez.","warning");
            return;
        }
        //Finalmente seleccionamos el archivo despues de las validaciones
        onFileSelect(files[0]);
    };
    

    return (
        <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={dragOver ? "drag-file-zone drag-over" : "drag-file-zone"}
        onClick={() => document.getElementById("fileInput").click()}
        >
            <p>
                {dragOver
                ? "Suelta el archivo aquí..."
                : file
                    ? `Archivo seleccionado: ${file.name}`
                    : "Arrastra un archivo o haz click para seleccionar"}
            </p>

            {preview && file && file.type.startsWith("image/") && (
                <img
                    src={preview}
                    alt="preview"
                    className="drag-image-preview"
                />
            )}
            {preview && file && file.type === "application/pdf" && (
                <PdfPreview file={file} />
            )}

            

            <input
                type="file"
                id="fileInput"
                className="drag-file-input"
                onChange={(e) => onFileSelect(e.target.files[0])}
            />
                        
        </div>
    )

    
}