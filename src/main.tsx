import "@shopify/polaris/build/esm/styles.css";
import en from "@shopify/polaris/locales/en.json";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@shopify/polaris";
import App from "./App";

const container = document.getElementById("root") as HTMLDivElement;

const root = createRoot(container);
root.render(
  <AppProvider i18n={en}>
    <App />
  </AppProvider>
);
