import axios from 'axios';


export function getDiplomas() {
    return new Promise((resolve, reject) => {
        axios
            .get('diplomas')
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export function showDiplomas(pk) {
    return new Promise((resolve, reject) => {
        axios
            .get(`diplomas/${pk}`)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export function createDiplomas(params) {
    return new Promise((resolve, reject) => {
        axios
            .post('diplomas', params)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}

export function updateDiplomas(pk, params) {
    return new Promise((resolve, reject) => {
        axios
            .put(`diplomas/${pk}`, params)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}
export function removeDiplomas(pk) {
    return new Promise((resolve, reject) => {
        axios
            .delete(`diplomas/${pk}`)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
}