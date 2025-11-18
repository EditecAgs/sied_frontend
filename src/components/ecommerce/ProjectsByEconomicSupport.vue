<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 px-6 pt-6 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:px-8 sm:pt-8">
		<div class="flex items-center justify-between mb-5">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">
				Proyectos por Tipo de Apoyo Económico
			</h3>
		</div>

		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<div id="chartEconomicSupport" class="min-w-[350px]">
				<VueApexCharts
					type="bar"
					height="350"
					:options="chartOptions"
					:series="series" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { getProjectsByEconomicSupport } from '../../services/statistics/dashboard'

const series = ref([
	{
		name: 'Proyectos',
		data: []
	}
])

const chartOptions = ref({
	colors: ['#83181b', '#a34245', '#c36b6f', '#e39499'],
	chart: {
		fontFamily: 'Outfit, sans-serif',
		type: 'bar',
		toolbar: { show: false },
		foreColor: '#374151',
		background: 'transparent',
	},
	plotOptions: {
		bar: {
			horizontal: true,
			borderRadius: 6,
			distributed: true,
		},
	},
	dataLabels: {
		enabled: true,
		formatter: function (val) {
			return val + ' proyectos'
		},
		style: {
			fontSize: '13px',
			fontWeight: 600,
		},
		background: {
			enabled: false
		},
		dropShadow: {
			enabled: false
		}
	},
	xaxis: {
		categories: [],
		labels: { style: { fontSize: '13px' } },
	},
	yaxis: {
		labels: { style: { fontSize: '13px' } },
	},
	tooltip: {
		y: {
			formatter: function (value, { dataPointIndex, w }) {
				return w.config.xaxis.categories[dataPointIndex] + ': ' + value + ' proyectos'
			},
		},
	},
	legend: { show: false },
})

onMounted(async () => {
	try {
		const response = await getProjectsByEconomicSupport()
		const data = response.data.data

		const labels = data.map(item => item.support_name)
		const values = data.map(item => item.project_count)

		const dataLabelsColors = values.map(value =>
			value === 0 ? '#000000' : '#FFFFFF'
		)

		chartOptions.value = {
			...chartOptions.value,
			xaxis: {
				...chartOptions.value.xaxis,
				categories: labels
			},
			dataLabels: {
				...chartOptions.value.dataLabels,
				style: {
					...chartOptions.value.dataLabels.style,
					colors: dataLabelsColors
				}
			}
		}

		series.value = [{ name: 'Proyectos', data: values }]
	} catch (error) {
		console.error('Error al cargar proyectos por apoyo económico:', error)
	}
})
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
</style>