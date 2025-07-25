import axios from 'axios';

export function getSectors() {
	return new Promise((resolve, reject) => {
		axios
			.get('sectors')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showSector(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`sectors/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateSector(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`sectors/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeSector(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`sectors/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createSector(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('sectors', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
