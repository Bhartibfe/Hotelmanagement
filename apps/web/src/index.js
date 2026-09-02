import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./assets/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/css/fontawesome-all.min.css";
import "./assets/css/swiper-bundle.min.css";
import "./assets/css/flaticon.css";
import "./assets/css/default.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css"
// Loaded last so its small-screen overrides win over style.css/responsive.css.
import "./assets/css/mobile.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { suppressTouchHover } from "./lib/suppressTouchHover";

// Stops tapped cards from latching into a hover state they can never leave.
suppressTouchHover();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
