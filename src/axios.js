/**
 * Axios setup con manejo de token y expiración de sesión
 */
import axios from 'axios';

export function useAxios(router) {

    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL + '/api/';
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	axios.defaults.headers.common['Accept'] = 'application/json';
	axios.defaults.headers.common['Content-Type'] = 'application/json';


axios.defaults.withCredentials = true;

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                console.log('Usuario no autorizado. Sesión expirada o token inválido.');
                router.push('/signin');
            }
            return Promise.reject(error);
        }
    );

    return axios;
}
