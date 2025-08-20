import axios from 'axios';


export function getUnreportedDualProjects() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects/unreported')
			.then(resolve)
			.catch(reject);
	});
}


export function getReportedDualProjects() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects/reported')
			.then(resolve)
			.catch(reject);
	});
}

export function createDualProject(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('dual-projects', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}


export function showDualProject(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`dual-projects/${pk}`)
			.then(resolve)
			.catch(reject);
	});
}


export function updateDualProject(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`dual-projects/${pk}`, params)
			.then(resolve)
			.catch(reject);
	});
}


export function removeDualProject(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`dual-projects/${pk}`)
			.then(resolve)
			.catch(reject);
	});
}
