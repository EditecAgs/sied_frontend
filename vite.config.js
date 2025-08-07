import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'http://edutech.aguascalientes.tecnm:50000',
				changeOrigin: true,
				pathRewrite: (path) => path.replace(/^\/api/, ''),
				secure: false,
			},
		},
	},
	plugins: [vue()],
});
