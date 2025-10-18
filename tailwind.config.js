/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: "jit",
    darkMode: "class",
    content: ["./**/*.tsx"],
    theme: {
        extend: {
            colors: {
                'primary': '#ff3364',
                'secondary': '#fcc163',
                'tertiary': '#76ded7',
                'text': '#202020',
                'text-2': '#8e93ab',
                'bg-1': '#e9e9e9',
                'bg-2': '#ffffff',
            }
        }
    },
    plugins: []
}