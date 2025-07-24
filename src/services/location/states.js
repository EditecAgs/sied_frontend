import axios from 'axios';

export function getStates() {
	return new Promise((resolve, reject) => {
		axios
			.get('states')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function showState(state_id) {
	return new Promise((resolve, reject) => {
		axios
			.get(`states/${state_id}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function updateState(state_id) {
	return new Promise((resolve, reject) => {
		axios
			.put(`states/${state_id}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeState(state_id) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`states/${state_id}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createState(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('states', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}