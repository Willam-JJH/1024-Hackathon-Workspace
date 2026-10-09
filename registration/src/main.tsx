import { createRoot } from "react-dom/client";
import "./index.css";
import "./locales/index.ts";  // i18n configuration
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(<App />);
