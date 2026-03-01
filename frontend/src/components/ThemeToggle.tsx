"use client";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    // Don't render anything if theme isn't set yet (avoid hydration mismatch)
    if (!theme) return <div style={{ width: 32, height: 32 }} />;

    return (
        <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: "0.4rem 0.6rem", fontSize: "1.2rem", borderRadius: "8px" }}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>
    );
}
