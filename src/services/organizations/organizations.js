import axios from 'axios';

export function getOrganizations() {
	return new Promise((resolve, reject) => {
		axios
			.get('organizations')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showOrganization(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`organizations/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateOrganization(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`organizations/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeOrganization(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`organizations/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createOrganization(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('organizations', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
