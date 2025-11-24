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

export function getRegisteredOrganizationsCount() {
	return new Promise((resolve, reject) => {
		axios
			.get('organizations/registered/count')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}


export function getProjectsBySector(page = 1) {
	return new Promise((resolve, reject) => {
		axios
			.get(`projects/sectors?page=${page}`)
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

export function getProjectsCountByMonth() {
	return new Promise((resolve, reject) => {
		axios
			.get('projects/by-month')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getProjectsByArea(page = 1) {
	return new Promise((resolve, reject) => {
		axios
			.get(`projects/dual-area?page=${page}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getProjectsBySectorMexico(page = 1) {
	return new Promise((resolve, reject) => {
		axios
			.get(`projects/sectors/mexico?page=${page}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getOrganizationsByScope() {
	return new Promise((resolve, reject) => {
		axios
			.get('organizations/scope/count')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getProjectsByEconomicSupport() {
	return new Promise((resolve, reject) => {
		axios
			.get('projects/economic-support')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getAverageAmountByEconomicSupport() {
	return new Promise((resolve, reject) => {
		axios
			.get('projects/economic-support/average')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getProjectsByDualType() {
	return new Promise((resolve, reject) => {
		axios
			.get('projects/dual-type')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getOrganizationsByCluster() {
	return new Promise((resolve, reject) => {
		axios
			.get('organizations/cluster/count')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function getProjectsByCluster() {
	return new Promise((resolve, reject) => {
		axios
			.get('projects/cluster/count')
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}


