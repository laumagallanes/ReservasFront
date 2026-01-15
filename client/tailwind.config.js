/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'malaga': {
                    50: '#ffeeea',  // USER REQUEST: Predominant color (Background)
                    100: '#f5e6d8',
                    200: '#ebdccb',
                    300: '#d7c2aa',
                    400: '#bf9e80',
                    500: '#a67c52',
                    600: '#8c6239', // Darker brown for contrast (Replacing #9b7149)
                    700: '#73502f',
                    800: '#5c4026',
                    900: '#45301d',
                    'olive': '#6b705c',
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            backgroundImage: {
                'pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
            }
        },
    },
    plugins: [],
}
