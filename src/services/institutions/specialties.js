import axios from 'axios';

export function getSpecialties() {
	return new Promise((resolve, reject) => {
		axios
			.get('specialties')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showSpecialty(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`specialties/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateSpecialty(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`specialties/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeSpecialty(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`specialties/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createSpecialty(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('specialties', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
