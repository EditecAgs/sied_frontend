<template>
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="border-b border-gray-200 bg-brand-50">
						<th class="px-5 py-3 text-left w-5/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">Nombre del Proyecto</p>
						</th>
						<th class="px-5 py-3 text-left w-3/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">¿Tiene Reporte?</p>
						</th>
						<th class="px-5 py-3 text-left w-4/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">Opciones</p>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					<tr v-if="isLoading">
						<td colspan="3" class="py-12 text-center">
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
							<p class="text-theme-sm text-gray-700">
								{{ project.has_report ? 'Sí' : 'No' }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<div class="flex space-x-2">
								<btnEdit
									:table="'dual_projects'"
									:pk="project.id"
									@open="() => $emit('open', { mode: 'edit', pk: project.id, table: 'modelo dual' })" />
								<btnDelete
									:table="'dual_projects'"
									:pk="project.id ?? index"
									class="text-brand-800 hover:text-brand-900"
									@deleted="onProjectDeleted" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && dualProjects.length === 0">
						<td colspan="3" class="px-5 py-8 text-center sm:px-6">
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
import { getReportedDualProjects, getUnreportedDualProjects } from "../../../services/dual_projects/dual_projects";

const dualProjects = ref([]);
const isLoading = ref(false);

const fetchDualProjects = async () => {
	isLoading.value = true;
	try {
		const [reportedRes, unreportedRes] = await Promise.all([
			getReportedDualProjects(),
			getUnreportedDualProjects()
		]);

		const reported = reportedRes.data.map(project => ({
			id: project.id,
			project_name: project.dual_project_reports?.[0]?.name || 'Por definir',
			has_report: true,
		}));

		const unreported = unreportedRes.data.map(project => ({
			id: project.id,
			project_name: 'Por definir',
			has_report: false,
		}));

		dualProjects.value = [...reported, ...unreported];
	} catch (error) {
		console.error("Error al obtener los proyectos duales:", error);
	} finally {
		isLoading.value = false;
	}
};

const onProjectDeleted = (deletedId) => {
	dualProjects.value = dualProjects.value.filter(project => project.id !== deletedId);
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
	background: #82181a;
	border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #460809;
}
</style>
