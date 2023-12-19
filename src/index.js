// scroll bar
import "simplebar/src/simplebar.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

//
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reportWebVitals from "./reportWebVitals";
import { Web3ContextProvider } from "./context/Web3Context";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Web3StorageContextProvider } from "./context/Web3Storage";
import { NoteContextProvider } from "./context/CreateNoteContext";
import { FirebaseDataContextProvider } from "./context/FirebaseDataContext";
// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <FirebaseDataContextProvider>
          <Web3StorageContextProvider>
            <Web3ContextProvider>
              <NoteContextProvider>
                <App />
              </NoteContextProvider>
            </Web3ContextProvider>
          </Web3StorageContextProvider>
        </FirebaseDataContextProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
reportWebVitals();
