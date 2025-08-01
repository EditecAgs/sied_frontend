import axios from 'axios';

export function getCompletedDualProjects() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects/completed/count')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
export function getTotalStudents() {
	return new Promise((resolve, reject) => {
		axios
			.get('students/registered/count')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getProjectsBySector() {
	return new Promise((resolve, reject) => {
		axios
			.get('projects/sectors')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getProjectsByIntitution() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects/percetange/institutions')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
