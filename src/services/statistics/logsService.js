import axios from 'axios';

/**
 * Obtener todos los logs
 */
export function getLogs() {
  return new Promise((resolve, reject) => {
    axios
      .get('logs')
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

/**
 * Obtener un log específico por ID
 * @param pk 
 */
export function getLogById(pk) {
  return new Promise((resolve, reject) => {
    axios
      .get(`logs/${pk}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
