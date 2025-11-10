<template>
	<div
		class="rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50
               p-6 sm:p-8 shadow-md dark:border-gray-700 dark:bg-gray-900/90">
		<div class="mb-6">
			<h3 class="text-lg font-semibold text-gray-600 dark:text-white">
				Proyectos por tipo de actividad dual
			</h3>
			<p class="mt-1 text-gray-500 text-sm dark:text-gray-400">
				Distribución de proyectos según el tipo de actividad dual registrada
			</p>
		</div>

		<div class="flex justify-center">
			<Chart
				type="polarArea"
				:data="chartData"
				:options="chartOptions"
				class="w-full max-w-[420px]" />
		</div>

		<div class="mt-6 space-y-3">
			<div
				v-for="(item, index) in chartData.labels"
				:key="index"
				class="flex items-center gap-3">
				<div
					class="w-4 h-4 rounded-full"
					:style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }" />
				<p class="text-gray-700 dark:text-gray-300 text-sm font-medium">
					{{ item }}:
					<span class="font-semibold text-gray-900 dark:text-white">
						{{ chartData.datasets[0].data[index] }}
					</span>
				</p>
			</div>
		</div>

		<div
			v-if="!chartData || chartData.datasets[0].data.length === 0"
			class="text-center py-4 text-gray-500 dark:text-gray-400">
			No hay datos disponibles
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import { getProjectsByDualType } from '../../services/statistics/dashboard'
import { useLoaderNotifier } from '../../composables/useLoaderNotifier'

const { notifyLoaded } = useLoaderNotifier()

const chartData = ref({
	datasets: [{ data: [], backgroundColor: [] }],
	labels: [],
})

const chartOptions = ref({
	plugins: {
		legend: {
			display: false, 
		},
	},
	scales: {
		r: {
			grid: { color: '#d3d3d3' },
			ticks: { color: '#888', backdropColor: 'transparent' },
		},
	},
})

const colors = ['#83181b', '#a34245', '#c36b6f', '#e39499']

onMounted(async () => {
	try {
		const response = await getProjectsByDualType()
		const data = response.data.data || []

		chartData.value = {
			labels: data.map((item) => item.dual_type),
			datasets: [
				{
					label: 'Proyectos por tipo dual',
					data: data.map((item) => item.total),
					backgroundColor: colors.slice(0, data.length),
					borderWidth: 2,
					borderColor: '#fff',
				},
			],
		}
	} catch (error) {
		console.error('Error al obtener proyectos por tipo dual:', error)
	} finally {
		notifyLoaded()
	}
})
</script>
