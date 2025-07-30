<template>
	<section class="w-full">
		<div class="w-3/4 mx-auto">
			<DataTable
				v-model:filters="filters"
				:value="data"
				paginator
				:rows="10"
				dataKey="id"
				filterDisplay="row"
				:loading="isLoading"
				:globalFilterFields="['project_name', 'has_report']">
				<template #header>
					<div class="flex justify-end">
						<IconField>
							<InputIcon>
								<i class="pi pi-search" />
							</InputIcon>
							<InputText
								v-model="filters['global'].value"
								placeholder="Keyword Search" />
						</IconField>
					</div>
				</template>
				<template #empty>No se encontraron registros</template>
				<template #loading>Cargando datos, por favor espere...</template>
				<Column
					field="name"
					header="Nombre"
					filterField="project_name"
					style="min-width: 12rem">
					<template #body="{ data }">
						{{ data.project_name }}
					</template>
					<template #filter="{ filterModel, filterCallback }">
						<InputText
							v-model="filterModel.value"
							type="text"
							placeholder="Buscar por nombre"
							@input="filterCallback()" />
					</template>
				</Column>
				<Column
					field="has_report"
					filterField="has_report"
					header="Tiene reporte"
					style="min-width: 12rem">
					<template #body="{ data }">
						{{ data.has_report }}
					</template>
					<template #filter="{ filterModel, filterCallback }">
						<InputText
							v-model="filterModel.value"
							type="text"
							placeholder="Buscar por estatus de reporte"
							@input="filterCallback()" />
					</template>
				</Column>
			</DataTable>
		</div>
	</section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { getReportedDualProjects, getUnreportedDualProjects } from '../../../services/dual_projects/dual_projects';

const data = ref([]);
const isLoading = ref(false);

const filters = ref({
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	project_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
	has_report: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

onMounted(() => {
	fetchDualProjects();
});

const fetchDualProjects = async () => {
	isLoading.value = true;
	try {
		const [reportedRes, unreportedRes] = await Promise.all([getReportedDualProjects(), getUnreportedDualProjects()]);

		const reported = reportedRes.data.map((project) => ({
			id: project.id,
			project_name: project.dual_project_reports?.[0]?.name || 'Por definir',
			has_report: true,
		}));

		const unreported = unreportedRes.data.map((project) => ({
			id: project.id,
			project_name: 'Por definir',
			has_report: false,
		}));

		data.value = [...reported, ...unreported];

		console.log(data.value);
	} catch (error) {
		console.error('Error al obtener los proyectos duales:', error);
	} finally {
		isLoading.value = false;
	}
};
</script>
