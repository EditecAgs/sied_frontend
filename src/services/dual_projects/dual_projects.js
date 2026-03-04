import axios from 'axios';

export function getAllDualProjects(params = {}) {
    return new Promise((resolve, reject) => {
        axios
            .get('dual-projects/all', { params })
            .then(resolve)
            .catch(reject);
    });
}
export function allProjects(){
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects')
			.then(resolve)
			.catch(reject);
	});
}

export function getUnreportedDualProjects() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects/unreported')
			.then(resolve)
			.catch(reject);
	});
}


export function getReportedDualProjects() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects/reported')
			.then(resolve)
			.catch(reject);
	});
}

export function createDualProject(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('dual-projects', params)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}


export function showDualProject(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`dual-projects/${pk}`)
			.then(resolve)
			.catch(reject);
	});
}


export function updateDualProject(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`dual-projects/${pk}`, params)
			.then(resolve)
			.catch(reject);
	});
}


export function removeDualProject(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`dual-projects/${pk}`)
			.then(resolve)
			.catch(reject);
	});
}

export function exportDualProjectsToExcel(filters = {}) {
	return new Promise((resolve, reject) => {
		const params = {};

		if (Object.keys(filters).length > 0) {
			Object.keys(filters).forEach(key => {
				if (filters[key] && filters[key].trim() !== '') {
					params[`filters[${key}]`] = filters[key];
				}
			});
		}

		console.log('Enviando filtros:', params);

		axios({
			method: 'get',
			url: 'dual-projects/export',
			params: params,
			responseType: 'blob',
			headers: {
				'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			}
		})
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;

				const contentDisposition = response.headers['content-disposition'];
				let filename = `proyectos_duales_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.xlsx`;

				if (contentDisposition) {
					const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
					if (filenameMatch && filenameMatch[1]) {
						filename = filenameMatch[1].replace(/['"]/g, '');
					}
				}

				link.download = filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);

				resolve({
					success: true,
					message: 'Excel descargado exitosamente',
					filename: filename
				});
			})
			.catch((error) => {
				console.error('Error en exportación:', error);
				console.error('Response:', error.response);

				if (error.response && error.response.data instanceof Blob) {
					const reader = new FileReader();
					reader.onload = () => {
						try {
							const errorData = JSON.parse(reader.result);
							reject(errorData);
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
						} catch (e) {
							reject({
								message: 'Error al descargar el archivo Excel',
								error: error.message
							});
						}
					};
					reader.readAsText(error.response.data);
				} else {
					reject(error.response?.data || { message: 'Error al exportar' });
				}
			});
	});
}
