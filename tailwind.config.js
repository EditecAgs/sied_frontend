module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './node_modules/flowbite/**/*.js'
    ],
    theme: {
        extend: {
            colors: {
                dark_blue: {
                    500: '#000656',
                },
                gray: {
                    450: '#848484',
                },
                purple: {
                    300: '#8d6ef6',
                    600: '#4C33CF',
                },
                brand: {
                    50: '#fef2f2',
                    100: '#ffe2e2',
                    200: '#931F44',
                    300: '#390F1E',
                    400: '#931F44',
                    500: '#390F1E',
                    600: '#931F44',
                    700: '#390F1E',
                    800: '#931F44',
                    900: '#390F1E',
                },
                success: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
