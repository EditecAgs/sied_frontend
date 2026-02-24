<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-900/90 sm:p-8">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">
				Estado de Proyectos
			</h3>
			<div class="text-sm text-gray-500 dark:text-gray-400">
				Total proyectos: {{ totalProjects }}
			</div>
		</div>

		<!-- Estado de carga -->
		<div v-if="loading" class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C2131]" />
		</div>

		<!-- Contenido principal -->
		<div v-else-if="hasData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Gráfica de pastel -->
			<div class="flex flex-col items-center justify-center">
				<div class="w-full max-w-[280px] h-[280px] mx-auto">
					<PieChart
						v-if="!loading"
						:key="chartKey"
						:data="chartData"
						:options="chartOptions" />
				</div>
			</div>

			<!-- Leyenda y estadísticas -->
			<div class="flex flex-col justify-center space-y-4">
				<div
					v-for="(item, index) in chartData.datasets[0].data"
					:key="index"
					class="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
					<div class="flex items-center gap-3">
						<div
							class="w-4 h-4 rounded-full"
							:style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }" />
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
							{{ chartData.labels[index] }}
						</span>
					</div>
					<div class="flex items-center gap-4">
						<span class="text-sm text-gray-600 dark:text-gray-400">
							{{ statusData[index].count }} proyectos
						</span>
						<span class="text-sm font-semibold text-gray-900 dark:text-white min-w-[50px] text-right">
							{{ statusData[index].percentage }}%
						</span>
					</div>
				</div>

				<!-- Resumen -->
				<div class="mt-4 p-4 bg-[#9C2131]/10 dark:bg-[#9C2131]/20 rounded-lg">
					<p class="text-sm text-gray-700 dark:text-gray-300 text-center">
						<span class="font-semibold">{{ statusConcluidos }} proyectos</span> concluidos
						y <span class="font-semibold">{{ statusEnProceso }} proyectos</span> en proceso
					</p>
				</div>
			</div>
		</div>

		<!-- Sin datos -->
		<div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
			No hay datos disponibles
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { getProjectsByStatus } from '../../services/statistics/dashboard'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const PieChart = Pie

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded'])

// Paleta de colores (usando los mismos colores)
const colors = ['#9C2131', '#C9A236', '#3A4A5F', '#707070']

const statusData = ref([])
const loading = ref(false)
const chartKey = ref(0)

const totalProjects = computed(() => {
	return statusData.value.reduce((sum, item) => sum + item.count, 0)
})

const hasData = computed(() => {
	return statusData.value.length > 0 && totalProjects.value > 0
})

const statusConcluidos = computed(() => {
	const item = statusData.value.find(s => s.status_key === 'concluded')
	return item ? item.count : 0
})

const statusEnProceso = computed(() => {
	const item = statusData.value.find(s => s.status_key === 'in_progress')
	return item ? item.count : 0
})

// Datos para la gráfica
const chartData = computed(() => {
	// Filtramos solo estados con count > 0 para la gráfica
	const activeStatuses = statusData.value.filter(item => item.count > 0)

	if (activeStatuses.length === 0) {
		return {
			labels: ['Sin datos'],
			datasets: [{
				data: [1],
				backgroundColor: ['#C4C4C4'],
				borderWidth: 1,
				borderColor: '#fff'
			}]
		}
	}

	return {
		labels: activeStatuses.map(item => item.status),
		datasets: [
			{
				data: activeStatuses.map(item => item.count),
				backgroundColor: activeStatuses.map((_, index) => colors[index % colors.length]),
				borderWidth: 2,
				borderColor: '#ffffff'
			}
		]
	}
})

// Opciones de la gráfica
const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false, // Ocultamos la leyenda porque ya tenemos nuestra propia
		},
		tooltip: {
			callbacks: {
				label: (context) => {
					const value = context.parsed
					const total = context.dataset.data.reduce((a, b) => a + b, 0)
					const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
					const label = context.label || ''
					return `${label}: ${value} proyectos (${percentage}%)`
				}
			}
		}
	},
	cutout: '60%', // Para hacer un efecto donut (opcional)
}))

const loadData = async () => {
	try {
		loading.value = true
		const response = await getProjectsByStatus(props.filters)

		// La API devuelve directamente el array
		statusData.value = response.data

		await nextTick()
		chartKey.value++

		emit('loaded')
	} catch (error) {
		console.error('Error al cargar estados de proyectos:', error)
		statusData.value = []
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	loadData()
})

watch(() => props.filters, () => {
	loadData()
}, { deep: true })
</script>

<style scoped>
@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}
</style>