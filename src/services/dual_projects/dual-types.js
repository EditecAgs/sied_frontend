import axios from 'axios';

export function getDualTypes() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-types')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showDualType(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`dual-types/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateDualType(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`dual-types/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeDualType(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`dual-types/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createDualType(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('dual-types', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}