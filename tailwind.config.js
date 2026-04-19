/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Brand ──────────────────────────────
        primary:   "#38BDF8",   // sky-400 — 메인 하늘색
        secondary: "#7DD3FC",   // sky-300 — 서브 하늘색
        accent:    "#34D399",   // emerald — 저장/완료
        // ── Backgrounds ────────────────────────
        background: "#060E1F",  // deep navy
        surface:    "#0C1D34",  // card bg
        surface2:   "#122A45",  // input / elevated
        surface3:   "#1C3A5E",  // hover / active
        // ── Text & Border ──────────────────────
        textMuted: "#5F8BAE",
        border:    "#1A3050",
      },
    },
  },
  plugins: [],
};
