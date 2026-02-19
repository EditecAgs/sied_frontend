<template>
	<div class="rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-4 shadow-md dark:border-gray-700 dark:bg-gray-900/90 sm:p-6">
		<div class="mb-4 sm:mb-6">
			<h3 class="text-lg font-semibold text-gray-600 dark:text-white sm:text-xl">Proyectos por Institución</h3>
			<p class="mt-1 text-gray-500 text-sm dark:text-gray-400">Porcentaje de Proyectos de modelo dual por institución</p>

			<div
				v-if="loading"
				class="mt-2 text-xs text-gray-500 sm:text-sm">
				Cargando datos...
			</div>
			<div
				v-else-if="loadError"
				class="mt-2 text-xs text-red-500 sm:text-sm">
				Error al cargar datos
			</div>
			<div
				v-else
				class="mt-2 text-xs text-gray-500 sm:text-sm">
				{{ dual_projects_by_institution.length }} instituciones
			</div>
		</div>

		<div class="relative min-h-[400px]">
			<div
				v-if="loading"
				class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C2131] mx-auto" />
					<p class="mt-3 text-gray-600 dark:text-gray-400 text-sm">
						Cargando datos...
					</p>
				</div>
			</div>

			<div
				v-else-if="loadError"
				class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg p-4">
				<svg
					class="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-2 text-gray-600 dark:text-gray-400 text-center text-sm">Error al cargar los datos</p>
				<button
					class="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-[#9C2131] text-white rounded hover:bg-[#7a1a27] transition-colors"
					@click="loadData">
					Reintentar
				</button>
			</div>

			<div
				v-else-if="!hasData"
				class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="text-center">
					<svg
						class="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">No hay datos disponibles</p>
				</div>
			</div>

			<div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div class="lg:col-span-2 space-y-4 sm:space-y-6">
					<div
						v-for="(item, index) in topTenInstitutions"
						:key="index"
						class="flex items-center justify-between gap-2 sm:gap-4 hover:bg-gray-200/50 dark:hover:bg-gray-800/70 p-2 rounded-lg transition-colors cursor-pointer"
						@click="onInstitutionClick(item)">
						<div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
							<img
								v-if="item.image && isValidImage(item.image)"
								:src="item.image"
								:alt="item.institution_name"
								class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-contain border border-gray-300 dark:border-gray-600 flex-shrink-0"
								@error="handleImageError" />

							<div
								v-else
								class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex-shrink-0">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 sm:h-6 sm:w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7m0 0L3 9m9 5l9-5" />
								</svg>
							</div>

							<div class="min-w-0 flex-1">
								<p
									class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate"
									:title="item.institution_name">
									{{ item.institution_name }}
								</p>
								<span class="block text-gray-600 text-xs dark:text-gray-400">
									{{ item.project_count }} Proyecto{{ item.project_count !== 1 ? 's' : '' }}
								</span>
							</div>
						</div>

						<div class="flex items-center gap-2 sm:gap-3 w-auto sm:w-full max-w-[80px] sm:max-w-[160px] flex-shrink-0">
							<div class="relative w-full max-w-[40px] sm:max-w-[110px] h-2 rounded-sm bg-gray-300 dark:bg-gray-700">
								<div
									class="absolute left-0 top-0 h-full rounded-sm transition-all duration-500 ease-out"
									:style="{
										width: item.percentage + '%',
										backgroundColor: palette[index % palette.length]
									}" />
							</div>
							<p class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm whitespace-nowrap">
								{{ formatPercentage(item.percentage) }}%
							</p>
						</div>
					</div>

					<div
						v-if="dual_projects_by_institution.length > 10"
						class="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
						<p class="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-sm">
							Mostrando las 10 con más proyectos de {{ dual_projects_by_institution.length }} instituciones
						</p>
					</div>
				</div>

				<div class="lg:col-span-1 flex flex-col items-center justify-start">
					<div class="w-full max-w-[250px] h-[250px] sm:h-[280px] mx-auto">
						<PieChart
							v-if="!loading"
							:key="chartKey"
							:data="chartData"
							:options="chartOptions" />
					</div>

					<p class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
						Distribución de proyectos
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie } from 'vue-chartjs';
import { getProjectsByIntitution } from '../../services/statistics/dashboard';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface ProjectByInstitution {
	id?: number;
	institution_name: string;
	project_count: number;
	percentage: number | string;
	image?: string | null;
}

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['loaded', 'loading', 'error']);

const PieChart = Pie;
const dual_projects_by_institution = ref<ProjectByInstitution[]>([]);
const loading = ref(false);
const loadError = ref(null);
const chartKey = ref(0);

const palette = [
	'#9C2131', '#C9A236', '#3A4A5F', '#707070', '#C4C4C4',
	'#6B7280', '#B45309', '#9CA3AF', '#7C3AED', '#0891B2',
	'#65A30D', '#EA580C', '#BE123C', '#0F766E', '#4338CA'
];

const isValidImage = (src: string | null): boolean => {
	if (!src) return false;
	return src.startsWith('data:image/') || src.startsWith('http') || src.startsWith('/');
};

const handleImageError = (event: Event) => {
	const img = event.target as HTMLImageElement;
	img.style.display = 'none';
};

const formatPercentage = (percentage: number | string): string => {
	if (typeof percentage === 'string') {
		const num = parseFloat(percentage);
		return isNaN(num) ? '0.0' : num.toFixed(1);
	}
	return percentage.toFixed(1);
};

const hasData = computed(() => {
	return dual_projects_by_institution.value.length > 0;
});

const topTenInstitutions = computed(() => {
	return dual_projects_by_institution.value
		.sort((a, b) => b.project_count - a.project_count)
		.slice(0, 10)
		.map((item) => ({
			...item,
			percentage: typeof item.percentage === 'string' ? parseFloat(item.percentage) : item.percentage,
		}));
});

const chartData = computed(() => ({
	labels: topTenInstitutions.value.map(i =>
		i.institution_name.length > 20
			? i.institution_name.substring(0, 18) + '...'
			: i.institution_name
	),
	datasets: [
		{
			data: topTenInstitutions.value.map(i => i.project_count),
			backgroundColor: topTenInstitutions.value.map((_, index) =>
				palette[index % palette.length]
			),
			borderWidth: 1,
			borderColor: '#fff'
		}
	]
}));

const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			callbacks: {
				label(context: any) {
					const value = context.parsed;
					const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
					const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
					const label = context.label || '';
					return `${label}: ${value} proyectos (${percentage}%)`;
				}
			}
		}
	}
}));

const onInstitutionClick = (institution: ProjectByInstitution) => {
	console.log('Institución seleccionada:', institution);
};

const loadData = async () => {
	try {
		loading.value = true;
		loadError.value = null;
		emit('loading', true);

		const response = await getProjectsByIntitution(props.filters);

		let items: ProjectByInstitution[] = [];

		if (Array.isArray(response.data)) {
			items = response.data;
		} else if (response.data && Array.isArray(response.data.data)) {
			items = response.data.data;
		} else {
			items = response.data;
		}

		items.sort((a, b) => b.project_count - a.project_count);

		dual_projects_by_institution.value = items;

		await nextTick();
		chartKey.value++;

		emit('loaded');
	} catch (err) {
		console.error('Error al cargar proyectos por institución:', err);
		loadError.value = err.message || 'Error desconocido';
		dual_projects_by_institution.value = [];
		emit('error', err);
	} finally {
		loading.value = false;
		emit('loading', false);
	}
};

onMounted(() => {
	loadData();
});

watch(
	() => props.filters,
	() => {
		loadData();
	},
	{ deep: true }
);
</script>

<style scoped>
@media (max-width: 640px) {
	:deep(p) {
		font-size: 0.875rem !important;
	}
}

@media (max-width: 480px) {
	:deep(p) {
		font-size: 0.8125rem !important;
	}
}

/* Animación del spinner */
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