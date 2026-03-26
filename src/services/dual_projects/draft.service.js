import axios from 'axios';

export function saveDraft(projectId, data) {
	return new Promise((resolve, reject) => {
		const params = {
			project_id: projectId,
			form_data: JSON.stringify(data.formData),
			reporta_modelo_dual: data.reportaModeloDual,
			section1_expanded: data.section1Expanded,
			section2_expanded: data.section2Expanded,
			section3_expanded: data.section3Expanded
		};

		axios
			.post('drafts/save', params)
			.then(resolve)
			.catch(reject);
	});
}

export function loadDraft(projectId = null) {
	return new Promise((resolve, reject) => {
		const params = {};
		if (projectId) {
			params.project_id = projectId;
		}

		axios
			.get('drafts/load', { params })
			.then(resolve)
			.catch(reject);
	});
}

export function clearDraft(projectId = null) {
	return new Promise((resolve, reject) => {
		const params = {};
		if (projectId) {
			params.project_id = projectId;
		}

		axios
			.delete('drafts/clear', { params })
			.then(resolve)
			.catch(reject);
	});
}

export function checkDraft(projectId = null) {
	return new Promise((resolve, reject) => {
		const params = {};
		if (projectId) {
			params.project_id = projectId;
		}

		axios
			.get('drafts/check', { params })
			.then(resolve)
			.catch(reject);
	});
}