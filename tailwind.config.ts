import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js, ts, jsx, tsx"],
  theme: {
    extend: {
      colors: {
        primaryPurple: "#420092",
      },
      fontFamily: {
        jakarta: ['"Plus jakarta sans"', "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.03em",
        tightest: "-0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
