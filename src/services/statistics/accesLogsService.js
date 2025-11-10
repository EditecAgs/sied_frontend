import axios from 'axios';

/**
 * Obtener los registros de la bitácora de accesos.
 * 
 * @param {number} page 
 * @param {number} perPage 
 * @param {object} filters 
 */
export function getBitacoraAccesos(page = 1, perPage = 100, filters = {}) {
  return new Promise((resolve, reject) => {
    const params = { page, per_page: perPage, ...filters };

    axios
      .get('bitacora-accesos', { params })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

/**
 * Obtener un registro específico por ID.
 * 
 * @param {number|string} id - ID del registro
 */
export function getBitacoraAccesoById(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`bitacora-accesos/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

/**
 * Eliminar un registro de la bitácora.
 * 
 * @param {number|string} id - ID del registro
 */
export function deleteBitacoraAcceso(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`bitacora-accesos/${id}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
