<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 px-6 pt-6 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:px-8 sm:pt-8">
		<div class="flex items-center justify-between mb-5">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">
				Proyectos Duales por Mes
			</h3>
		</div>

		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<div id="chartOne" class="-ml-4 min-w-[650px] xl:min-w-full pl-2">
				<VueApexCharts
					type="bar"
					height="200"
					:options="chartOptions"
					:series="series" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { getProjectsCountByMonth } from '../../services/statistics/dashboard'

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded'])


const series = ref([
	{
		name: 'Proyectos creados',
		data: Array(12).fill(0),
	},
])

const monthLabels = [
	'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
	'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const chartOptions = ref({
	colors: ['#82181a'],
	chart: {
		fontFamily: 'Outfit, sans-serif',
		type: 'bar',
		toolbar: { show: false },
		foreColor: '#374151',
		background: 'transparent',
	},
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '50%',
			borderRadius: 8,
			borderRadiusApplication: 'end',
		},
	},
	dataLabels: { enabled: false },
	stroke: {
		show: true,
		width: 2,
		colors: ['#ffffff'],
	},
	xaxis: {
		categories: monthLabels,
		axisBorder: { show: true, color: '#9f813c' },
		axisTicks: { show: true, color: '#9f813c' },
		labels: {
			style: {
				colors: '#374151',
				fontSize: '12px',
				fontWeight: 500,
			},
		},
	},
	yaxis: {
		title: false,
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
		yaxis: { lines: { show: true } },
	},
	fill: { opacity: 1 },
	tooltip: {
		x: { show: false },
		y: { formatter: val => val.toString() },
	},
	legend: {
		show: true,
		position: 'top',
		horizontalAlign: 'left',
		fontFamily: 'Outfit',
		markers: { radius: 99 },
		labels: { colors: '#374151', fontWeight: 600 },
	},
})

const loadData = async () => {
	try {
		const response = await getProjectsCountByMonth(props.filters)

		const monthlyData = response.data
		const dataByMonth = Array(12).fill(0)

		if (monthlyData && monthlyData.length > 0) {
			monthlyData.forEach(item => {
				const index = item.month_number - 1
				if (index >= 0 && index < 12) {
					dataByMonth[index] = item.project_count
				}
			})
		}

		series.value = [{
			name: 'Proyectos creados',
			data: dataByMonth,
		}]

		const currentYear = new Date().getFullYear()
		const yearToShow = monthlyData.length > 0 ? monthlyData[0].year : currentYear

		const allSameYear = monthlyData.every(item => item.year === yearToShow)

		if (allSameYear && yearToShow) {
			chartOptions.value.xaxis.categories = monthLabels.map(month =>
				`${month} ${yearToShow}`
			)
		}

		emit('loaded')
	} catch (error) {
		console.error('Error al cargar proyectos por mes:', error)
		series.value = [{
			name: 'Proyectos creados',
			data: Array(12).fill(0),
		}]
	}
}
onMounted(() => {
	loadData()
})


watch(() => props.filters, () => {
	loadData()
}, { deep: true })
</script>