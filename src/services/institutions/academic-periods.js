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