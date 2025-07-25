import axios from 'axios';

export function getDualAreas() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-areas')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showDualArea(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`dual-areas/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateDualArea(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`dual-areas/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeDualArea(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`dual-areas/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createDualArea(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('dual-areas', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
