<template>
	<div class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-4 shadow-sm dark:border-gray-700 sm:p-6">
		<div class="flex justify-between pb-3 mb-3 border-b border-light sm:pb-4 sm:mb-4">
			<div class="flex items-center">
				<div class="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-primary-medium border border-default-medium flex items-center justify-center rounded-full me-3">
					<svg class="w-6 h-6 sm:w-7 sm:h-7 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
					</svg>
				</div>
				<div>
					<h5 class="text-xl font-semibold text-heading sm:text-2xl">{{ totalOrganizations }}</h5>
					<p class="text-xs text-body sm:text-sm">Organizaciones totales</p>
				</div>
			</div>
		</div>

		<div class="relative">
			<div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#9C2131] mx-auto" />
					<p class="mt-2 text-gray-600 dark:text-gray-400 text-sm">Cargando datos...</p>
				</div>
			</div>

			<div v-else-if="loadError" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg p-4">
				<svg class="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-2 text-gray-600 dark:text-gray-400 text-center text-sm">Error al cargar los datos</p>
				<button
					class="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-[#9C2131] text-white rounded hover:bg-[#7a1a27] transition-colors"
					@click="fetchData">
					Reintentar
				</button>
			</div>

			<div v-else-if="!hasData" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">No hay datos disponibles</p>
			</div>

			<div v-else class="space-y-4 sm:space-y-6">
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
					<dl class="flex items-center">
						<dt class="text-body text-xs font-normal me-1 sm:text-sm">Locales:</dt>
						<dd class="text-heading text-xs font-semibold mr-4 sm:mr-8 sm:text-sm">{{ totalLocalOrganizations }}</dd>
					</dl>
					<dl class="flex items-center sm:justify-end">
						<dt class="text-body text-xs font-normal me-1 sm:text-sm">Nacionales:</dt>
						<dd class="text-heading text-xs font-semibold sm:text-sm">{{ totalNationalOrganizations }}</dd>
					</dl>
				</div>

				<div class="relative">
					<div class="w-full overflow-x-auto horizontal-scroll">
						<div id="column-chart" :key="chartKey" class="apexcharts-custom min-w-max" />
					</div>
				</div>

				<div class="text-xs text-center text-gray-500 sm:text-sm">
					{{ allUniqueClusters.length }} cámaras • {{ localClustersCount }} locales • {{ nationalClustersCount }} nacionales
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 items-center border-light border-t justify-between mt-4 sm:mt-6" />
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { getOrganizationsByCluster, getRegisteredOrganizationsCount } from '../../services/statistics/dashboard'

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded', 'loading', 'error'])

const localClusters = ref([])
const nationalClusters = ref([])
const totalOrganizationsCount = ref(0)
const loading = ref(false)
const loadError = ref(null)
const chartKey = ref(0)
let chartInstance = null

const totalOrganizations = computed(() => {
	return totalOrganizationsCount.value || 0
})

const totalLocalOrganizations = computed(() => {
	return localClusters.value.reduce((sum, item) => sum + (item.organization_count || 0), 0)
})

const totalNationalOrganizations = computed(() => {
	return nationalClusters.value.reduce((sum, item) => sum + (item.organization_count || 0), 0)
})

const localClustersCount = computed(() => {
	return localClusters.value.length
})

const nationalClustersCount = computed(() => {
	return nationalClusters.value.length
})

const allUniqueClusters = computed(() => {
	const clusterMap = new Map()

	const allClusters = [...localClusters.value, ...nationalClusters.value]
	allClusters.forEach(cluster => {
		if (cluster.cluster_name) {
			if (!clusterMap.has(cluster.cluster_name)) {
				clusterMap.set(cluster.cluster_name, {
					name: cluster.cluster_name,
					localCount: 0,
					nationalCount: 0
				})
			}
		}
	})

	localClusters.value.forEach(cluster => {
		if (cluster.cluster_name && clusterMap.has(cluster.cluster_name)) {
			const clusterData = clusterMap.get(cluster.cluster_name)
			clusterData.localCount = (cluster.organization_count || 0)
		}
	})

	nationalClusters.value.forEach(cluster => {
		if (cluster.cluster_name && clusterMap.has(cluster.cluster_name)) {
			const clusterData = clusterMap.get(cluster.cluster_name)
			clusterData.nationalCount = (cluster.organization_count || 0)
		}
	})

	const result = Array.from(clusterMap.values()).map(item => ({
		...item,
		totalCount: item.localCount + item.nationalCount
	}))

	return result.sort((a, b) => {
		if (b.totalCount !== a.totalCount) {
			return b.totalCount - a.totalCount
		}
		return a.name.localeCompare(b.name)
	})
})

const hasData = computed(() => {
	return allUniqueClusters.value.length > 0
})

const chartData = computed(() => {
	const categories = allUniqueClusters.value.map(item => item.name)
	const localData = allUniqueClusters.value.map(item => item.localCount)
	const nationalData = allUniqueClusters.value.map(item => item.nationalCount)

	return {
		categories,
		localData,
		nationalData,
		fullNames: allUniqueClusters.value.map(item => item.name),
		totals: allUniqueClusters.value.map(item => item.totalCount)
	}
})

const chartHeight = computed(() => {
	const baseHeight = 400
	const itemHeight = 45
	return Math.max(baseHeight, allUniqueClusters.value.length * itemHeight)
})

const renderChart = () => {
	const container = document.getElementById("column-chart")
	if (!container || typeof ApexCharts === 'undefined') {
		return
	}

	if (chartInstance) {
		chartInstance.destroy()
	}

	const brandColor = "#9C2131"
	const brandSecondaryColor = "#C9A236"

	const options = {
		colors: [brandColor, brandSecondaryColor],
		series: [
			{
				name: "Locales",
				color: brandColor,
				data: chartData.value.categories.map((category, index) => ({
					x: category,
					y: chartData.value.localData[index]
				}))
			},
			{
				name: "Nacionales",
				color: brandSecondaryColor,
				data: chartData.value.categories.map((category, index) => ({
					x: category,
					y: chartData.value.nationalData[index]
				}))
			}
		],
		chart: {
			type: "bar",
			height: `${chartHeight.value}px`,
			width: '100%',
			fontFamily: "Inter, sans-serif",
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
			animations: { enabled: true, speed: 800 }
		},
		plotOptions: {
			bar: {
				horizontal: true,
				columnWidth: '70%',
				borderRadiusApplication: "end",
				borderRadius: 4,
				dataLabels: { position: 'top' }
			},
		},
		dataLabels: {
			enabled: true,
			formatter: function(val) {
				return val > 0 ? val : ''
			},
			style: {
				fontSize: '11px',
				fontFamily: 'Inter, sans-serif',
				colors: ['#fff']
			},
			background: { enabled: false },
			dropShadow: {
				enabled: true,
				top: 1,
				left: 1,
				blur: 2,
				color: '#000',
				opacity: 0.35
			}
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontSize: '12px',
				fontFamily: 'Inter, sans-serif'
			},
			y: {
				formatter: function(value, { seriesIndex, dataPointIndex, w }) {
					const fullName = chartData.value.fullNames[dataPointIndex]
					return `<div>
						<strong>${fullName}</strong><br/>
						${value} organizaciones
					</div>`
				}
			}
		},
		stroke: {
			show: true,
			width: 1,
			colors: ["transparent"],
		},
		grid: {
			show: true,
			borderColor: '#e5e7eb',
			strokeDashArray: 3,
			padding: {
				left: 2,
				right: 2,
				top: -12
			},
			xaxis: { lines: { show: true } },
			yaxis: { lines: { show: false } }
		},
		legend: {
			show: true,
			position: 'top',
			horizontalAlign: 'right',
			fontSize: '12px',
			fontFamily: 'Inter, sans-serif',
			markers: {
				width: 10,
				height: 10,
				radius: 4
			}
		},
		xaxis: {
			labels: {
				show: true,
				style: {
					fontFamily: "Inter, sans-serif",
					fontSize: '11px',
					fontWeight: '400'
				}
			},
			axisBorder: {
				show: true,
				color: '#9f813c',
				height: 1
			},
			axisTicks: {
				show: true,
				color: '#9f813c'
			},
			title: {
				text: 'Número de Organizaciones',
				style: {
					color: '#374151',
					fontSize: '12px',
					fontWeight: 600,
					fontFamily: 'Inter, sans-serif'
				}
			}
		},
		yaxis: {
			labels: {
				show: true,
				style: {
					fontFamily: "Inter, sans-serif",
					fontSize: '11px',
					fontWeight: '400'
				},
				maxWidth: 300,
				trim: false
			},
		},
		fill: { opacity: 1 }
	}

	chartInstance = new ApexCharts(container, options)
	chartInstance.render()
}

const fetchData = async () => {
	try {
		loading.value = true
		loadError.value = null
		emit('loading', true)

		const [response, orgResponse] = await Promise.all([
			getOrganizationsByCluster(props.filters),
			getRegisteredOrganizationsCount(props.filters)
		])

		const data = response.data

		nationalClusters.value = Array.isArray(data.nacionales) ? data.nacionales : []
		localClusters.value = Array.isArray(data.locales) ? data.locales : []

		totalOrganizationsCount.value = orgResponse.data || 0

		await nextTick()
		chartKey.value++

		if (hasData.value && typeof ApexCharts !== 'undefined') {
			setTimeout(renderChart, 100)
		}

		emit('loaded')
	} catch (err) {
		console.error('Error al cargar datos de cámaras:', err)
		loadError.value = err.message || 'Error desconocido'
		localClusters.value = []
		nationalClusters.value = []
		totalOrganizationsCount.value = 0
		emit('error', err)
	} finally {
		loading.value = false
		emit('loading', false)
	}
}

watch(() => props.filters, () => {
	fetchData()
}, { deep: true })

watch([allUniqueClusters], async () => {
	if (hasData.value && typeof ApexCharts !== 'undefined') {
		await nextTick()
		chartKey.value++
		setTimeout(renderChart, 100)
	}
}, { deep: true })

onMounted(async () => {
	await fetchData()

	if (typeof ApexCharts === 'undefined') {
		const script = document.createElement('script')
		script.src = 'https://cdn.jsdelivr.net/npm/apexcharts'
		script.onload = () => {
			if (hasData.value) {
				setTimeout(renderChart, 100)
			}
		}
		document.head.appendChild(script)
	}
})
</script>

<style scoped>
.horizontal-scroll {
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: thin;
	scrollbar-color: #c5c5c5 #f1f1f1;
}

.horizontal-scroll::-webkit-scrollbar {
	height: 8px;
}

.horizontal-scroll::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 8px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
	background: #c5c5c5;
	border-radius: 8px;
}

.horizontal-scroll::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}

#column-chart {
	min-width: 600px;
	width: 100%;
}

.apexcharts-custom {
	width: 100% !important;
}

:deep(.apexcharts-canvas) {
	width: 100% !important;
}

:deep(.apexcharts-tooltip) {
	font-size: 12px !important;
	font-family: 'Inter', sans-serif !important;
}

:deep(.apexcharts-tooltip-text) {
	font-size: 11px !important;
	color: #374151 !important;
}

:deep(.dark .apexcharts-tooltip-text) {
	color: rgba(255, 255, 255, 0.9) !important;
}

@media (max-width: 640px) {
	#column-chart {
		min-width: 500px;
	}

	:deep(.apexcharts-tooltip) {
		font-size: 11px !important;
	}
}
</style>