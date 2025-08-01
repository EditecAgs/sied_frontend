<template>
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<div class="flex justify-end p-4">
				<button
					@click="clearFilters"
					class="text-sm bg-brand-100 hover:bg-brand-200 text-brand-900 font-semibold py-1 px-3 rounded-lg shadow">
					Limpiar Filtros
				</button>
			</div>

			<table class="min-w-full">
				<thead>
					<tr class="border-b border-gray-200 bg-brand-50">
						<th class="px-5 py-3 text-left sm:px-6">
							<input
								v-model="filters.project_name"
								type="text"
								placeholder="Nombre del Proyecto"
								class="w-full bg-transparent border-none outline-none text-brand-900 text-theme-xs placeholder:text-gray-400" />
						</th>
						<th class="px-5 py-3 text-left sm:px-6">
							<input
								v-model="filters.has_report"
								type="text"
								placeholder="Estatus"
								class="w-full bg-transparent border-none outline-none text-brand-900 text-theme-xs placeholder:text-gray-400" />
						</th>
						<th class="px-5 py-3 text-left sm:px-6">
							<input
								v-model="filters.institution_name"
								type="text"
								placeholder="Institución"
								class="w-full bg-transparent border-none outline-none text-brand-900 text-theme-xs placeholder:text-gray-400" />
						</th>
						<th class="px-5 py-3 text-left sm:px-6">
							<input
								v-model="filters.area"
								type="text"
								placeholder="Área"
								class="w-full bg-transparent border-none outline-none text-brand-900 text-theme-xs placeholder:text-gray-400" />
						</th>
						<th class="px-5 py-3 text-left sm:px-6">
							<input
								v-model="filters.organization_name"
								type="text"
								placeholder="Organización"
								class="w-full bg-transparent border-none outline-none text-brand-900 text-theme-xs placeholder:text-gray-400" />
						</th>
						<th class="px-5 py-3 text-left sm:px-6">
							<input
								v-model="filters.status_document"
								type="text"
								placeholder="Estado Convenio"
								class="w-full bg-transparent border-none outline-none text-brand-900 text-theme-xs placeholder:text-gray-400" />
						</th>
						<th class="px-5 py-3 text-left sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">Opciones</p>
						</th>
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-200">
					<tr v-if="isLoading">
						<td colspan="7" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando Proyectos Duales...</p>
						</td>
					</tr>

					<tr v-for="(project, index) in paginatedProjects" :key="project.id ?? index" class="border-t border-gray-100 hover:bg-brand-50/50 transition-colors">
						<td class="px-5 py-4 sm:px-6">{{ project.project_name }}</td>
						<td class="px-5 py-4 sm:px-6">
							<span :class="project.has_report ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'">
								{{ project.has_report ? 'Completado' : 'Incompleto' }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">{{ project.institution_name }}</td>
						<td class="px-5 py-4 sm:px-6">{{ project.area }}</td>
						<td class="px-5 py-4 sm:px-6">{{ project.organization_name }}</td>
						<td class="px-5 py-4 sm:px-6">{{ project.status_document }}</td>
						<td class="px-5 py-4 sm:px-6">
							<div class="flex space-x-2">
								<template v-if="project.has_report">
									<btnEdit :table="'dual_projects'" :pk="project.id" @open="() => $emit('open', { mode: 'edit', pk: project.id, table: 'modelo dual' })" />
								</template>
								<template v-else>
									<button class="text-theme-xs font-medium text-brand-800 hover:text-brand-900 underline underline-offset-2" @click="$emit('open', { mode: 'edit', pk: project.id, table: 'modelo dual' })">
										Completar
									</button>
								</template>
								<btnDelete :table="'dual_projects'" :pk="project.id ?? index" class="text-brand-800 hover:text-brand-900" @deleted="onProjectDeleted" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && filteredProjects.length === 0">
						<td colspan="7" class="px-5 py-8 text-center sm:px-6">
							<p class="text-gray-500">No se encontraron proyectos duales registrados</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="filteredProjects.length > rowsPerPage" class="flex justify-end px-4 py-3 border-t border-gray-200">
			<button class="px-3 py-1 text-sm border rounded-l-md" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
			<span class="px-4 py-1 text-sm">{{ currentPage }} / {{ totalPages }}</span>
			<button class="px-3 py-1 text-sm border rounded-r-md" :disabled="currentPage === totalPages" @click="currentPage++">Siguiente</button>
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


const rowsPerPage = 10;
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
		return (
			project.project_name.toLowerCase().includes(projectName) &&
			statusText.includes(hasReport) &&
			project.institution_name.toLowerCase().includes(institution) &&
			project.area.toLowerCase().includes(area) &&
			project.organization_name.toLowerCase().includes(organization) &&
			project.status_document.toLowerCase().includes(status)
		);
	});
});

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / rowsPerPage));
const paginatedProjects = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage;
	return filteredProjects.value.slice(start, start + rowsPerPage);
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
			institution_name: project.institution.name || 'Por definir',
			area: project.dual_project_reports.dual_area?.name || 'Por definir',
			organization_name: project.organization_dual_projects.organization?.name || 'Por definir',
			status_document: project.dual_project_reports.status_document?.name || 'Por definir'
		}));

		const unreported = unreportedRes.data.map(project => ({
			id: project.id,
			project_name: 'Por definir',
			has_report: false,
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

const onProjectDeleted = deletedId => {
	dualProjects.value = dualProjects.value.filter(project => project.id !== deletedId);
};

onMounted(fetchDualProjects);
defineExpose({ fetchData: fetchDualProjects });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #82181a; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #460809; }
</style>
