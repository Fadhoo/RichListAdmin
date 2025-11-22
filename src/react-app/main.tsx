import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/react-app/index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from "@/react-app/App.tsx";
import { Provider } from "react-redux";
import { makeStore } from "./lib/store";

const store = makeStore();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <Provider store={store}>
      <ToastContainer position='bottom-right' />
      <App />
    </Provider>
  </StrictMode>
);
