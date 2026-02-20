import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { ThemeSync } from "./shared/theme/ThemeSync";
import "./index.css";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

function initTheme() {
  const stored = localStorage.getItem("theme");
  document.documentElement.classList.toggle("dark", stored === "dark");
}

enableMocking().then(() => {
  initTheme();
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
      <ThemeSync />
      <RouterProvider router={router} />
    </>
  );
});