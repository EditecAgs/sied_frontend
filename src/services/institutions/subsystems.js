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