import axios from 'axios';

export function getsubsystems(){
    return new Promise((resolve, reject) =>{
        axios
            .get('subsystems')
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            })
    })
}


export function showSubsysyems(pk) {
    return new Promise((resolve, reject) => {
        axios
            .get(`subsystems/${pk}`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}


export function updateSubsystems(pk) {
    return new Promise((resolve, reject) => {
        axios
            .put(`subsystems/${pk}`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function removeSubsystems(pk) {
    return new Promise((resolve, reject) => {
        axios
            .delete(`subsystems/${pk}`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function createSubsystems(params) {
    return new Promise((resolve, reject) => {
        axios
            .post('subsystems', params)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}