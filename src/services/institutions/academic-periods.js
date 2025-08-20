import axios from 'axios';

export function getAcademicPeriods() {
    return new Promise((resolve, reject) => {
        axios
            .get('academic-periods')
            .then((response) => {
                resolve(response);
            })
            .catch((error) => { reject(error);})
    })
}



export function showAcademicPeriods(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`academic-periods/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}


export function updateAcademicPeriods(pk) {
	return new Promise((resolve, reject) => {
		axios
			.put(`academic-periods/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function removeAcademicPeriods(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`academic-periods/${pk}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export function createAcademicPeriods(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('academic-periods', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
