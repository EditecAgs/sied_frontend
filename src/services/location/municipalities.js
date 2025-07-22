import axios from 'axios';

export function getMunicipalities() {
	return new Promise((resolve, reject) => {
		axios
			.get('municipalities')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	})
}