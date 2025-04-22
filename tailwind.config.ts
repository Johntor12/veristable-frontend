import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js, ts, jsx, tsx",
    ],
    theme: {
        extend: {
            colors: {
                primaryPurple:"#420092",
            },
            fontFamily: {
                jakarta: ['"Plus jakarta sans"', 'sans-serif']
            },
        },
    },
    plugins: [],
}

export default config;