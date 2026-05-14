import type { Config } from "tailwindcss";

const config: Config = {
  // Gunakan class/attribute strategy agar bisa dikontrol manual lewat data-theme
  darkMode: ["selector", '[data-theme="dark"]'],

  content: [
    // Perbaikan: path tanpa "src/" karena struktur project langsung di root
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // Daftarkan CSS variables Kidscenter ke Tailwind
      // sehingga bisa dipakai: bg-kc-bg, text-kc-yellow, border-kc-border, dst.
      colors: {
        kc: {
          yellow:  "var(--kc-yellow)",
          red:     "var(--kc-red)",
          navy:    "var(--kc-navy)",
          bg:      "var(--kc-bg)",
          "bg-alt":"var(--kc-bg-alt)",
          "bg-deep":"var(--kc-bg-deep)",
          surface: "var(--kc-surface)",
          border:  "var(--kc-border)",
          text:    "var(--kc-text)",
          muted:   "var(--kc-text-muted)",
          faint:   "var(--kc-text-faint)",
          error:   "var(--kc-error)",
          success: "var(--kc-success)",
        },
      },
      fontFamily: {
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;