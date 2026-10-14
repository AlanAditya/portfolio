import { useEffect, useState } from "react";

const storageKey = "aditya-portfolio-theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#000000" : "#f5f3ec");
}

export default function ThemeToggle() {
  // Match the prerendered markup, then synchronize with the pre-paint theme.
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    let explicitChoice = false;
    try {
      explicitChoice = ["light", "dark"].includes(
        localStorage.getItem(storageKey) ?? "",
      );
    } catch {
      /* Storage may be disabled. */
    }
    const syncSystem = () => {
      if (explicitChoice) return;
      const theme = system.matches ? "dark" : "light";
      applyTheme(theme);
      setDark(theme === "dark");
    };
    const chosen = () => {
      explicitChoice = true;
    };
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return;
      explicitChoice = event.newValue === "dark" || event.newValue === "light";
      const theme = explicitChoice
        ? (event.newValue as Theme)
        : system.matches
          ? "dark"
          : "light";
      applyTheme(theme);
      setDark(theme === "dark");
    };
    system.addEventListener("change", syncSystem);
    window.addEventListener("portfolio-theme-choice", chosen);
    window.addEventListener("storage", syncStorage);
    return () => {
      system.removeEventListener("change", syncSystem);
      window.removeEventListener("portfolio-theme-choice", chosen);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);
  function toggle() {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    setDark(theme === "dark");
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      /* Toggle still works without persistence. */
    }
    window.dispatchEvent(new Event("portfolio-theme-choice"));
  }
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <svg
        className="theme-moon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
      </svg>
      <svg
        className="theme-sun"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </svg>
    </button>
  );
}
