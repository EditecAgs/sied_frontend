import axios from 'axios';

export function getStudents() {
	return new Promise((resolve, reject) => {
		axios
			.get('students')
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

export function showStudent(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`students/${pk}`)
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

export function createStudent(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('students', params)
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

export function updateStudent(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`students/${pk}`, params)
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

export function removeStudent(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`students/${pk}`)
			.then((response) => resolve(response))
			.catch((error) => reject(error));
	});
}

