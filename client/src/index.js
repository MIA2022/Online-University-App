import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

//used BrowserRouter to keep our UI in sync with the URL
ReactDOM.createRoot(document.getElementById('root'))
        .render(
            <React.StrictMode>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </React.StrictMode>
        )