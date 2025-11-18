<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 p-6 shadow-sm dark:border-gray-700"
		style="background: linear-gradient(to top, rgba(211, 211, 210, 0.8) 30%, rgba(159, 129, 60, 0.8) 100%);">

		<h3 class="text-xl font-semibold text-stone-50 dark:text-gray-100 mb-6 text-center">
			Organizaciones por Cámaras Locales
		</h3>

		<div class="w-full" v-if="filteredLocalClusters.length > 0">
			<div class="relative h-80 md:h-96 lg:h-108">
				<BarChart :data="chartData" :options="chartOptions" />
			</div>
		</div>

		<p v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
			No hay datos disponibles para mostrar
		</p>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { getOrganizationsByCluster } from '../../services/statistics/dashboard'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const localClusters = ref([])

const BarChart = Bar

const palette = [
	'#9C2131', '#C9A236', '#3A4A5F', '#707070', '#C4C4C4',
	'#6B7280', '#B45309', '#9CA3AF', '#7C3AED', '#0891B2',
	'#65A30D', '#EA580C', '#BE123C', '#0F766E', '#4338CA'
]

const filteredLocalClusters = computed(() => {
	return localClusters.value
		.filter(item => item.organization_count > 0)
		.sort((a, b) => b.organization_count - a.organization_count)
		.slice(0, 5)
})

const chartData = computed(() => ({
	labels: filteredLocalClusters.value.map(item => {
		const name = item.cluster_name;
		if (name.length > 40) {
			return name.substring(0, 40) + '...';
		}
		return name;
	}),
	datasets: [
		{
			label: 'Número de Organizaciones',
			data: filteredLocalClusters.value.map(item => item.organization_count),
			backgroundColor: filteredLocalClusters.value.map((_, index) =>
				palette[index % palette.length]
			),
			borderWidth: 2,
			borderColor: '#fff',
			borderRadius: 4,
			barPercentage: 0.7,
			categoryPercentage: 0.8
		}
	]
}))

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			callbacks: {
				title: function(context) {
					const index = context[0].dataIndex;
					return filteredLocalClusters.value[index]?.cluster_name || '';
				},
				label: function(context) {
					const value = context.parsed.y;
					return `Organizaciones: ${value}`;
				}
			},
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			titleFont: {
				size: 12,
				family: "'Outfit', sans-serif"
			},
			bodyFont: {
				size: 11,
				family: "'Outfit', sans-serif"
			},
			padding: 10
		}
	},
	scales: {
		y: {
			beginAtZero: true,
			title: {
				display: true,
				text: 'Número de Organizaciones',
				color: '#374151',
				font: {
					size: 12,
					family: "'Outfit', sans-serif",
					weight: 'bold'
				},
				padding: { top: 0, bottom: 10 }
			},
			ticks: {
				color: '#374151',
				font: {
					size: 11,
					family: "'Outfit', sans-serif"
				},
				stepSize: 1,
				padding: 5
			},
			grid: {
				color: 'rgba(255, 255, 255, 0.3)',
				drawBorder: false
			}
		},
		x: {
			title: {
				display: false
			},
			ticks: {
				color: '#374151',
				font: {
					size: 10,
					family: "'Outfit', sans-serif",
					weight: '500'
				},
				maxRotation: 45,
				minRotation: 0,
				autoSkip: true,
				autoSkipPadding: 10,
				padding: 8
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
	}
}

const fetchData = async () => {
	try {
		const response = await getOrganizationsByCluster()
		const result = response.data

		localClusters.value = result.data.locales || []

		console.log('Cámaras locales recibidas:', localClusters.value.length)
		console.log('Cámaras locales filtradas:', filteredLocalClusters.value.length)
		console.log('Datos de cámaras locales filtradas:', filteredLocalClusters.value)

	} catch (error) {
		console.error('Error al cargar cámaras locales:', error)
	}
}

onMounted(() => {
	fetchData()
})
</script>

<style scoped>
@media (max-width: 768px) {
	:deep(.chartjs-render-monitor) {
		transform: scale(0.9);
		transform-origin: center;
	}
}

@media (max-width: 640px) {
	:deep(.chartjs-render-monitor) {
		transform: scale(0.8);
		transform-origin: center;
	}
}
</style>