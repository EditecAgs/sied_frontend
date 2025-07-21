<template>
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="border-b border-gray-200 bg-brand-50">
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Nombre del Proyecto
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Institución
							</p>
						</th>
						<th class="px-5 py-3 text-left w-1/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Tipo
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Fechas
							</p>
						</th>
						<th class="px-5 py-3 text-left w-1/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Estado
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Área
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Opciones
							</p>
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

					<tr
						v-for="(project, index) in dualProjects"
						v-else
						:key="project.id ?? index"
						class="border-t border-gray-100 hover:bg-brand-50/50 transition-colors">
						<td class="px-5 py-4 sm:px-6">
							<span class="block font-medium text-brand-900 text-theme-sm">
								{{ project.project_name }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-700 text-theme-sm">
								{{ project.institution?.name || 'N/A' }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<span
								class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
								:class="getTypeClass(project.project_type)">
								{{ getTypeName(project.project_type) }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-700 text-theme-sm">
								{{ formatDate(project.start_date) }} - {{ formatDate(project.end_date) }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<span
								class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
								:class="getStatusClass(project.status)">
								{{ getStatusName(project.status) }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-500 text-theme-sm">
								{{ project.area || 'N/A' }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<div class="flex space-x-2">
								<btnEdit
									:table="'dual_projects'"
									:pk="project.id ?? index"
									class="text-brand-800 hover:text-brand-900"
									@open="(data) => $emit('open', data)" />
								<btnDelete
									:table="'dual_projects'"
									:pk="project.id ?? index"
									class="text-brand-800 hover:text-brand-900"
									@deleted="onProjectDeleted" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && dualProjects.length === 0">
						<td colspan="7" class="px-5 py-8 text-center sm:px-6">
							<p class="text-gray-500">No se encontraron proyectos duales registrados</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import btnEdit from "../../../components/buttons/btnEdit.vue";
import btnDelete from "../../../components/buttons/btnDelete.vue";
import axios from "axios";
import { useAxios } from "../../../axios";

useAxios();

const dualProjects = ref([]);
const isLoading = ref(false);

// Mapeo de tipos de proyecto
const projectTypes = {
	1: { name: 'Educativo', class: 'bg-blue-100 text-blue-800' },
	2: { name: 'Empresarial', class: 'bg-purple-100 text-purple-800' },
	3: { name: 'Gubernamental', class: 'bg-green-100 text-green-800' }
};

// Mapeo de estados
const projectStatuses = {
	1: { name: 'Activo', class: 'bg-green-100 text-green-800' },
	2: { name: 'Concluido', class: 'bg-blue-100 text-blue-800' },
	3: { name: 'Cancelado', class: 'bg-red-100 text-red-800' }
};

const fetchDualProjects = async () => {
	isLoading.value = true;
	try {
		const res = await axios.get("dual-projects?include=institution");
		dualProjects.value = res.data;
	} catch (err) {
		console.error("Error al obtener los proyectos duales:", err);
	} finally {
		isLoading.value = false;
	}
};

const formatDate = (dateString) => {
	if (!dateString) return 'N/A';
	const options = { year: 'numeric', month: 'short', day: 'numeric' };
	return new Date(dateString).toLocaleDateString('es-MX', options);
};

const getTypeName = (type) => {
	return projectTypes[type]?.name || 'Desconocido';
};

const getTypeClass = (type) => {
	return projectTypes[type]?.class || 'bg-gray-100 text-gray-800';
};

const getStatusName = (status) => {
	return projectStatuses[status]?.name || 'Desconocido';
};

const getStatusClass = (status) => {
	return projectStatuses[status]?.class || 'bg-gray-100 text-gray-800';
};

const onProjectDeleted = (deletedId) => {
	dualProjects.value = dualProjects.value.filter((project) => project.id !== deletedId);
};

onMounted(() => {
	fetchDualProjects();
});

defineExpose({
	fetchData: fetchDualProjects,
});
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
	background: #82181a; /* brand-800 */
	border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #460809; /* brand-900 */
}
</style>