/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      black: "var(--black)",
      grey: "var(--grey)",
      white: "var(--white)",

      "primary-lighter": "var(--primary-lighter)",
      "primary-light": "var(--primary-light)",
      primary: "var(--primary)",
      "primary-dark": "var(--primary-dark)",

      "secondary-lighter": "var(--secondary)",
      "secondary-light": "var(--secondary)",
      secondary: "var(--secondary)",
      "secondary-dark": "var(--secondary)",

      tertiary: "var(--tertiary)",

      success: "var(--success)",

      danger: "var(--danger)",
      "danger-light": "var(--danger-light)",

      warning: "var(--warning)",
      "warning-light": "var(--warning-light)",

      movie: "var(--movie)",
      series: "var(--series)",
      season: "var(--season)",
      episode: "var(--episode)",

      plex: "var(--plex)",
    },
    extend: {
      fontFamily: {
        body: ["AtkinsonHyperlegible"],
      },
    },
  },
  plugins: [],
};
