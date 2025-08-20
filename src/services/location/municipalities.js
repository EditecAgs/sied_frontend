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


export function showMunicipalities(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`municipalities/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateMunicipalities(pk) {
	return new Promise((resolve, reject) => {
		axios
			.put(`municipalities/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeMunicipalities(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`municipalities/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createMunicipalities(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('municipalities', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}