import axios from 'axios';

export function getTypes() {
	return new Promise((resolve, reject) => {
		axios
			.get('types')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showType(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`types/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateType(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`types/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeType(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`types/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createType(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('types', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
