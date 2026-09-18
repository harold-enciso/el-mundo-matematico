import { useEffect } from "react";
import PropTypes from "prop-types";

export default function Seo({ title, noindex = false }) {
  useEffect(() => {
    if (title) document.title = title;

    if (noindex) {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, follow";
      document.head.appendChild(meta);
      return () => meta.remove();
    }
  }, [title, noindex]);

  return null;
}

Seo.propTypes = {
  title: PropTypes.string,
  noindex: PropTypes.bool,
};