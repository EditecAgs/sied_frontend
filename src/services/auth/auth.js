import axios from 'axios';

export function login(email, password) {
    return axios
        .post('login', { email, password })
        .then(response => response.data)
        .catch(error => {

            throw error;
        });
}

