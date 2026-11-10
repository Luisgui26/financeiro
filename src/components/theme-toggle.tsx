"use client";
import { useEffect } from "react";
export function ThemeInitializer() { useEffect(() => { document.documentElement.dataset.theme = localStorage.getItem("saldo-theme") === "dark" ? "dark" : "light"; }, []); return null; }
export function ThemeToggle() {
  function toggle() { const value = document.documentElement.dataset.theme !== "dark"; document.documentElement.dataset.theme = value ? "dark" : "light"; localStorage.setItem("saldo-theme", value ? "dark" : "light"); }
  return <button type="button" className="subtle" onClick={toggle}>Alternar tema claro/escuro</button>;
}
