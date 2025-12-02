<template>
	<div class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-6 shadow-sm dark:border-gray-700">
		<div class="flex justify-between pb-4 mb-4 border-b border-light">
			<div class="flex items-center">
				<div class="w-12 h-12 bg-neutral-primary-medium border border-default-medium flex items-center justify-center rounded-full me-3">
					<svg class="w-7 h-7 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
					</svg>
				</div>
				<div>
					<h5 class="text-2xl font-semibold text-heading">{{ totalOrganizations }}</h5>
					<p class="text-sm text-body">Organizaciones totales</p>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-2">
			<dl class="flex items-center">
				<dt class="text-body text-sm font-normal me-1 ">Organizaciones Locales:</dt>
				<dd class="text-heading text-sm font-semibold mr-8">{{ totalLocalOrganizations }}</dd>
			</dl>
			<dl class="flex items-center justify-end">
				<dt class="text-body text-sm font-normal me-1">Organizaciones Nacionales:</dt>
				<dd class="text-heading text-sm font-semibold">{{ totalNationalOrganizations }}</dd>
			</dl>
		</div>

		<div id="column-chart" class="apexcharts-custom" />

		<div class="grid grid-cols-1 items-center border-light border-t justify-between" />
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getOrganizationsByCluster, getRegisteredOrganizationsCount } from '../../services/statistics/dashboard'

const localClusters = ref([])
const nationalClusters = ref([])
const totalOrganizationsCount = ref(0)
const props = defineProps({
  filtersAdd: {
    type: Number,
    default: null 
  }
})

const totalOrganizations = computed(() => {
	return totalOrganizationsCount.value
})

const totalLocalOrganizations = computed(() => {
	return localClusters.value.reduce((sum, item) => sum + item.organization_count, 0)
})

const totalNationalOrganizations = computed(() => {
	return nationalClusters.value.reduce((sum, item) => sum + item.organization_count, 0)
})


const allUniqueClusters = computed(() => {
	const clusterMap = new Map()

	const allNames = [
		...localClusters.value.map(item => item.cluster_name),
		...nationalClusters.value.map(item => item.cluster_name)
	]

	const uniqueNames = [...new Set(allNames)]

	return uniqueNames.map(name => {
		const localCluster = localClusters.value.find(item => item.cluster_name === name)
		const nationalCluster = nationalClusters.value.find(item => item.cluster_name === name)

		return {
			name: name,
			localCount: localCluster ? localCluster.organization_count : 0,
			nationalCount: nationalCluster ? nationalCluster.organization_count : 0,
			totalCount: (localCluster ? localCluster.organization_count : 0) +
				(nationalCluster ? nationalCluster.organization_count : 0)
		}
	}).sort((a, b) => b.totalCount - a.totalCount)
})

const chartData = computed(() => {
	const categories = allUniqueClusters.value.map(item => item.name)


	const localData = allUniqueClusters.value.map(item => item.localCount)
	const nationalData = allUniqueClusters.value.map(item => item.nationalCount)

	return {
		categories,
		localData,
		nationalData,
		fullNames: allUniqueClusters.value.map(item => item.name)
	}
})

const renderChart = () => {
	if (!document.getElementById("column-chart") || typeof ApexCharts === 'undefined') {
		return
	}

	const brandColor = "#9C2131"
	const brandSecondaryColor = "#C9A236"

	const chartHeight = Math.max(320, allUniqueClusters.value.length * 60)

	const options = {
		colors: [brandColor, brandSecondaryColor],
		series: [
			{
				name: "Organizaciones Locales",
				color: brandColor,
				data: chartData.value.categories.map((category, index) => ({
					x: category,
					y: chartData.value.localData[index]
				}))
			},
			{
				name: "Organizaciones Nacionales",
				color: brandSecondaryColor,
				data: chartData.value.categories.map((category, index) => ({
					x: category,
					y: chartData.value.nationalData[index]
				}))
			}
		],
		chart: {
			type: "bar",
			height: `${chartHeight}px`,
			fontFamily: "Inter, sans-serif",
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				horizontal: true,
				columnWidth: "70%",
				borderRadiusApplication: "end",
				borderRadius: 4,
			},
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontSize: '12px',
				fontFamily: 'Inter, sans-serif'
			}
		},
		states: {
			hover: {
				filter: {
					type: "darken",
					value: 1,
				},
			},
		},
		stroke: {
			show: true,
			width: 0,
			colors: ["transparent"],
		},
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -14
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		xaxis: {
			floating: false,
			labels: {
				show: true,
				style: {
					fontFamily: "Inter, sans-serif",
					fontSize: '11px',
					fontWeight: '400',
					cssClass: 'text-gray-600 dark:text-gray-400'
				}
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			labels: {
				show: true,
				style: {
					fontFamily: "Inter, sans-serif",
					fontSize: '11px',
					fontWeight: '400',
					cssClass: 'text-gray-600 dark:text-gray-400'
				}
			},
		},
		fill: {
			opacity: 1,
		},
	}

	const existingChart = document.querySelector('#column-chart .apexcharts-canvas')
	if (existingChart) {
		existingChart.remove()
	}

	const chart = new ApexCharts(document.getElementById("column-chart"), options)
	chart.render()
}

const fetchData = async () => {
	try {

		const response = await getOrganizationsByCluster(props.filtersAdd)
		const result = response.data

		localClusters.value = result.data.locales || []
		nationalClusters.value = result.data.nacionales || []


		const orgResponse = await getRegisteredOrganizationsCount(props.filtersAdd)
		totalOrganizationsCount.value = orgResponse.data.count

		console.log('Datos cargados:', {
			totalOrganizations: totalOrganizations.value,
			totalLocalOrganizations: totalLocalOrganizations.value,
			totalNationalOrganizations: totalNationalOrganizations.value,
			uniqueClusters: allUniqueClusters.value
		})

		setTimeout(renderChart, 100)

	} catch (error) {
		console.error('Error al cargar datos de cámaras:', error)
	}
}


watch([localClusters, nationalClusters], () => {
	if (allUniqueClusters.value.length > 0) {
		setTimeout(renderChart, 100)
	}
})

onMounted(() => {
	fetchData()

	if (typeof ApexCharts === 'undefined') {
		const script = document.createElement('script')
		script.src = 'https://cdn.jsdelivr.net/npm/apexcharts'
		script.onload = () => {
			setTimeout(renderChart, 100)
		}
		document.head.appendChild(script)
	}
})
</script>

<style scoped>
#column-chart {
	min-height: 320px;
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
</style>