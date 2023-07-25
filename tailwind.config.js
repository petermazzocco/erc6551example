/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        erc6551: {
          primary: "#1D201F",

          secondary: "#4C6663",

          accent: "#EAD2AC",

          neutral: "#141524",

          "base-100": "#F2F5EA",

          info: "#68b0cf",

          success: "#64991E",

          warning: "#E07F00",

          error: "#C94740",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
