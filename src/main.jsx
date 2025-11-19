import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import SavedUsers from "./pages/SavedUsers";
import Layout from "./layouts/Layout";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/saved" element={<SavedUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
