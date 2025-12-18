<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 p-4 shadow-sm dark:border-gray-700 sm:p-6"
		style="background: linear-gradient(to top, rgba(211, 211, 210, 0.8) 30%, rgba(159, 129, 60, 0.8) 100%);">
		<h3 class="text-lg font-semibold text-stone-50 dark:text-gray-100 mb-4 text-center sm:text-xl sm:mb-6">
			Proyectos por Sectores del Plan México
		</h3>

		<div class="relative min-h-[300px] sm:min-h-[350px]">
			<div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#9C2131] mx-auto" />
					<p class="mt-3 text-gray-600 dark:text-gray-400 text-sm">Cargando datos...</p>
				</div>
			</div>

			<div v-else-if="loadError" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg p-4">
				<svg class="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-3 text-gray-600 dark:text-gray-400 text-center text-sm">Error al cargar los datos</p>
				<button
					class="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-[#9C2131] text-white rounded hover:bg-[#7a1a27] transition-colors"
					@click="fetchData">
					Reintentar
				</button>
			</div>

			<div v-else-if="!hasData" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">No hay datos disponibles</p>
			</div>

			<div v-else class="max-w-full overflow-x-auto custom-scrollbar">
				<div class="min-w-[300px] sm:min-w-[400px] flex justify-center">
					<PieChart :key="chartKey" :data="chartData" :options="chartOptions" />
				</div>

				<div class="mt-3 text-center text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
					Total: {{ totalProjects }} proyectos • Mostrando {{ filteredSectors.length }} sectores
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { getProjectsBySectorMexico } from '../../services/statistics/dashboard'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded', 'loading', 'error'])

const sectorsData = ref([])
const loading = ref(false)
const loadError = ref(null)
const totalProjects = ref(0)
const chartKey = ref(0)

const PieChart = Pie

const palette = [
	'#9C2131', '#C9A236', '#3A4A5F', '#707070', '#C4C4C4',
	'#6B7280', '#B45309', '#9CA3AF', '#7C3AED', '#0891B2',
	'#65A30D', '#EA580C', '#BE123C', '#0F766E', '#4338CA',
	'#B45309', '#6B21A8', '#0369A1', '#059669', '#DC2626'
]

const filteredSectors = computed(() => {
	return sectorsData.value.filter(item => item.project_count > 0)
})

const hasData = computed(() => {
	return filteredSectors.value.length > 0
})

const chartData = computed(() => ({
	labels: filteredSectors.value.map(item => {
		const name = item.sector_name || ''
		if (typeof window !== 'undefined') {
			return window.innerWidth < 640 ?
				(name.length > 20 ? name.substring(0, 17) + '...' : name) :
				(name.length > 25 ? name.substring(0, 22) + '...' : name)
		}
		return name.length > 25 ? name.substring(0, 22) + '...' : name
	}),
	datasets: [
		{
			label: 'Número de Proyectos',
			data: filteredSectors.value.map(item => item.project_count),
			backgroundColor: filteredSectors.value.map((_, index) =>
				palette[index % palette.length]
			),
			borderWidth: 1,
			borderColor: '#fff',
			hoverBorderWidth: 2,
			hoverBorderColor: '#374151'
		}
	]
}))

const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: typeof window !== 'undefined' && window.innerWidth < 768 ? 'bottom' : 'right',
			labels: {
				color: '#374151',
				font: {
					size: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 11,
					family: "'Outfit', sans-serif"
				},
				padding: 8,
				usePointStyle: true,
				pointStyle: 'circle',
				boxWidth: 8,
				boxHeight: 8,
				generateLabels: function(chart) {
					const data = chart.data;
					if (data.labels.length && data.datasets.length) {
						return data.labels.map((label, i) => {
							const value = data.datasets[0].data[i];
							const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
							const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

							return {
								text: `${label} (${percentage}%)`,
								fillStyle: data.datasets[0].backgroundColor[i],
								strokeStyle: data.datasets[0].borderColor,
								lineWidth: data.datasets[0].borderWidth,
								hidden: false,
								index: i
							};
						});
					}
					return [];
				}
			},
			onClick: (e, legendItem, legend) => {
				const index = legendItem.index;
				const chart = legend.chart;
				const meta = chart.getDatasetMeta(0);

				meta.data[index].hidden = !meta.data[index].hidden;
				chart.update();
			}
		},
		tooltip: {
			backgroundColor: 'rgba(0, 0, 0, 0.7)',
			titleColor: '#fff',
			bodyColor: '#fff',
			titleFont: {
				family: "'Outfit', sans-serif",
				size: 11
			},
			bodyFont: {
				family: "'Outfit', sans-serif",
				size: 10
			},
			padding: 8,
			cornerRadius: 4,
			callbacks: {
				label: function(context) {
					const label = context.label || '';
					const value = context.parsed;
					const total = context.dataset.data.reduce((a, b) => a + b, 0);
					const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
					return `${label}: ${value} proyectos (${percentage}%)`;
				}
			}
		},
		title: {
			display: false
		}
	},
	onClick: (event, elements) => {
		if (elements.length > 0) {
			const index = elements[0].index;
			const sector = filteredSectors.value[index];
			console.log('Sector seleccionado:', sector);
		}
	}
}))

const fetchData = async () => {
	try {
		loading.value = true
		loadError.value = null
		emit('loading', true)

		const response = await getProjectsBySectorMexico(props.filters)

		let data = []

		if (Array.isArray(response.data)) {
			data = response.data
		}
		else if (response.data && Array.isArray(response.data.data)) {
			data = response.data.data
		}
		else if (response.data) {
			data = response.data
		}

		const sortedData = [...data].sort((a, b) => b.project_count - a.project_count)

		sectorsData.value = sortedData

		totalProjects.value = sortedData.reduce((sum, item) => sum + (item.project_count || 0), 0)


		await nextTick()
		chartKey.value++

		emit('loaded')
	} catch (err) {
		console.error('Error al cargar sectores de México:', err)
		loadError.value = err.message || 'Error desconocido'
		sectorsData.value = []
		totalProjects.value = 0
		emit('error', err)
	} finally {
		loading.value = false
		emit('loading', false)
	}
}

onMounted(async () => {
	await fetchData()
})

watch(() => props.filters, () => {
	fetchData()
}, { deep: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #c5c5c5;
	border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}

.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: #c5c5c5 #f1f1f1;
}

@media (max-width: 768px) {
	:deep(canvas) {
		max-height: 250px !important;
	}
}

@media (max-width: 640px) {
	:deep(.chartjs-legend) {
		margin-top: 10px !important;
	}
}
</style>