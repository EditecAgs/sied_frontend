<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Gestión de Actividades Duales</h2>
				<button
					class="flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
					@click="clearFilters">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Limpiar
				</button>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full">
				<thead>
					<tr class="bg-brand-800/80 text-white">
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Nombre</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Estatus</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Institución</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Área</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Organización</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Estado Convenio</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Opciones</th>
					</tr>
					<tr class="bg-brand-800/60 text-white">
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input
								v-model="filters.project_name"
								class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input
								v-model="filters.has_report"
								class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input
								v-model="filters.institution_name"
								class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input
								v-model="filters.area"
								class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input
								v-model="filters.organization_name"
								class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input
								v-model="filters.status_document"
								class="w-full bg-white/10 border-none text-white placeholder-white/60 rounded px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50" />
					</tr>
				</thead>

				<tbody>
					<tr v-if="isLoading">
						<td colspan="7" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando Proyectos Duales...</p>
						</td>
					</tr>

					<tr
						v-for="(project, index) in paginatedProjects" :key="project.id ?? index"
						class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.project_name }}</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">
							<span :class="project.has_report ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'">
								{{ project.has_report ? 'Completado' : 'Incompleto' }}
							</span>
						</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.institution_name }}</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.area }}</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.organization_name }}</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ project.status_document }}</td>
						<td class="px-5 py-3 text-sm">
							<div class="flex space-x-2">
								<template v-if="project.has_report">
									<btnEdit :table="'dual_projects'" :pk="project.id" @open="() => $emit('open', { mode: 'edit', pk: project.id, table: 'modelo dual' })" />
								</template>
								<template v-else>
									<button
										class="text-xs font-medium text-brand-800 hover:text-brand-900 underline underline-offset-2"
										@click="$emit('open', { mode: 'complete', pk: project.id, table: 'modelo dual' })">
										Completar
									</button>
								</template>
								<btnDelete
									:table="'dual_projects'"
									:pk="project.id ?? index"
									@open-confirm="(payload) => $emit('open-confirm', payload)" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && filteredProjects.length === 0">
						<td colspan="7" class="px-5 py-8 text-center">
							<p class="text-gray-500">No se encontraron proyectos duales registrados</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">
				Mostrando {{ paginatedProjects.length }} de {{ filteredProjects.length }} registros
			</span>
			<div class="flex items-center space-x-2">
				<select
					v-model="rowsPerPage"
					class="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700">
					<option value="10">10 por página</option>
					<option value="25">25 por página</option>
					<option value="50">50 por página</option>
				</select>
				<button
					:disabled="currentPage === 1" class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30"
					@click="currentPage--">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button
					:disabled="currentPage === totalPages" class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30"
					@click="currentPage++">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import btnEdit from '../../../components/buttons/btnEdit.vue';
import btnDelete from '../../../components/buttons/btnDelete.vue';
import { getReportedDualProjects, getUnreportedDualProjects } from '../../../services/dual_projects/dual_projects';

const dualProjects = ref([]);
const isLoading = ref(false);

const filters = ref({
	project_name: '',
	has_report: '',
	institution_name: '',
	area: '',
	organization_name: '',
	status_document: ''
});

// 📌 Traemos institution y user_type desde localStorage
const institutionId = JSON.parse(localStorage.getItem("institution"))?.id;
const userType = parseInt(localStorage.getItem("user_type"), 10);

const clearFilters = () => {
	filters.value = {
		project_name: '',
		has_report: '',
		institution_name: '',
		area: '',
		organization_name: '',
		status_document: ''
	};
};

const rowsPerPage = ref(10);
const currentPage = ref(1);

const filteredProjects = computed(() => {
	const projectName = filters.value.project_name.toLowerCase();
	const hasReport = filters.value.has_report.toLowerCase();
	const institution = filters.value.institution_name.toLowerCase();
	const area = filters.value.area.toLowerCase();
	const organization = filters.value.organization_name.toLowerCase();
	const status = filters.value.status_document.toLowerCase();

	return dualProjects.value.filter(project => {
		const statusText = project.has_report ? 'completado' : 'incompleto';

		const institutionMatch = userType === 0 ? true : project.institution_id === institutionId;

		return (
			institutionMatch &&
			project.project_name.toLowerCase().includes(projectName) &&
			statusText.includes(hasReport) &&
			project.institution_name.toLowerCase().includes(institution) &&
			project.area.toLowerCase().includes(area) &&
			project.organization_name.toLowerCase().includes(organization) &&
			project.status_document.toLowerCase().includes(status)
		);
	});
});

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / rowsPerPage.value));
const paginatedProjects = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredProjects.value.slice(start, start + rowsPerPage.value);
});

const fetchDualProjects = async () => {
	isLoading.value = true;
	try {
		const [reportedRes, unreportedRes] = await Promise.all([
			getReportedDualProjects(),
			getUnreportedDualProjects()
		]);

		const reported = reportedRes.data.map(project => ({
			id: project.id,
			project_name: project.dual_project_reports.name || 'Por definir',
			has_report: true,
			institution_id: project.institution.id,
			institution_name: project.institution.name || 'Por definir',
			area: project.dual_project_reports.dual_area?.name || 'Por definir',
			organization_name: project.organization_dual_projects.organization?.name || 'Por definir',
			status_document: project.dual_project_reports.status_document?.name || 'Por definir'
		}));

		const unreported = unreportedRes.data.map(project => ({
			id: project.id,
			project_name: 'Por definir',
			has_report: false,
			institution_id: project.institution?.id,
			institution_name: project.institution?.name || 'Por definir',
			area: 'Por definir',
			organization_name: project.organization_dual_projects?.[0]?.organization?.name || 'Por definir',
			status_document: 'Por definir'
		}));

		dualProjects.value = [...reported, ...unreported];
	} catch (error) {
		console.error('Error al obtener los proyectos duales:', error);
	} finally {
		isLoading.value = false;
	}
};

onMounted(fetchDualProjects);
defineExpose({ fetchData: fetchDualProjects });
</script>


<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #82181a;
	border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #460809;
}
</style>