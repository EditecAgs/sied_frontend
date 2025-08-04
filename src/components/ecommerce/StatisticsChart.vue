<template>
	<div class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
		<div class="mb-6">
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Proyectos por Área</h3>
			<p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
				Conteo total de proyectos por área (pag. 1)
			</p>
		</div>

		<div v-if="loading" class="text-center py-10 text-gray-400">
			Cargando datos...
		</div>

		<div v-else class="max-w-full overflow-x-auto custom-scrollbar">
			<VueApexCharts type="bar" height="400" :options="chartOptions" :series="series" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { getProjectsByArea } from '../../services/statistics/dashboard';

const loading = ref(true);
const chartOptions = ref({});
const series = ref([]);

const fetchProjectsByArea = async () => {
	try {
		const response: any = await getProjectsByArea(1);
		const data = response.data?.data || [];

		const areas = data.map(item => item.area_name);
		const counts = data.map(item => item.project_count);

		series.value = [{
			name: 'Proyectos',
			data: counts,
		}];

		chartOptions.value = {
			chart: {
				type: 'bar',
				height: 350,
				toolbar: { show: false },
				fontFamily: 'Outfit, sans-serif',
			},
			plotOptions: {
				bar: {
					horizontal: true,
					borderRadius: 4,
					dataLabels: {
						position: 'right',
					},
				},
			},
			dataLabels: {
				enabled: true,
				offsetX: 10,
				style: {
					fontSize: '12px',
				},
			},
			xaxis: {
				categories: areas,
				title: {
					text: 'Cantidad de Proyectos',
				},
			},
			yaxis: {
				title: {
					text: 'Áreas',
				},
			},
			colors: ['#800000'],
			tooltip: {
				enabled: true,
			},
			grid: {
				yaxis: {
					lines: {
						show: false,
					},
				},
			},
		};
	} catch (error) {
		console.error('Error al cargar proyectos por área:', error);
	} finally {
		loading.value = false;
	}
};

onMounted(fetchProjectsByArea);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 4px;
}
</style>
