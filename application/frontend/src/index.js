import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Home from "./Home";



export default function Apps() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<App />} />
          <Route path="/about" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Apps />
  </StrictMode>
);