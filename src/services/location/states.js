import axios from 'axios';

export function getStates() {
	return new Promise((resolve, reject) => {
		axios
			.get('states')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}