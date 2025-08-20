import axios from 'axios';

export function getDocumentStatuses() {
	return new Promise((resolve, reject) => {
		axios
			.get('documents-statuses')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showDocumentStatus(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`documents-statuses/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateDocumentStatus(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`documents-statuses/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeDocumentStatus(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`documents-statuses/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createDocumentStatus(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('documents-statuses', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
