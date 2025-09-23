import axios from 'axios';

export function getMicroCredentials() {
	return new Promise((resolve, reject) => {
		axios
			.get('micro-credentials')
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

export function showMicroCredential(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`micro-credentials/${pk}`)
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

export function createMicroCredential(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('micro-credentials', params)
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

export function updateMicroCredential(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`micro-credentials/${pk}`, params)
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

export function removeMicroCredential(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`micro-credentials/${pk}`)
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

