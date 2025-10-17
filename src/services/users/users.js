import axios from 'axios';

export function getUsers() {
	return new Promise((resolve, reject) => {
		axios
			.get('users')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	})
}


export function showUsers(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`users/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}


export function updateUsers(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`users/${pk}`, params, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}


export function removeUsers(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`users/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createUsers(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('users', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}