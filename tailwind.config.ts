import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js, ts, jsx, tsx",
    ],
    theme: {
        extend: {
            fontFamily: {
                jakarta: ['"Plus jakarta sans"', 'sans-serif']
            },
        },
    },
    plugins: [],
}

export default config;