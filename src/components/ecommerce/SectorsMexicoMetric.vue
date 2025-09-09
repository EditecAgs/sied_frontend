<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 p-6 shadow-sm dark:border-gray-700"
		style="background: linear-gradient(to top, rgba(211, 211, 210, 0.8) 30%, rgba(159, 129, 60, 0.8) 100%);">

		<h3 class="text-xl font-semibold text-stone-50 dark:text-gray-100 mb-6 text-center">
			Sectores de Proyectos del Plan México
		</h3>

		<div class="flex justify-center" v-if="projects_by_sector_mexico.length > 0">
			<PieChart :data="chartData" :options="chartOptions" />
		</div>

		<p v-else class="text-center text-gray-500 dark:text-gray-400">
			No hay datos disponibles para mostrar
		</p>

		<div class="flex justify-center mt-6 gap-4">
			<button
				:disabled="currentPage === 1"
				class="rounded-md border border-gray-300 bg-white/80 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700"
				@click="fetchPage(currentPage - 1)">
				Anterior
			</button>

			<button
				:disabled="currentPage === lastPage"
				class="rounded-md border border-gray-300 bg-white/80 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700"
				@click="fetchPage(currentPage + 1)">
				Siguiente
			</button>
		</div>

		<p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
			Página {{ currentPage }} de {{ lastPage }}
		</p>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { getProjectsBySectorMexico } from '../../services/statistics/dashboard'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const projects_by_sector_mexico = ref([])
const currentPage = ref(1)
const lastPage = ref(1)

const PieChart = Pie

const palette = [
	'#9C2131',
	'#C9A236',
	'#3A4A5F',
	'#707070',
	'#C4C4C4',
	'#6B7280',
	'#B45309',
	'#9CA3AF',
]

const chartData = computed(() => ({
	labels: projects_by_sector_mexico.value.map(item => item.sector_name),
	datasets: [
		{
			label: 'Número de Proyectos',
			data: projects_by_sector_mexico.value.map(item => item.project_count),
			backgroundColor: palette,
			borderWidth: 2,
			borderColor: '#fff'
		}
	]
}))

const chartOptions = {
	responsive: true,
	plugins: {
		legend: {
			position: 'right',
			labels: { color: '#374151', font: { size: 12 } }
		},
		title: {
			display: true,
			text: 'Distribución por sectores',
			color: 'tex',
			font: { size: 14, weight: 'bold' }
		}
	}
}

const fetchPage = async (page = 1) => {
	try {
		const response = await getProjectsBySectorMexico(page)
		const result = response.data
		projects_by_sector_mexico.value = result.data
		currentPage.value = result.pagination.current_page
		lastPage.value = result.pagination.last_page
	} catch (error) {
		console.error('Error al cargar sectores de México:', error)
	}
}

onMounted(() => {
	fetchPage(1)
})
</script>
