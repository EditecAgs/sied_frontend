<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 p-4 shadow-sm dark:border-gray-700 sm:p-6"
		style="background: linear-gradient(to top, rgba(211, 211, 210, 0.8) 30%, rgba(159, 129, 60, 0.8) 100%);">
		<div class="flex justify-between items-center mb-4 sm:mb-6">
			<h3 class="text-lg font-semibold text-stone-50 dark:text-gray-100 sm:text-xl">
				Proyectos por Cámaras Nacionales
			</h3>

			<div v-if="loading" class="text-xs text-stone-50 dark:text-gray-300 sm:text-sm">
				Cargando...
			</div>
			<div v-else-if="loadError" class="text-xs text-red-300 sm:text-sm">
				Error
			</div>
			<div v-else class="text-xs text-stone-50 dark:text-gray-300 sm:text-sm">
				{{ filteredNationalClusters.length }} cámaras
			</div>
		</div>

		<div class="relative min-h-[300px] sm:min-h-[350px]">
			<div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#9C2131] mx-auto" />
					<p class="mt-3 text-stone-50 dark:text-gray-300 text-sm">Cargando datos...</p>
				</div>
			</div>

			<div v-else-if="loadError" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg p-4">
				<svg class="h-10 w-10 sm:h-12 sm:w-12 text-red-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-3 text-stone-50 dark:text-gray-300 text-center text-sm">Error al cargar los datos</p>
				<button
					class="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-[#9C2131] text-white rounded hover:bg-[#7a1a27] transition-colors"
					@click="fetchData">
					Reintentar
				</button>
			</div>

			<div v-else-if="!hasData" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<svg class="h-10 w-10 sm:h-12 sm:w-12 text-stone-50 dark:text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="mt-3 text-stone-50 dark:text-gray-300 text-sm sm:text-base">No hay datos disponibles</p>
					<p class="text-xs text-stone-50/80 dark:text-gray-400 mt-1">No se encontraron proyectos en cámaras nacionales</p>
				</div>
			</div>

			<div v-else class="space-y-4 sm:space-y-6">
				<div class="w-full">
					<div class="relative h-64 sm:h-72 md:h-80 lg:h-96">
						<BarChart :key="chartKey" :data="chartData" :options="chartOptions" />
					</div>
				</div>

				<div class="mt-3 text-center text-stone-600 dark:text-gray-300 text-xs sm:text-sm">
					Total: {{ totalProjectsNational }} proyectos •
					{{ filteredNationalClusters.length }} cámaras nacionales con proyectos
					<span v-if="nationalClustersWithoutProjects > 0" class="block text-xs text-stone-600/80 dark:text-gray-400 mt-1">
						{{ nationalClustersWithoutProjects }} cámaras sin proyectos
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { getProjectsByCluster } from '../../services/statistics/dashboard'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded', 'loading', 'error'])

const nationalClusters = ref([])
const loading = ref(false)
const loadError = ref(null)
const chartKey = ref(0)
const isMounted = ref(false)

const BarChart = Bar

const palette = [
	'#9C2131', '#C9A236', '#3A4A5F', '#707070', '#C4C4C4',
	'#6B7280', '#B45309', '#9CA3AF', '#7C3AED', '#0891B2',
	'#65A30D', '#EA580C', '#BE123C', '#0F766E', '#4338CA'
]

const filteredNationalClusters = computed(() => {
	return nationalClusters.value
		.filter(item => item.project_count > 0)
		.sort((a, b) => b.project_count - a.project_count)
		.slice(0, typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 8)
})

const nationalClustersWithoutProjects = computed(() => {
	return nationalClusters.value.filter(item => item.project_count === 0).length
})

const totalProjectsNational = computed(() => {
	return filteredNationalClusters.value.reduce((sum, item) => sum + item.project_count, 0)
})

const hasData = computed(() => {
	return filteredNationalClusters.value.length > 0
})

const chartData = computed(() => {
	const displayData = filteredNationalClusters.value

	return {
		labels: displayData.map(item => {
			const name = item.cluster_name || ''
			if (typeof window !== 'undefined') {
				return window.innerWidth < 640 && name.length > 25
					? name.substring(0, 22) + '...'
					: window.innerWidth < 768 && name.length > 35
						? name.substring(0, 32) + '...'
						: name
			}
			return name.length > 35 ? name.substring(0, 32) + '...' : name
		}),
		datasets: [
			{
				label: 'Proyectos por Cámara Nacional',
				data: displayData.map(item => item.project_count),
				backgroundColor: displayData.map((_, index) =>
					palette[index % palette.length]
				),
				borderWidth: typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 2,
				borderColor: '#fff',
				borderRadius: 4,
				barPercentage: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.6 : 0.7,
				categoryPercentage: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.7 : 0.8,
				hoverBackgroundColor: displayData.map((_, index) => {
					return palette[index % palette.length] + 'CC'
				}),
				hoverBorderWidth: 2,
				hoverBorderColor: '#374151'
			}
		]
	}
})

const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			callbacks: {
				title: function(context) {
					const index = context[0].dataIndex
					const fullName = filteredNationalClusters.value[index]?.cluster_name || ''
					const maxLength = typeof window !== 'undefined' && window.innerWidth < 640 ? 40 : 50
					return fullName.length > maxLength ? fullName.substring(0, maxLength - 3) + '...' : fullName
				},
				label: function(context) {
					const value = context.parsed.y
					const total = totalProjectsNational.value
					const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
					return [
						`Proyectos: ${value}`,
						`Porcentaje: ${percentage}%`
					]
				}
			},
			backgroundColor: 'rgba(0, 0, 0, 0.85)',
			titleFont: {
				size: typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 13,
				family: "'Outfit', sans-serif",
				weight: '600'
			},
			bodyFont: {
				size: typeof window !== 'undefined' && window.innerWidth < 640 ? 11 : 12,
				family: "'Outfit', sans-serif"
			},
			padding: typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 12,
			cornerRadius: 6,
			displayColors: true,
			boxPadding: 4
		},
		title: {
			display: false
		}
	},
	scales: {
		y: {
			beginAtZero: true,
			title: {
				display: true,
				text: 'Número de Proyectos',
				color: '#374151',
				font: {
					size: typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 13,
					family: "'Outfit', sans-serif",
					weight: '600'
				},
				padding: { top: 5, bottom: 10 }
			},
			ticks: {
				color: '#374151',
				font: {
					size: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 11,
					family: "'Outfit', sans-serif"
				},
				stepSize: 1,
				padding: 6,
				callback: function(value) {
					if (Math.floor(value) === value) {
						return value
					}
				}
			},
			grid: {
				color: 'rgba(255, 255, 255, 0.4)',
				drawBorder: false,
				drawTicks: false
			}
		},
		x: {
			title: {
				display: true,
				text: 'Cámaras Nacionales',
				color: '#374151',
				font: {
					size: typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 13,
					family: "'Outfit', sans-serif",
					weight: '600'
				},
				padding: { top: 10, bottom: 5 }
			},
			ticks: {
				color: '#374151',
				font: {
					size: typeof window !== 'undefined' && window.innerWidth < 640 ? 9 : 10,
					family: "'Outfit', sans-serif",
					weight: '500'
				},
				maxRotation: 45,
				minRotation: 0,
				autoSkip: true,
				autoSkipPadding: 10,
				padding: 8,
				maxTicksLimit: typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 8
			},
			grid: {
				display: false
			}
		}
	},
	layout: {
		padding: {
			left: 10,
			right: 10,
			top: 10,
			bottom: 20
		}
	},
	onClick: (event, elements) => {
		if (elements.length > 0) {
			const index = elements[0].index
			const cluster = filteredNationalClusters.value[index]
			if (cluster) {
				console.log('Cámara nacional seleccionada:', cluster)
			}
		}
	},
	animation: {
		duration: 800,
		easing: 'easeOutQuart'
	}
}))

const fetchData = async () => {
	try {
		loading.value = true
		loadError.value = null
		emit('loading', true)

		const response = await getProjectsByCluster(props.filters)

		let clustersData = null

		console.log('Respuesta del backend:', response)

		if (response && response.nacionales !== undefined) {
			clustersData = response
		}
		else if (response && response.data && response.data.nacionales !== undefined) {
			clustersData = response.data
		}
		else if (response && response.data && response.data.data && response.data.data.nacionales !== undefined) {
			clustersData = response.data.data
		}
		nationalClusters.value = clustersData?.nacionales || []

		console.log('Datos de proyectos por cámaras nacionales cargados:', {
			estructuraRecibida: response,
			totalCámarasNacionales: nationalClusters.value.length,
			cámarasConProyectos: filteredNationalClusters.value.length,
			totalProyectos: totalProjectsNational.value,
			datos: filteredNationalClusters.value.slice(0, 3)
		})

		await nextTick()
		chartKey.value++

		emit('loaded')
	} catch (err) {
		console.error('Error al cargar proyectos por cámaras nacionales:', err)
		loadError.value = err
		nationalClusters.value = []
		emit('error', err)
	} finally {
		loading.value = false
		emit('loading', false)
	}
}

onMounted(async () => {
	isMounted.value = true
	await fetchData()
})

watch(() => props.filters, () => {
	fetchData()
}, { deep: true })
</script>

<style scoped>
@media (max-width: 768px) {
	:deep(.chartjs-render-monitor) {
		max-height: 250px !important;
	}
}

@media (max-width: 640px) {
	:deep(.chartjs-render-monitor) {
		max-height: 200px !important;
	}
}
</style>