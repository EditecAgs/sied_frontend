import axios from 'axios';

const buildQueryString = (params) => {
	const queryParams = new URLSearchParams();

	if (params.id_state && params.id_state !== '' && params.id_state !== 'null') {
		queryParams.append('id_state', params.id_state);
	}

	if (params.id_institution && params.id_institution !== '' && params.id_institution !== 'null') {
		queryParams.append('id_institution', params.id_institution);
	}

	const queryString = queryParams.toString();
	return queryString ? `?${queryString}` : '';
};

export function getCompletedDualProjects(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`dual-projects/completed/count${queryString}`);
}

export function getTotalStudents(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`students/registered/count${queryString}`);
}

export function getRegisteredOrganizationsCount(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`organizations/registered/count${queryString}`);
}

export function getProjectsBySector(params = {}) {
	const { id_state, id_institution } = params;

	const queryParams = new URLSearchParams();
	if (id_state != null && id_state !== 'null') queryParams.append('id_state', id_state);
	if (id_institution != null && id_institution !== 'null') queryParams.append('id_institution', id_institution);

	const queryString = queryParams.toString();
	const url = `projects/sectors${queryString ? `?${queryString}` : ''}`;

	return axios.get(url);
}

export function getProjectsByIntitution(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`dual-projects/percetange/institutions${queryString}`);
}

export function getProjectsCountByMonth(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`projects/by-month${queryString}`);
}

export function getProjectsByArea(params = {}) {
	const { id_state, id_institution } = params;

	const queryParams = new URLSearchParams();
	if (id_state != null && id_state !== 'null') queryParams.append('id_state', id_state);
	if (id_institution != null && id_institution !== 'null') queryParams.append('id_institution', id_institution);

	const queryString = queryParams.toString();
	const url = `projects/dual-area${queryString ? `?${queryString}` : ''}`;

	return axios.get(url);
}

export function getProjectsBySectorMexico(params = {}) {
	const { id_state, id_institution } = params;

	const queryParams = new URLSearchParams();
	if (id_state != null && id_state !== 'null') queryParams.append('id_state', id_state);
	if (id_institution != null && id_institution !== 'null') queryParams.append('id_institution', id_institution);

	const queryString = queryParams.toString();
	const url = `projects/sectors/mexico${queryString ? `?${queryString}` : ''}`;

	return axios.get(url);
}

export function getOrganizationsByScope(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`organizations/scope/count${queryString}`);
}

export function getProjectsByEconomicSupport(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`projects/economic-support${queryString}`);
}

export function getAverageAmountByEconomicSupport(params = {}) {
	const { id_state, id_institution } = params;

	const queryParams = new URLSearchParams();

	if (id_state != null && id_state !== '' && id_state !== 'null') {
		queryParams.append('id_state', id_state);
	}
	if (id_institution != null && id_institution !== '' && id_institution !== 'null') {
		queryParams.append('id_institution', id_institution);
	}
	const queryString = queryParams.toString();
	const url = `projects/economic-support/average${queryString ? `?${queryString}` : ''}`;

	return axios.get(url);
}

export function getProjectsByDualType(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`projects/dual-type${queryString}`);
}

export function getOrganizationsByCluster(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`organizations/cluster/count${queryString}`);
}

export function getProjectsByCluster(params = {}) {
	const { id_state, id_institution } = params;
	const queryString = buildQueryString({ id_state, id_institution });
	return axios.get(`projects/cluster/count${queryString}`);
}