import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { seedDatabase } from "./db/seed.js";

async function startApplication() {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  try {
    await seedDatabase();
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error("Gagal menyiapkan database CBT:", error);
    root.render(
      <main className="startup-error">
        <h1>Aplikasi belum dapat dimulai</h1>
        <p>Database lokal gagal disiapkan. Muat ulang halaman atau periksa dukungan IndexedDB browser.</p>
      </main>,
    );
  }
}

startApplication();
