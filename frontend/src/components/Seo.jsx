import { useEffect } from "react";

export default function Seo({ title, noindex = false }) {
  useEffect(() => {
    if (title) document.title = title;

    if (noindex) {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, follow";
      document.head.appendChild(meta);
      return () => document.head.removeChild(meta);
    }
  }, [title, noindex]);

  return null;
}