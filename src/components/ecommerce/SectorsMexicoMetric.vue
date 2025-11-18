<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 p-6 shadow-sm dark:border-gray-700"
		style="background: linear-gradient(to top, rgba(211, 211, 210, 0.8) 30%, rgba(159, 129, 60, 0.8) 100%);">

		<h3 class="text-xl font-semibold text-stone-50 dark:text-gray-100 mb-6 text-center">
			Proyectos por Sectores del Plan México
		</h3>

		<div class="max-w-full overflow-x-auto custom-scrollbar" v-if="projects_by_sector_mexico.length > 0">
			<div class="min-w-[500px] flex justify-center">
				<PieChart :data="chartData" :options="chartOptions" />
			</div>
		</div>

		<p v-else class="text-center text-gray-500 dark:text-gray-400">
			No hay datos disponibles para mostrar
		</p>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { getProjectsBySectorMexico } from '../../services/statistics/dashboard'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const projects_by_sector_mexico = ref([])

const PieChart = Pie

const palette = [
	'#9C2131', '#C9A236', '#3A4A5F', '#707070', '#C4C4C4',
	'#6B7280', '#B45309', '#9CA3AF', '#7C3AED', '#0891B2',
	'#65A30D', '#EA580C', '#BE123C', '#0F766E', '#4338CA',
	'#B45309', '#6B21A8', '#0369A1', '#059669', '#DC2626',
	'#1F2937', '#7DD3FC', '#FDE68A', '#BBF7D0', '#FECACA'
]

const chartData = computed(() => ({
	labels: projects_by_sector_mexico.value.map(item => item.sector_name),
	datasets: [
		{
			label: 'Número de Proyectos',
			data: projects_by_sector_mexico.value.map(item => item.project_count),
			backgroundColor: projects_by_sector_mexico.value.map((_, index) =>
				palette[index % palette.length]
			),
			borderWidth: 2,
			borderColor: '#fff'
		}
	]
}))

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'right',
			labels: {
				color: '#374151',
				font: {
					size: 11,
					family: "'Outfit', sans-serif"
				},
				padding: 10,
				usePointStyle: true,
				pointStyle: 'circle',
				generateLabels: function(chart) {
					const original = ChartJS.overrides.pie.plugins.legend.labels.generateLabels;
					const labels = original.call(this, chart);

					return labels.map(label => ({
						...label,
						hidden: false
					}));
				}
			},

		},
		tooltip: {
			callbacks: {
				label: function(context) {
					const label = context.label || '';
					const value = context.parsed;
					const total = context.dataset.data.reduce((a, b) => a + b, 0);
					const percentage = ((value / total) * 100).toFixed(1);
					return `${label}: ${value} (${percentage}%)`;
				}
			}
		}
	}
}

const fetchAllData = async () => {
	try {
		const response = await getProjectsBySectorMexico()
		const result = response.data

		projects_by_sector_mexico.value = result.data

		console.log('Total de registros recibidos:', result.data.length)
		console.log('Datos recibidos:', result.data)

	} catch (error) {
		console.error('Error al cargar sectores de México:', error)
	}
}

onMounted(() => {
	fetchAllData()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 8px;
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

.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: #c5c5c5 #f1f1f1;
}

</style>