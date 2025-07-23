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



export function getAcademicPeriodById(pk) {
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
