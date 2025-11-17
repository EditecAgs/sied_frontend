<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 px-6 pt-6 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:px-8 sm:pt-8">
		<div class="flex items-center justify-between mb-5">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">
				Proyectos por Clasificación General de la Actividad Dual
			</h3>

			<div class="relative h-fit">
				<DropdownMenu :menu-items="menuItems">
					<template #icon>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-200">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
								fill="currentColor" />
						</svg>
					</template>
				</DropdownMenu>
			</div>
		</div>

		<div v-if="loading" class="text-center py-10 text-gray-400">
			Cargando datos...
		</div>

		<div v-else class="max-w-full overflow-x-auto custom-scrollbar">
			<div id="chartArea" class="-ml-4 min-w-[650px] xl:min-w-full pl-2">
				<VueApexCharts type="bar" height="350" :options="chartOptions" :series="series" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import DropdownMenu from '../common/DropdownMenu.vue'
import { getProjectsByArea } from '../../services/statistics/dashboard'

const loading = ref(true)
const series = ref<any[]>([])
const chartOptions = ref<any>({})

const menuItems = [
	{ label: 'Exportar', onClick: () => console.log('Exportar clicado') },
	{ label: 'Actualizar', onClick: () => fetchProjectsByArea() },
]

const fetchProjectsByArea = async () => {
	try {
		const response: any = await getProjectsByArea(1)
		const data = response.data?.data || []

		const areas = data.map(item => item.area_name)
		const counts = data.map(item => item.project_count)

		series.value = [{
			name: 'Proyectos',
			data: counts,
		}]

		chartOptions.value = {
			colors: ['#82181a'],
			chart: {
				type: 'bar',
				fontFamily: 'Outfit, sans-serif',
				toolbar: { show: false },
				background: 'transparent',
				foreColor: '#374151',
			},
			plotOptions: {
				bar: {
					horizontal: true,
					barHeight: '60%',
					borderRadius: 6,
					borderRadiusApplication: 'end',
				},
			},
			dataLabels: {
				enabled: true,
				style: {
					fontSize: '12px',
					fontWeight: 500,
				},
				formatter: (val: number) => val.toString(),
			},
			xaxis: {
				categories: areas,
				labels: {
					style: {
						colors: '#374151',
						fontSize: '12px',
						fontWeight: 500,
					},
				},
				axisBorder: { show: false },
				axisTicks: { show: false },
			},
			yaxis: {
				labels: {
					style: {
						colors: '#374151',
						fontSize: '12px',
						fontWeight: 500,
					},
				},
			},
			grid: {
				borderColor: '#9f813c',
				strokeDashArray: 4,
				yaxis: { lines: { show: false } },
				xaxis: { lines: { show: true } },
			},
			tooltip: {
				y: { formatter: val => `${val} proyectos` },
			},
		}
	} catch (error) {
		console.error('Error al cargar proyectos por área:', error)
	} finally {
		loading.value = false
	}
}

onMounted(fetchProjectsByArea)
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
