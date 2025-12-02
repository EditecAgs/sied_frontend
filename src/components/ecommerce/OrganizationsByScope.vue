<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 px-6 pt-6 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:px-8 sm:pt-8">
		<div class="flex items-center justify-between mb-5">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">
				Operación de Organizaciones
			</h3>

			<div class="relative h-fit" />
		</div>

		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<div id="chartScope" class="min-w-[350px]">
				<VueApexCharts
					type="donut"
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
import { getOrganizationsByScope } from '../../services/statistics/dashboard'

const menuItems = [
	{ label: 'View More', onClick: () => console.log('View More clicked') },
	{ label: 'Delete', onClick: () => console.log('Delete clicked') },
]

const props = defineProps({
  filtersAdd: {
    type: Number,
    default: null 
  }
})


const series = ref([])

const chartOptions = ref({
	colors: ['#83181b', '#a34245', '#c36b6f', '#e39499'],
	chart: {
		fontFamily: 'Outfit, sans-serif',
		type: 'donut',
		toolbar: { show: false },
		foreColor: '#374151',
		background: 'transparent',
	},
	labels: [],
	dataLabels: {
		enabled: true,
		formatter: function (_, { seriesIndex, w }) {
			return w.config.labels[seriesIndex] + ': ' + w.config.series[seriesIndex]
		},
		style: {
			colors: ['#f6f6f6'],
			fontSize: '14px',
			fontWeight: 600,
		},
		dropShadow: { enabled: false },
		background: {
			enabled: true,
			foreColor: '#000',
			borderWidth: 0,
		}
	},
	plotOptions: {
		pie: {
			donut: {
				size: '65%',
				labels: {
					show: true,
					name: {
						show: true,
						color: '#374151',
						fontSize: '14px',
						fontWeight: 600,
					},
					value: {
						show: true,
						color: '#374151',
						fontSize: '16px',
						fontWeight: 700,
					},
					total: {
						show: true,
						label: 'Total',
						color: '#374151',
						fontSize: '14px',
						fontWeight: 600,
						formatter: function (w) {
							return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
						},
					},
				},
			},
		},
	},
	legend: {
		position: 'bottom',
		horizontalAlign: 'center',
		fontSize: '13px',
		labels: {
			colors: '#374151',
			useSeriesColors: false
		},
		markers: {
			width: 12,
			height: 12,
		}
	},
	tooltip: {
		y: {
			formatter: function (value, { seriesIndex, w }) {
				return w.config.labels[seriesIndex] + ': ' + value + ' organizaciones'
			},
		},
	},
	responsive: [
		{
			breakpoint: 480,
			options: {
				chart: { height: 300 },
				legend: { position: 'bottom' },
			},
		},
	],
})

const scopeLabels = {
	Municipal: 'Municipal',
	Estatal: 'estatal',
	Federal: 'Nacional',
	Internacional: 'Internacional',
}


onMounted(async () => {
	try {
		const response = await getOrganizationsByScope(props.filtersAdd)
		const data = response.data.data

		const labels = data.map(item => scopeLabels[item.scope] ?? 'Otro')
		const values = data.map(item => item.total)

		chartOptions.value = {
			...chartOptions.value,
			labels: labels,
		}

		series.value = values
	} catch (error) {
		console.error('Error al cargar organizaciones por alcance:', error)
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