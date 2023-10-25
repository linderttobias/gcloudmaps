import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./Main";
import About from "./About";



export default function Apps() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Main />} />
          <Route path="/about" element={<About />} />
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