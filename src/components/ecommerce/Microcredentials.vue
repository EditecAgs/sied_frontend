<template>
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-900/90 sm:p-8">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">
				Credenciales en Proyectos Duales
			</h3>
			<div class="text-sm text-gray-500 dark:text-gray-400">
				Total proyectos: {{ totalProjects }}
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			<div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full" style="background-color: #9C2131" />
						<h4 class="font-medium text-gray-700 dark:text-gray-300">Microcredenciales</h4>
					</div>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">{{ microStats.total_micro_credentials }}</span>
				</div>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div>
						<p class="text-gray-500 dark:text-gray-400">Proyectos con microcredenciales</p>
						<p class="font-semibold text-gray-900 dark:text-white">{{ microStats.projects_with_micro_credentials }}</p>
					</div>
					<div>
						<p class="text-gray-500 dark:text-gray-400">Promedio</p>
						<p class="font-semibold text-gray-900 dark:text-white">{{ microStats.average_per_project }}</p>
					</div>
				</div>
			</div>

			<div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full" style="background-color: #C9A236" />
						<h4 class="font-medium text-gray-700 dark:text-gray-300">Certificaciones</h4>
					</div>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">{{ certStats.total_certifications }}</span>
				</div>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div>
						<p class="text-gray-500 dark:text-gray-400">Proyectos con certificaciones</p>
						<p class="font-semibold text-gray-900 dark:text-white">{{ certStats.projects_with_certifications }}</p>
					</div>
					<div>
						<p class="text-gray-500 dark:text-gray-400">Promedio</p>
						<p class="font-semibold text-gray-900 dark:text-white">{{ certStats.average_per_project }}</p>
					</div>
				</div>
			</div>

			<div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full" style="background-color: #3A4A5F" />
						<h4 class="font-medium text-gray-700 dark:text-gray-300">Diplomas</h4>
					</div>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">{{ diplomaStats.total_diplomas }}</span>
				</div>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div>
						<p class="text-gray-500 dark:text-gray-400">Proyectos con diplomas</p>
						<p class="font-semibold text-gray-900 dark:text-white">{{ diplomaStats.projects_with_diplomas }}</p>
					</div>
					<div>
						<p class="text-gray-500 dark:text-gray-400">Promedio</p>
						<p class="font-semibold text-gray-900 dark:text-white">{{ diplomaStats.average_per_project }}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
			<div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
				<h5 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">Microcredenciales</h5>
				<div class="h-48">
					<VueApexCharts
						type="donut"
						height="180"
						:options="getDonutOptions('Microcredenciales', '#9C2131')"
						:series="[microStats.projects_with_micro_credentials, microStats.projects_without_micro_credentials]" />
				</div>
				<div class="flex justify-center gap-4 text-xs mt-2">
					<div class="flex items-center gap-1">
						<div class="w-2 h-2 rounded-full" style="background-color: #9C2131" />
						<span class="text-gray-600 dark:text-gray-400">Con: {{ microStats.projects_with_micro_credentials }}</span>
					</div>
					<div class="flex items-center gap-1">
						<div class="w-2 h-2 rounded-full" style="background-color: #C4C4C4" />
						<span class="text-gray-600 dark:text-gray-400">Sin: {{ microStats.projects_without_micro_credentials }}</span>
					</div>
				</div>
			</div>

			<div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
				<h5 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">Certificaciones</h5>
				<div class="h-48">
					<VueApexCharts
						type="donut"
						height="180"
						:options="getDonutOptions('Certificaciones', '#C9A236')"
						:series="[certStats.projects_with_certifications, certStats.projects_without_certifications]" />
				</div>
				<div class="flex justify-center gap-4 text-xs mt-2">
					<div class="flex items-center gap-1">
						<div class="w-2 h-2 rounded-full" style="background-color: #C9A236" />
						<span class="text-gray-600 dark:text-gray-400">Con: {{ certStats.projects_with_certifications }}</span>
					</div>
					<div class="flex items-center gap-1">
						<div class="w-2 h-2 rounded-full" style="background-color: #C4C4C4" />
						<span class="text-gray-600 dark:text-gray-400">Sin: {{ certStats.projects_without_certifications }}</span>
					</div>
				</div>
			</div>

			<div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
				<h5 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">Diplomas</h5>
				<div class="h-48">
					<VueApexCharts
						type="donut"
						height="180"
						:options="getDonutOptions('Diplomas', '#3A4A5F')"
						:series="[diplomaStats.projects_with_diplomas, diplomaStats.projects_without_diplomas]" />
				</div>
				<div class="flex justify-center gap-4 text-xs mt-2">
					<div class="flex items-center gap-1">
						<div class="w-2 h-2 rounded-full" style="background-color: #3A4A5F" />
						<span class="text-gray-600 dark:text-gray-400">Con: {{ diplomaStats.projects_with_diplomas }}</span>
					</div>
					<div class="flex items-center gap-1">
						<div class="w-2 h-2 rounded-full" style="background-color: #C4C4C4" />
						<span class="text-gray-600 dark:text-gray-400">Sin: {{ diplomaStats.projects_without_diplomas }}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-sm">
			<h5 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Comparativa de Credenciales</h5>
			<div class="max-w-full overflow-x-auto">
				<div id="credentialsChart" class="min-w-[500px]">
					<VueApexCharts
						type="bar"
						height="250"
						:options="barChartOptions"
						:series="barSeries" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { getAllCredentialsStats } from '../../services/statistics/dashboard'

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded'])

const microStats = ref({
	total_micro_credentials: 0,
	total_projects: 0,
	projects_with_micro_credentials: 0,
	projects_without_micro_credentials: 0,
	average_per_project: 0
})

const certStats = ref({
	total_certifications: 0,
	total_projects: 0,
	projects_with_certifications: 0,
	projects_without_certifications: 0,
	average_per_project: 0
})

const diplomaStats = ref({
	total_diplomas: 0,
	total_projects: 0,
	projects_with_diplomas: 0,
	projects_without_diplomas: 0,
	average_per_project: 0
})

const loading = ref(false)

const totalProjects = computed(() => microStats.value.total_projects)

const getDonutOptions = (title, color) => ({
	chart: {
		type: 'donut',
		fontFamily: 'Outfit, sans-serif',
		background: 'transparent',
		sparkline: { enabled: true }
	},
	colors: [color, '#C4C4C4'],
	labels: ['Con', 'Sin'],
	dataLabels: { enabled: false },
	legend: { show: false },
	plotOptions: {
		pie: {
			donut: {
				size: '70%',
				labels: {
					show: true,
					name: { show: false },
					value: {
						show: true,
						fontSize: '14px',
						fontWeight: 600,
						color: '#374151',
						offsetY: 5
					},
					total: { show: false }
				}
			}
		}
	},
	stroke: { width: 2, colors: ['#ffffff'] },
	tooltip: {
		y: {
			formatter: (val) => `${val} proyectos`
		}
	}
})

const barChartOptions = ref({
	chart: {
		type: 'bar',
		fontFamily: 'Outfit, sans-serif',
		toolbar: { show: false },
		foreColor: '#374151',
		background: 'transparent',
	},
	colors: ['#9C2131', '#C9A236', '#3A4A5F', '#707070'],
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '55%',
			borderRadius: 6,
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
		categories: ['Microcredenciales', 'Certificaciones', 'Diplomas'],
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
		title: { text: 'Cantidad' },
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
		y: { formatter: val => val.toString() },
	},
	legend: {
		show: true,
		position: 'top',
		horizontalAlign: 'center',
		fontFamily: 'Outfit',
		markers: { radius: 99 },
		labels: { colors: '#374151', fontWeight: 600 },
	},
})

const barSeries = computed(() => [
	{
		name: 'Total',
		data: [
			microStats.value.total_micro_credentials,
			certStats.value.total_certifications,
			diplomaStats.value.total_diplomas
		]
	},
	{
		name: 'Proyectos con',
		data: [
			microStats.value.projects_with_micro_credentials,
			certStats.value.projects_with_certifications,
			diplomaStats.value.projects_with_diplomas
		]
	},
	{
		name: 'Promedio x proyecto',
		data: [
			microStats.value.average_per_project,
			certStats.value.average_per_project,
			diplomaStats.value.average_per_project
		]
	}
])

const loadData = async () => {
	try {
		loading.value = true

		const response = await getAllCredentialsStats(props.filters)

		microStats.value = response.microCredentials
		certStats.value = response.certifications
		diplomaStats.value = response.diplomas

		emit('loaded')
	} catch (error) {
		console.error('Error al cargar estadísticas de credenciales:', error)
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