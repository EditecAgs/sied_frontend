<template>
	<div
		class="rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50
               p-4 shadow-md dark:border-gray-700 dark:bg-gray-900/90 sm:p-6 lg:p-8">
		<div class="mb-4 sm:mb-6">
			<h3 class="text-lg font-semibold text-gray-600 dark:text-white sm:text-xl">
				Proyectos por Tipo de Educación Dual
			</h3>
			<p class="mt-1 text-gray-500 text-sm dark:text-gray-400">
				Distribución de proyectos según el tipo de educación dual registrada
			</p>

			<div v-if="loading" class="mt-2 text-xs text-gray-500 sm:text-sm">
				Cargando datos...
			</div>
			<div v-else-if="loadError" class="mt-2 text-xs text-red-500 sm:text-sm">
				Error al cargar datos
			</div>
			<div v-else class="mt-2 text-xs text-gray-500 sm:text-sm">
				{{ filteredData.length }} tipos de educación dual
			</div>
		</div>

		<div class="relative min-h-[300px] sm:min-h-[350px]">
			<div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#83181b] mx-auto" />
					<p class="mt-3 text-gray-600 dark:text-gray-400 text-sm">Cargando datos...</p>
				</div>
			</div>

			<div v-else-if="loadError" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg p-4">
				<svg class="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-3 text-gray-600 dark:text-gray-400 text-center text-sm">Error al cargar los datos</p>
				<button
					class="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-[#83181b] text-white rounded hover:bg-[#6a1416] transition-colors"
					@click="loadData">
					Reintentar
				</button>
			</div>

			<div v-else-if="!hasData" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg p-4">
				<svg class="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-3 text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base">No hay datos disponibles</p>
				<p class="text-xs text-gray-500 mt-1 text-center">No se encontraron proyectos por tipo de educación dual</p>
			</div>

			<div v-else class="space-y-4 sm:space-y-6">
				<div class="flex justify-center">
					<Chart
						:key="chartKey"
						type="polarArea"
						:data="chartData"
						:options="chartOptions"
						class="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px]" />
				</div>

				<div class="mt-4 sm:mt-6 space-y-6">
					<!-- Primeros 3 registros con degradado vino -->
					<div class="space-y-3">
						<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
							Principales Tipos de Educación Dual
						</h4>
						<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
							<div
								v-for="(item, index) in topThreeTypes"
								:key="item.id"
								class="flex items-center gap-2 p-3 rounded-lg transition-all cursor-pointer sm:gap-3"
								:title="`${item.dual_type}: ${item.total} proyectos`"
								:style="{
									background: 'linear-gradient(135deg, #83181b 0%, #a34245 100%)',
									boxShadow: '0 2px 4px rgba(131, 24, 27, 0.2)'
								}"
								@mouseenter="hoveredWineItem = index"
								@mouseleave="hoveredWineItem = null"
								@click="onTypeClick(item)">
								<div
									class="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white shadow-md sm:w-6 sm:h-6"
									:style="{
										backgroundColor: wineColors[index % wineColors.length],
										transform: hoveredWineItem === index ? 'scale(1.1)' : 'scale(1)',
										transition: 'transform 0.2s ease'
									}" />
								<div class="min-w-0 flex-1">
									<p class="text-white text-xs font-semibold truncate sm:text-sm">
										{{ item.dual_type }}
									</p>
									<div class="flex items-center justify-between mt-1 sm:mt-1.5">
										<span class="text-xs text-white/90">
											{{ item.total }} proyecto{{ item.total !== 1 ? 's' : '' }}
										</span>
										<span
											class="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white sm:px-2.5"
											:style="{
												backgroundColor: wineColors[index % wineColors.length] + '40',
												color: 'white'
											}">
											{{ getPercentage(item.total) }}%
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Registros restantes (a partir del 4to) con sección "Alternativas duales" y degradado azul -->
					<div v-if="alternativeTypes.length > 0" class="space-y-3">
						<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
							<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
								Alternativas duales
							</h4>
							<span class="text-xs text-gray-500 dark:text-gray-400">
								{{ alternativeTypes.length }} opciones
							</span>
						</div>
						<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
							<div
								v-for="(item, index) in alternativeTypes"
								:key="item.id"
								class="flex items-center gap-2 p-3 rounded-lg transition-all cursor-pointer sm:gap-3"
								:title="`${item.dual_type}: ${item.total} proyectos`"
								:style="{
									background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
									boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)'
								}"
								@mouseenter="hoveredBlueItem = index"
								@mouseleave="hoveredBlueItem = null"
								@click="onTypeClick(item)">
								<div
									class="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white shadow-md sm:w-6 sm:h-6"
									:style="{
										backgroundColor: blueColors[index % blueColors.length],
										transform: hoveredBlueItem === index ? 'scale(1.1)' : 'scale(1)',
										transition: 'transform 0.2s ease'
									}" />
								<div class="min-w-0 flex-1">
									<p class="text-white text-xs font-semibold truncate sm:text-sm">
										{{ item.dual_type }}
									</p>
									<div class="flex items-center justify-between mt-1 sm:mt-1.5">
										<span class="text-xs text-white/90">
											{{ item.total }} proyecto{{ item.total !== 1 ? 's' : '' }}
										</span>
										<span
											class="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white sm:px-2.5"
											:style="{
												backgroundColor: blueColors[index % blueColors.length] + '40',
												color: 'white'
											}">
											{{ getPercentage(item.total) }}%
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="typesWithZeroProjects.length > 0" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 sm:mt-4 sm:pt-4">
					<p class="text-xs text-gray-500 dark:text-gray-400 mb-1 sm:text-sm sm:mb-2">Tipos sin proyectos:</p>
					<div class="flex flex-wrap gap-1 sm:gap-2">
						<span
							v-for="type in typesWithZeroProjects.slice(0, 4)"
							:key="`zero-${type.id}`"
							class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:px-3 sm:py-1">
							{{ type.dual_type }}
						</span>
						<span
							v-if="typesWithZeroProjects.length > 4"
							class="px-2 py-0.5 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs sm:px-3 sm:py-1">
							+{{ typesWithZeroProjects.length - 4 }} más
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import Chart from 'primevue/chart'
import { getProjectsByDualType } from '../../services/statistics/dashboard'

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({})
	}
})

const emit = defineEmits(['loaded', 'loading', 'error'])

const dualTypesData = ref([])
const loading = ref(false)
const loadError = ref(null)
const chartKey = ref(0)
const isMounted = ref(false)
const hoveredWineItem = ref(null)
const hoveredBlueItem = ref(null)

const wineColors = [
	'#83181b', '#9c2131', '#b52947'
]

const blueColors = [
	'#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd',
	'#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'
]


const topThreeTypes = computed(() => {
	return filteredData.value.slice(0, 3)
})

const alternativeTypes = computed(() => {
	return filteredData.value.slice(3)
})

const filteredData = computed(() => {
	return dualTypesData.value
		.filter(item => item.total > 0)
		.sort((a, b) => b.total - a.total)
})

const typesWithZeroProjects = computed(() => {
	return dualTypesData.value
		.filter(item => item.total === 0)
		.sort((a, b) => a.dual_type.localeCompare(b.dual_type))
})

const totalProjects = computed(() => {
	return filteredData.value.reduce((sum, item) => sum + item.total, 0)
})

const hasData = computed(() => {
	return filteredData.value.length > 0
})

const getPercentage = (value) => {
	if (totalProjects.value === 0) return 0
	return Math.round((value / totalProjects.value) * 100)
}

const chartData = computed(() => ({
	labels: filteredData.value.map(item => {
		const name = item.dual_type
		if (typeof window !== 'undefined') {
			return window.innerWidth < 640 && name.length > 12
				? name.substring(0, 9) + '...'
				: window.innerWidth < 768 && name.length > 15
					? name.substring(0, 12) + '...'
					: name
		}
		return name.length > 15 ? name.substring(0, 12) + '...' : name
	}),
	datasets: [
		{
			label: 'Proyectos por tipo de educación dual',
			data: filteredData.value.map(item => item.total),
			backgroundColor: filteredData.value.map((_, index) => {
				return index < 3 ? wineColors[index % wineColors.length] : blueColors[(index - 3) % blueColors.length]
			}),
			borderWidth: typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 2,
			borderColor: '#ffffff',
			hoverBorderWidth: typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 3,
			hoverBorderColor: '#374151'
		},
	],
}))

const chartOptions = ref({
	responsive: true,
	maintainAspectRatio: true,
	aspectRatio: 1,
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			callbacks: {
				label: function(context) {
					const label = context.label || ''
					const value = context.parsed.r
					const total = context.dataset.data.reduce((a, b) => a + b, 0)
					const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
					return `${label}: ${value} proyectos (${percentage}%)`
				}
			},
			backgroundColor: 'rgba(0, 0, 0, 0.7)',
			titleColor: '#fff',
			bodyColor: '#fff',
			titleFont: {
				size: typeof window !== 'undefined' && window.innerWidth < 640 ? 11 : 12
			},
			bodyFont: {
				size: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 11
			},
			padding: typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 10
		}
	},
	scales: {
		r: {
			grid: {
				color: '#d3d3d3',
				circular: true
			},
			ticks: {
				color: '#888',
				backdropColor: 'transparent',
				display: false
			},
			pointLabels: {
				display: false
			},
			beginAtZero: true
		},
	},
	onClick: (event, elements) => {
		if (elements.length > 0) {
			const index = elements[0].index
			const type = filteredData.value[index]
			onTypeClick(type)
		}
	}
})

const loadData = async () => {
	try {
		loading.value = true
		loadError.value = null
		emit('loading', true)

		const response = await getProjectsByDualType(props.filters)

		if (Array.isArray(response)) {
			dualTypesData.value = response
		}
		else if (response && Array.isArray(response.data)) {
			dualTypesData.value = response.data
		}
		else if (response && response.data && Array.isArray(response.data.data)) {
			dualTypesData.value = response.data.data
		}
		else {
			dualTypesData.value = response || []
		}

		console.log('Datos de proyectos por tipo dual cargados:', {
			totalTipos: dualTypesData.value.length,
			tiposConProyectos: filteredData.value.length,
			primeros3: topThreeTypes.value.length,
			alternativas: alternativeTypes.value.length,
			tiposSinProyectos: typesWithZeroProjects.value.length,
			totalProyectos: totalProjects.value
		})

		await nextTick()
		chartKey.value++

		emit('loaded')
	} catch (err) {
		console.error('Error al obtener proyectos por tipo dual:', err)
		loadError.value = err
		dualTypesData.value = []
		emit('error', err)
	} finally {
		loading.value = false
		emit('loading', false)
	}
}

const onTypeClick = (type) => {
	console.log('Tipo de educación dual seleccionado:', type)
}

onMounted(async () => {
	isMounted.value = true
	await loadData()
})

watch(() => props.filters, () => {
	loadData()
}, { deep: true })
</script>

<style scoped>
@media (max-width: 640px) {
	:deep(.p-chart) {
		max-height: 250px !important;
	}
}

@media (max-width: 480px) {
	:deep(canvas) {
		height: 220px !important;
		width: 220px !important;
	}
}

/* Efectos hover mejorados */
.hover-lift {
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>