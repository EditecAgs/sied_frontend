import axios from 'axios';

export function getCertifications() {
    return new Promise((resolve, reject) => {
        axios
            .get('certifications')
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export function showCertification(pk) {
    return new Promise((resolve, reject) => {
        axios
            .get(`certifications/${pk}`)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export function createCertification(params) {
    return new Promise((resolve, reject) => {
        axios
            .post('certifications', params)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });     
}

export function updateCertification(pk, params) {
    return new Promise((resolve, reject) => {
        axios
            .put(`certifications/${pk}`, params)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}
export function removeCertification(pk) {
    return new Promise((resolve, reject) => {
        axios
            .delete(`certifications/${pk}`)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}