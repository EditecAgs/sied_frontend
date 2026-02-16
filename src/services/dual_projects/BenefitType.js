import axios from 'axios';

export function getBenefitType() {
    return new Promise((resolve, reject) => {
        axios
            .get('benefit-types')
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export function showBenefitType(pk) {
    return new Promise((resolve, reject) => {
        axios
            .get(`benefit-types/${pk}`)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export function createBenefitType(params) {
    return new Promise((resolve, reject) => {
        axios
            .post('benefit-types', params)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });     
}

export function updateBenefitType(pk, params) {
    return new Promise((resolve, reject) => {
        axios
            .put(`benefit-types/${pk}`, params)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}
export function removeBenefitType(pk) {
    return new Promise((resolve, reject) => {
        axios
            .delete(`benefit-types/${pk}`)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}