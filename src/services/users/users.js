import axios from 'axios';

export function getUsers() {
	return new Promise((resolve, reject) => {
		axios
			.get('users')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	})
}