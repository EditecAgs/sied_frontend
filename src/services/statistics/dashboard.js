import axios from 'axios';

export function getCompletedDualProjects(filtersAdd = null) {
  let url = 'dual-projects/completed/count';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getTotalStudents(filtersAdd = null) {
  let url = 'students/registered/count';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getRegisteredOrganizationsCount(filtersAdd = null) {
  let url = 'organizations/registered/count';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getProjectsBySector(page = 1, filtersAdd = null) {
  let url = `projects/sectors?page=${page}`;
  if (filtersAdd !== null) {
    url += `&filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getProjectsByIntitution(filtersAdd = null) {
  let url = 'dual-projects/percetange/institutions';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getProjectsCountByMonth(filtersAdd = null) {
  let url = 'projects/by-month';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getProjectsByArea(page = 1, filtersAdd = null) {
  let url = `projects/dual-area?page=${page}`;
  if (filtersAdd !== null) {
    url += `&filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getProjectsBySectorMexico(page = 1, filtersAdd = null) {
  let url = `projects/sectors/mexico?page=${page}`;
  if (filtersAdd !== null) {
    url += `&filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getOrganizationsByScope(filtersAdd = null) {
  let url = 'organizations/scope/count';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getProjectsByEconomicSupport(filtersAdd = null) {
  let url = 'projects/economic-support';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getAverageAmountByEconomicSupport(filtersAdd = null) {
  let url = 'projects/economic-support/average';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getProjectsByDualType(filtersAdd = null) {
  let url = 'projects/dual-type';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getOrganizationsByCluster(filtersAdd = null) {
  let url = 'organizations/cluster/count';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}

export function getProjectsByCluster(filtersAdd = null) {
  let url = 'projects/cluster/count';
  if (filtersAdd !== null) {
    url += `?filtersAdd=${filtersAdd}`;
  }
  return axios.get(url);
}
