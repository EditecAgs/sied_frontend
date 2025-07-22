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