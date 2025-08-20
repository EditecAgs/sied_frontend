import axios from 'axios';

export function getEconomicSupports() {
	return new Promise((resolve, reject) => {
		axios
			.get('economic-supports')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showEconomicSupport(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`economic-supports/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateEconomicSupport(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`economic-supports/${pk}`, params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeEconomicSupport(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`economic-supports/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createEconomicSupport(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('economic-supports', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
