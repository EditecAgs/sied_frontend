import axios from 'axios';




export function login(email, password) {
	return axios.get('http://localhost:8000/sanctum/csrf-cookie')
		.then(() => {
			return axios.post('/login', { email, password });
		})
		.then(response => response.data)
		.catch(error => {
			console.error('Error completo:', error);
			throw error;
		});
}