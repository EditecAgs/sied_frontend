import axios from 'axios';

// Obtener proyectos duales que NO tienen reporte
export function getUnreportedDualProjects() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects/unreported')
			.then(resolve)
			.catch(reject);
	});
}

// Obtener proyectos duales que SÍ tienen reporte
export function getReportedDualProjects() {
	return new Promise((resolve, reject) => {
		axios
			.get('dual-projects/reported')
			.then(resolve)
			.catch(reject);
	});
}

// Crear proyecto dual SIN reporte
export function createDualProjectUnreport(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('dual-projects', {
				...params,
				has_report: 0 // asegúrate de mandar este campo para diferenciarlo
			})
			.then(resolve)
			.catch(reject);
	});
}

// Crear proyecto dual CON reporte
export function createDualProjectReported(params) {
	return new Promise((resolve, reject) => {
		axios
			.post('dual-projects', {
				...params,
				has_report: 1 // asegúrate de mandar este campo para diferenciarlo
			})
			.then(resolve)
			.catch(reject);
	});
}

// Mostrar un proyecto dual por ID
export function showDualProject(pk) {
	return new Promise((resolve, reject) => {
		axios
			.get(`dual-projects/${pk}`)
			.then(resolve)
			.catch(reject);
	});
}

// Actualizar un proyecto dual
export function updateDualProject(pk, params) {
	return new Promise((resolve, reject) => {
		axios
			.put(`dual-projects/${pk}`, params)
			.then(resolve)
			.catch(reject);
	});
}

// Eliminar un proyecto dual
export function removeDualProject(pk) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`dual-projects/${pk}`)
			.then(resolve)
			.catch(reject);
	});
}
