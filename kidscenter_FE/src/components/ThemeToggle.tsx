"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  inline?: boolean;
};

const positionStyles: Record<
  NonNullable<ThemeToggleProps["position"]>,
  React.CSSProperties
> = {
  "bottom-right": {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 9999,
  },
  "bottom-left": {
    position: "fixed",
    bottom: 24,
    left: 24,
    zIndex: 9999,
  },
  "top-right": {
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 9999,
  },
  "top-left": {
    position: "fixed",
    top: 24,
    left: 24,
    zIndex: 9999,
  },
};

export function ThemeToggle({
  position = "bottom-right",
  inline = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
      style={{
        ...(inline ? {} : positionStyles[position]),
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1.5px solid var(--kc-border)",
        background: "var(--kc-surface)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        transition: "all 0.25s ease",
        boxShadow: "0 4px 16px var(--kc-shadow)",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08) rotate(12deg)";
        e.currentTarget.style.borderColor = "var(--kc-yellow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
        e.currentTarget.style.borderColor = "var(--kc-border)";
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeToggle;