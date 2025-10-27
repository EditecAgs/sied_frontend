/**
 * Axios setup con manejo de token y expiración de sesión
 */
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
      console.log('Usuario no autorizado. Sesión expirada o token inválido.');

      try {
        await axios.get('/logout'); 
      } catch (err) {
        console.error('Error al llamar logout del backend:', err);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('institution');
      axios.defaults.headers.common['Authorization'] = undefined;

      router.push('/signin');
    }
    return Promise.reject(error);
  }
);
}
