/**
 * Axios setup con manejo de token y expiración de sesión
 */
import axios from 'axios';
import * as jwtDecode from 'jwt-decode'; // ⚡ Importación correcta para Vite

export function useAxios(router) {

    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL + '/api/';
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    axios.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            let decoded = null;
            try {
                decoded = jwtDecode.default(token); // ⚡ Usar .default aquí
                console.log('Usuario:', decoded.name || decoded.email);
                console.log('ID:', decoded.id);
                console.log('Fecha de login:', new Date(decoded.iat * 1000).toLocaleString());

                // Guardamos globalmente
                window.usuarioLogueado = decoded;
                window.UserAdmin = decoded.type === 0;

            } catch (err) {
                console.error('Error al decodificar token:', err);
                window.usuarioLogueado = null;
                window.UserAdmin = false;
            }

            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                console.log('Usuario no autorizado. Sesión expirada o token inválido.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.usuarioLogueado = null;
                window.UserAdmin = false;
                router.push('/signin');
            }
            return Promise.reject(error);
        }
    );

    return axios;
}
