import { useEffect, useState } from "react";
import  "./DragAndDropUpload.css";
export default function PdfPreview({ file }) {
    const [localUrl, setLocalUrl] = useState(null);

    useEffect(() => {
        if (!file) {
            setLocalUrl(null);
            return;
        }

        const blobUrl = URL.createObjectURL(file);
        setLocalUrl(blobUrl);

        return () => URL.revokeObjectURL(blobUrl);
    }, [file]);

    if (!file) return null;

    return (
        <iframe
            src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(localUrl)}`}
            width="100%"
            height="500px"
            title="PDF Preview"
            className="drag-pdf-preview"
        />
    );
}