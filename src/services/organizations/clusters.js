import axios from 'axios';

export function getClusters() {
	return new Promise((resolve, reject) => {
		axios
			.get('clusters')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showCluster(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`clusters/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateCluster(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`clusters/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeCluster(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`clusters/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createCluster(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('clusters', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
