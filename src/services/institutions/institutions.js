import axios from 'axios';

export function getInstitutions() {
    return new Promise((resolve, reject) => {
        axios
            .get('institutions')
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    })
}

export function showInstitutions(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`institutions/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}



export function updateInstitutions(pk) {
	return new Promise((resolve, reject) => {
		axios
			.put(`institutions/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeInstitutions(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`institutions/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createInstitutions(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('institutions', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}