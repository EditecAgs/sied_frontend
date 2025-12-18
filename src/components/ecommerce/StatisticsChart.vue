<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 px-6 pt-6 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:px-8 sm:pt-8">
		<div class="flex items-center justify-between mb-5">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">
				Proyectos por Clasificación General del Proyecto Dual
			</h3>

			<div v-if="totalPages > 1" class="flex items-center gap-2">
				<button
					:disabled="currentPage === 1"
					class="px-3 py-1 text-sm bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					@click="goToPage(currentPage - 1)">
					←
				</button>
				<span class="text-sm text-gray-600">Página {{ currentPage }} de {{ totalPages }}</span>
				<button
					:disabled="currentPage === totalPages"
					class="px-3 py-1 text-sm bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					@click="goToPage(currentPage + 1)">
					→
				</button>
			</div>
		</div>

		<div v-if="loading" class="text-center py-10 text-gray-400">
			Cargando datos...
		</div>

		<div v-else class="max-w-full overflow-x-auto custom-scrollbar">
			<div id="chartArea" class="-ml-4 min-w-[650px] xl:min-w-full pl-2 pt-3">
				<VueApexCharts
					type="bar"
					height="350"
					:options="chartOptions"
					:series="series" />
			</div>
		</div>

		<div v-if="!loading && totalPages > 1" class="mt-2 flex justify-center mb-2">
			<div class="flex items-center gap-1">
				<button
					v-for="page in visiblePages"
					:key="page"
					:class="[
						'px-3 py-1 text-sm rounded-md transition-colors',
						currentPage === page
							? 'bg-[#82181a] text-white'
							: 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
					]"
					@click="goToPage(page)">
					{{ page }}
				</button>
				<span v-if="showEllipsis" class="px-2 text-gray-500">...</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { getProjectsByArea } from '../../services/statistics/dashboard'

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded'])

const loading = ref(true)
const series = ref<any[]>([])
const chartOptions = ref<any>({})
const currentPage = ref(1)
const itemsPerPage = 10
const allData = ref<any[]>([])

const totalPages = computed(() => {
	return Math.ceil(allData.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
	const pages: number[] = []
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

const paginatedData = computed(() => {
	const startIndex = (currentPage.value - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	return allData.value.slice(startIndex, endIndex)
})

const fetchProjectsByArea = async () => {
	try {
		loading.value = true

		const response: any = await getProjectsByArea(props.filters)

		if (Array.isArray(response.data)) {
			allData.value = response.data
		} else if (response.data?.data && Array.isArray(response.data.data)) {
			allData.value = response.data.data
		} else if (response.data && typeof response.data === 'object') {
			if (response.data.results && Array.isArray(response.data.results)) {
				allData.value = response.data.results
			} else if (response.data.items && Array.isArray(response.data.items)) {
				allData.value = response.data.items
			} else if (response.data.areas && Array.isArray(response.data.areas)) {
				allData.value = response.data.areas
			} else {
				allData.value = []
			}
		} else {
			allData.value = []
		}

		currentPage.value = 1
		updateChart()

		emit('loaded')
	} catch (error) {
		console.error('Error al cargar proyectos por área:', error)
		allData.value = []
		showError()
	} finally {
		loading.value = false
	}
}

const updateChart = () => {
	const dataToShow = paginatedData.value

	if (dataToShow.length === 0) {
		series.value = [{ name: 'Proyectos', data: [0] }]
		chartOptions.value = {
			xaxis: { categories: ['No hay datos'] }
		}
		return
	}

	const sortedData = [...dataToShow].sort((a, b) => {
		if (b.project_count !== a.project_count) {
			return b.project_count - a.project_count
		}
		return (a.area_name || '').localeCompare(b.area_name || '')
	})

	const areas = sortedData.map(item => item.area_name || 'Sin nombre')
	const counts = sortedData.map(item => item.project_count || 0)

	series.value = [{ name: 'Proyectos', data: counts }]

	chartOptions.value = {
		colors: ['#82181a'],
		chart: {
			type: 'bar',
			fontFamily: 'Outfit, sans-serif',
			background: 'transparent',
			foreColor: '#374151',
			toolbar: {
				show: true,
				tools: {
					download: true,
					selection: true,
					zoom: true,
					zoomin: true,
					zoomout: true,
					pan: true,
					reset: true
				}
			}
		},
		plotOptions: {
			bar: {
				horizontal: true,
				barHeight: '60%',
				borderRadius: 6,
				borderRadiusApplication: 'end'
			}
		},
		dataLabels: {
			enabled: true,
			style: {
				fontSize: '11px',
				fontWeight: 500,
				colors: ['#ffffff']
			},
			offsetX: 10
		},
		xaxis: {
			categories: areas,
			title: {
				text: 'Número de Proyectos',
				style: { fontSize: '12px', fontWeight: 600 }
			}
		},
		yaxis: {
			labels: {
				maxWidth: 250,
				trim: true,
				style: {
					fontSize: '12px'
				}
			},
			title: {
				text: 'Áreas',
				style: { fontSize: '12px', fontWeight: 600 }
			}
		},
		tooltip: {
			y: {
				formatter: (val: number) =>
					`${val} proyecto${val !== 1 ? 's' : ''}`
			}
		},
		legend: { show: false }
	}
}

const showError = () => {
	series.value = [{ name: 'Proyectos', data: [0] }]
	chartOptions.value = {
		xaxis: { categories: ['Error al cargar datos'] }
	}
}

const goToPage = (page: number) => {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page
		updateChart()
	}
}

onMounted(() => {
	fetchProjectsByArea()
})

watch(
	() => props.filters,
	() => {
		fetchProjectsByArea()
	},
	{ deep: true }
)
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