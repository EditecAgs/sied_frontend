import axios from 'axios';

/**
 * @param {number} page 
 * @param {number} perPage 
 * @param {object} filters 
 */
export function getLogs(page = 1, perPage = 100, filters = {}) {
  return new Promise((resolve, reject) => {
    const params = { page, per_page: perPage, ...filters };

    axios
      .get('logs', { params })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

/**
 * @param {number|string} pk - ID del log
 */
export function getLogById(pk) {
  return new Promise((resolve, reject) => {
    axios
      .get(`logs/${pk}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
