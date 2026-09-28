import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
    {/*
      Outside BrowserRouter so anything rendered outside <App> is covered too.
      Every page's <title>, description, canonical and og:* tags come from the
      <Seo> component; index.html only holds the pre-hydration defaults.
    */}
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
