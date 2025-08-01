import axios from 'axios';

export function getCareers() {
	return new Promise((resolve, reject) => {
		axios
			.get('careers')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showCareer(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`careers/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateCareer(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`careers/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeCareer(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`careers/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createCareer(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('careers', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
