<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-4 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:p-6 lg:p-8">
		<div class="flex flex-col gap-4 mb-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
			<h3 class="text-lg font-semibold text-gray-600 dark:text-white sm:text-xl">
				Proyectos por Tipo de Apoyo Económico
			</h3>

			<div class="flex items-center gap-3">
				<div v-if="loading" class="text-xs text-gray-500 sm:text-sm">
					Cargando...
				</div>

				<div v-else-if="loadError" class="text-xs text-red-500 sm:text-sm">
					Error
				</div>

				<div v-else class="text-xs text-gray-500 sm:text-sm">
					Total: {{ totalProjects }} proyectos
				</div>

				<div v-if="!loading && !loadError && totalPages > 1" class="flex items-center gap-2">
					<button
						:disabled="currentPage === 1"
						class="px-2 py-1 text-xs bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
						@click="goToPage(currentPage - 1)">
						←
					</button>
					<span class="text-xs text-gray-600 dark:text-gray-400">Pág {{ currentPage }} de {{ totalPages }}</span>
					<button
						:disabled="currentPage === totalPages"
						class="px-2 py-1 text-xs bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
						@click="goToPage(currentPage + 1)">
						→
					</button>
				</div>
			</div>
		</div>

		<div class="relative min-h-[250px] sm:min-h-[300px] lg:min-h-[350px]">
			<div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#83181b] mx-auto" />
					<p class="mt-3 text-gray-600 dark:text-gray-400 text-sm">Cargando datos...</p>
				</div>
			</div>

			<div v-else-if="loadError" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg p-4">
				<svg class="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-3 text-gray-600 dark:text-gray-400 text-center text-sm">Error al cargar los datos</p>
				<button
					class="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-[#83181b] text-white rounded hover:bg-[#6a1416] transition-colors"
					@click="loadData">
					Reintentar
				</button>
			</div>

			<!-- MODIFICADO: Cambiado hasData por hasPaginatedData -->
			<div v-else-if="!hasPaginatedData" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<svg class="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="mt-3 text-gray-600 dark:text-gray-400 text-sm">No hay datos en esta página</p>
				</div>
			</div>

			<div v-else class="w-full overflow-x-auto custom-scrollbar">
				<div id="chartEconomicSupport" class="min-w-[280px] sm:min-w-[350px]">
					<VueApexCharts
						:key="chartKey"
						type="bar"
						:height="chartHeight"
						:options="chartOptions"
						:series="series"
						class="apex-chart-responsive" />
				</div>
			</div>
		</div>

		<div v-if="!loading && !loadError && totalPages > 1" class="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
			<div class="text-xs text-gray-600 dark:text-gray-400">
				Mostrando {{ startItem }}-{{ endItem }} de {{ totalItems }} tipos de apoyo
			</div>

			<div class="flex items-center gap-1">
				<button
					v-for="page in visiblePages"
					:key="page"
					:class="[
						'px-3 py-1 text-xs rounded-md transition-colors',
						currentPage === page
							? 'bg-[#83181b] text-white'
							: 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700'
					]"
					@click="goToPage(page)">
					{{ page }}
				</button>
				<span v-if="showEllipsis" class="px-2 text-gray-500 text-xs">...</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { getProjectsByEconomicSupport } from '../../services/statistics/dashboard'

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded', 'loading', 'error'])

const allSupports = ref([])
const loading = ref(false)
const loadError = ref(null)
const totalProjects = ref(0)
const chartKey = ref(0)
const currentPage = ref(1)
const itemsPerPage = 5

const totalItems = computed(() => allSupports.value.length)

const totalPages = computed(() => {
	return Math.ceil(allSupports.value.length / itemsPerPage)
})

const startItem = computed(() => {
	return ((currentPage.value - 1) * itemsPerPage) + 1
})

const endItem = computed(() => {
	return Math.min(currentPage.value * itemsPerPage, totalItems.value)
})

const paginatedSupports = computed(() => {
	const startIndex = (currentPage.value - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	return allSupports.value.slice(startIndex, endIndex)
})

const hasPaginatedData = computed(() => {
	return paginatedSupports.value.length > 0
})

const visiblePages = computed(() => {
	const pages = []
	const maxVisible = 5
	let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
	let end = Math.min(totalPages.value, start + maxVisible - 1)

	if (end - start + 1 < maxVisible) {
		start = Math.max(1, end - maxVisible + 1)
	}

	for (let i = start; i <= end; i++) {
		pages.push(i)
	}
	return pages
})

const showEllipsis = computed(() => {
	return totalPages.value > visiblePages.value.length
})

const series = ref([{ name: 'Proyectos', data: [] }])

const chartOptions = ref({
	colors: ['#83181b', '#a34245', '#c36b6f', '#e39499', '#d1a17a', '#b8ae9d'],
	chart: {
		fontFamily: 'Outfit, sans-serif',
		type: 'bar',
		toolbar: {
			show: true,
			tools: {
				download: true,
				selection: false,
				zoom: false,
				zoomin: false,
				zoomout: false,
				pan: false,
				reset: true
			}
		},
		foreColor: '#374151',
		background: 'transparent',
		animations: {
			enabled: true,
			easing: 'easeinout',
			speed: 800,
			animateGradually: { enabled: true, delay: 150 },
			dynamicAnimation: { enabled: true, speed: 350 }
		},
		events: {
			dataPointSelection: (event, chartContext, config) => {
				const supportIndex = config.dataPointIndex
				const support = chartOptions.value.xaxis.categories[supportIndex]
				const value = series.value[0].data[supportIndex]
				console.log(`Apoyo económico seleccionado: ${support} (${value} proyectos)`)
			}
		}
	},
	plotOptions: {
		bar: {
			horizontal: true,
			borderRadius: 4,
			borderRadiusApplication: 'end',
			columnWidth: '60%',
			dataLabels: { position: 'top' }
		},
	},
	dataLabels: {
		enabled: true,
		formatter: function (val, { dataPointIndex, w }) {
			const percentage = w.config.seriesPercentages ? w.config.seriesPercentages[dataPointIndex] : '0%'
			return `${val} (${percentage})`
		},
		style: {
			fontSize: '10px',
			fontWeight: 600,
			colors: ['#FFFFFF']
		},
		background: { enabled: false },
		dropShadow: {
			enabled: true,
			top: 1,
			left: 1,
			blur: 2,
			color: '#000000',
			opacity: 0.35
		},
		offsetX: 8,
	},
	xaxis: {
		categories: [],
		labels: {
			style: {
				fontSize: '11px',
				fontWeight: 500,
				colors: '#374151'
			},
			formatter: function (value) {
				if (value.length > 20) return value.substring(0, 17) + '...'
				return value
			}
		},
		title: {
			text: 'Número de Proyectos',
			style: {
				color: '#374151',
				fontSize: '12px',
				fontWeight: 600
			}
		},
		axisBorder: {
			show: true,
			color: '#9f813c',
			height: 1
		},
		axisTicks: { show: true, color: '#9f813c' }
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '11px',
				fontWeight: 500,
				colors: '#374151'
			},
			maxWidth: 160,
			trim: true
		},
		title: {
			text: 'Tipo de Apoyo',
			style: {
				color: '#374151',
				fontSize: '12px',
				fontWeight: 600
			}
		}
	},
	grid: {
		borderColor: '#9f813c',
		strokeDashArray: 3,
		yaxis: { lines: { show: true, opacity: 0.3 } },
		xaxis: { lines: { show: true, opacity: 0.3 } },
		padding: { top: 0, right: 15, bottom: 0, left: 15 }
	},
	tooltip: {
		enabled: true,
		shared: false,
		intersect: true,
		y: {
			formatter: function (value, { dataPointIndex, w }) {
				const support = w.config.xaxis.categories[dataPointIndex]
				const percentage = w.config.seriesPercentages ? w.config.seriesPercentages[dataPointIndex] : '0%'
				return `${support}: ${value} proyectos (${percentage})`
			},
		},
		style: { fontSize: '11px', fontFamily: 'Outfit, sans-serif' },
		marker: { show: true }
	},
	legend: { show: false },
	responsive: [{
		breakpoint: 640,
		options: {
			chart: { height: 250 },
			plotOptions: {
				bar: { borderRadius: 3, columnWidth: '55%' }
			},
			dataLabels: {
				style: { fontSize: '9px' },
				offsetX: 4,
				enabled: false
			},
			xaxis: {
				title: { style: { fontSize: '11px' } },
				labels: { style: { fontSize: '10px' } }
			},
			yaxis: {
				title: { style: { fontSize: '11px' } },
				labels: { style: { fontSize: '10px' }, maxWidth: 120 }
			}
		}
	}]
})

const hasData = computed(() => {
	return allSupports.value.length > 0
})

const chartHeight = computed(() => {
	if (typeof window !== 'undefined') {
		if (window.innerWidth < 640) return 220
		if (window.innerWidth < 768) return 250
		if (window.innerWidth < 1024) return 300
	}
	return 350
})

const updateChart = () => {
	const dataToShow = paginatedSupports.value

	if (dataToShow.length === 0) {
		series.value = [{ name: 'Proyectos', data: [] }]
		chartOptions.value.xaxis.categories = []
		return
	}

	const labels = dataToShow.map(item => item.support_name || 'Sin nombre')
	const values = dataToShow.map(item => item.project_count || 0)

	const percentages = dataToShow.map(item => {
		if (item.percentage !== undefined && item.percentage !== null) {
			return `${parseFloat(item.percentage).toFixed(1)}%`
		}
		return totalProjects.value > 0
			? `${((item.project_count || 0) / totalProjects.value * 100).toFixed(1)}%`
			: '0%'
	})

	chartOptions.value = {
		...chartOptions.value,
		xaxis: {
			...chartOptions.value.xaxis,
			categories: labels
		},
		seriesPercentages: percentages
	}

	const colors = values.map((value, index) => {
		if (value === 0) return '#d1d5db'
		const baseColors = ['#83181b', '#a34245', '#c36b6f', '#e39499', '#d1a17a', '#b8ae9d']
		return baseColors[index % baseColors.length]
	})

	chartOptions.value.colors = colors
	series.value = [{ name: 'Proyectos', data: values }]
}

const goToPage = async (page) => {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page
		updateChart()
		await nextTick()
		chartKey.value++
	}
}

const loadData = async () => {
	try {
		loading.value = true
		loadError.value = null
		emit('loading', true)

		const response = await getProjectsByEconomicSupport(props.filters)

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

		totalProjects.value = data.reduce((sum, item) => sum + (item.project_count || 0), 0)

		const sortedData = [...data].sort((a, b) => {
			if (b.project_count !== a.project_count) {
				return b.project_count - a.project_count
			}
			return (a.support_name || '').localeCompare(b.support_name || '')
		})

		allSupports.value = sortedData

		currentPage.value = 1

		updateChart()

		console.log('Datos procesados para gráfico:', {
			totalProyectos: totalProjects.value,
			totalTiposDeApoyo: sortedData.length,
			paginas: totalPages.value,
			datosPaginaActual: paginatedSupports.value
		})

		await nextTick()
		chartKey.value++

		emit('loaded')
	} catch (err) {
		console.error('Error al cargar proyectos por apoyo económico:', err)
		loadError.value = err.message || 'Error desconocido'
		allSupports.value = []
		series.value = [{ name: 'Proyectos', data: [] }]
		chartOptions.value.xaxis.categories = []
		totalProjects.value = 0
		emit('error', err)
	} finally {
		loading.value = false
		emit('loaded')
	}
}

onMounted(async () => {
	await loadData()
})

watch(() => props.filters, () => {
	loadData()
}, { deep: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #c5c5c5;
	border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}

.apex-chart-responsive {
	width: 100%;
	min-width: 100%;
}

@media (max-width: 640px) {
	:deep(.apexcharts-xaxis-label),
	:deep(.apexcharts-yaxis-label) {
		font-size: 10px !important;
	}
}

@media (max-width: 768px) {
	:deep(.apexcharts-toolbar) {
		padding: 4px !important;
	}
}
</style>