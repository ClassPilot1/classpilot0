/**
 * Main Entry Point / Barta Ugu Horreysa
 * This file initializes the React application and sets up routing and state management
 * Faylkan wuxuu bilaabayaa codka React oo wuxuu dhisayaa routing iyo maamulka xaaladda
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Store/index";
import App from "./App.jsx";
import "./index.css";

// Render the application / Soo bandhig codka
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Store Provider / Bixiyaha Redux Store */}
    <Provider store={store}>
      {/* Router for navigation / Router si loo socdo */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
