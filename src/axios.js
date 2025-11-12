import axios from 'axios';

export function useAxios(router) {
	axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL + '/api/';
	axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

	axios.interceptors.request.use(config => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});

	axios.interceptors.response.use(
		response => response,
		async error => {
			if (error.response && error.response.status === 401) {
				console.warn('Usuario no autorizado. Sesión expirada o token inválido.');
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				localStorage.removeItem('user_type');
				localStorage.removeItem('institution');
				delete axios.defaults.headers.common['Authorization'];

				if (router.currentRoute.value.path !== '/signin') {
					router.push('/signin');
				}
			}
			return Promise.reject(error);
		}
	);

	// 👇 ESTA LÍNEA ES LA CLAVE
	window.axios = axios;
}
