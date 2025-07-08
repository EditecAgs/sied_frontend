module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
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
            },
        },
    },
    plugins: [require('flowbite/plugin')],
};
