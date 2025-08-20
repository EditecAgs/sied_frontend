/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useAxios(_router, _store) {
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
    axios;

    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL + '/api/'

    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            if (error.response.status === 401) {
                console.log('Forbidden')
                //localStorage.setItem('session_expired', 'true');
                //store.dispatch('auth/logout', {router});
            }
            return Promise.reject(error);
        }
    );
    return axios;
}