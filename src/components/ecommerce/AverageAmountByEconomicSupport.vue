<template>
	<div class="rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-4 shadow-md dark:border-gray-700 dark:bg-gray-900/90 sm:p-6 lg:p-8">
		<div class="mb-4 sm:mb-6">
			<h3 class="text-lg font-semibold text-gray-600 dark:text-white sm:text-xl">Promedio de Apoyos Económicos</h3>
			<p class="mt-1 text-gray-500 text-sm dark:text-gray-400">Monto promedio de los apoyos registrados</p>

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
				{{ supportsWithAverage.length }} apoyos con promedio
			</div>
		</div>

		<div class="relative min-h-[300px] sm:min-h-[350px]">
			<div
				v-if="loading"
				class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="space-y-4 w-full max-w-sm px-4">
					<div
						v-for="i in 3"
						:key="`skeleton-${i}`"
						class="flex items-center gap-3 p-2">
						<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse flex-shrink-0" />
						<div class="flex-1">
							<div class="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1 sm:mb-2 w-3/4" />
							<div class="h-2 sm:h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/2" />
						</div>
						<div class="flex items-center gap-2 w-full max-w-[100px] sm:max-w-[140px]">
							<div class="relative w-full max-w-[60px] sm:max-w-[100px] h-2 rounded-sm bg-gray-300 dark:bg-gray-700 animate-pulse" />
							<div class="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-6 sm:w-8" />
						</div>
					</div>
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
					@click="loadData"
					class="mt-2 px-3 py-1.5 text-xs sm:text-sm bg-[#83181b] text-white rounded hover:bg-[#6a1416] transition-colors">
					Reintentar
				</button>
			</div>

			<div
				v-else-if="!hasData"
				class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg p-4">
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
				<p class="mt-2 text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base">No hay datos disponibles</p>
				<p class="text-xs text-gray-500 mt-1 text-center">No se encontraron apoyos económicos con promedio calculado</p>
			</div>

			<div
				v-else
				class="space-y-4 sm:space-y-6">
				<div
					v-for="(item, index) in supportsWithAverage"
					:key="index"
					class="flex items-center justify-between gap-2 sm:gap-4 hover:bg-gray-200/50 dark:hover:bg-gray-800/70 p-2 rounded-lg transition-colors cursor-pointer"
					@click="onSupportClick(item)">
					<div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
						<div
							class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white font-bold shadow-sm flex-shrink-0"
							:style="{
								backgroundColor: colors[index % colors.length],
								border: '2px solid ' + colors[(index + 1) % colors.length],
							}"
							:title="item.support_name">
							{{ getInitials(item.support_name) }}
						</div>

						<div class="min-w-0 flex-1">
							<p
								class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate"
								:title="item.support_name">
								{{ item.support_name }}
							</p>
							<span class="block text-gray-600 text-xs dark:text-gray-400">
								{{ formatCurrency(item.average_amount) }} • {{ item.project_count }} proyecto{{ item.project_count !== 1 ? 's' : '' }}
							</span>
						</div>
					</div>

					<div class="flex items-center gap-2 sm:gap-3 w-auto sm:w-full max-w-[100px] sm:max-w-[140px] flex-shrink-0">
						<div class="relative w-full max-w-[60px] sm:max-w-[100px] h-2 rounded-sm bg-gray-300 dark:bg-gray-700">
							<div
								class="absolute left-0 top-0 h-full rounded-sm transition-all duration-700 ease-out"
								:style="{
									width: getPercentage(item) + '%',
									backgroundColor: colors[index % colors.length],
								}" />
						</div>
						<p class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm whitespace-nowrap">
							{{ formatPercentage(item.percentage) }}%
						</p>
					</div>
				</div>

				<div
					v-if="supportsWithoutAverage.length > 0"
					class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
					<p class="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:text-sm">Sin promedio disponible:</p>
					<div class="flex flex-wrap gap-1 sm:gap-2">
						<span
							v-for="(support, index) in supportsWithoutAverage.slice(0, 5)"
							:key="`no-avg-${index}`"
							class="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
							{{ support.support_name }}
							<span
								v-if="support.project_count > 0"
								class="ml-1">
								({{ support.project_count }})
							</span>
						</span>
						<span
							v-if="supportsWithoutAverage.length > 5"
							class="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs">
							+{{ supportsWithoutAverage.length - 5 }} más
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { getAverageAmountByEconomicSupport } from '../../services/statistics/dashboard';

interface EconomicSupport {
	id?: number;
	support_name: string;
	average_amount: number | null;
	project_count: number;
	percentage?: number | string;
}

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({}),
	},
});

const averageSupports = ref<EconomicSupport[]>([]);
const loading = ref(false);
const loadError = ref<string | null>(null);

const colors = ['#83181b', '#a34245', '#c36b6f', '#e39499', '#d1a17a', '#b8ae9d'];

const getInitials = (name: string): string => {
	if (!name) return '?';
	const words = name.split(' ');
	if (words.length === 1) return name.charAt(0).toUpperCase();
	return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

const formatCurrency = (amount: number | null): string => {
	if (!amount && amount !== 0) return 'Sin datos';
	if (amount === 0) return '$0';
	return (
		'$' +
		amount.toLocaleString('es-MX', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		})
	);
};

const formatPercentage = (percentage: number | string | undefined): string => {
	if (percentage === undefined || percentage === null) return '0.0';
	if (typeof percentage === 'string') {
		const num = parseFloat(percentage);
		return isNaN(num) ? '0.0' : num.toFixed(1);
	}
	return percentage.toFixed(1);
};

const getPercentage = (item: EconomicSupport): number => {
	if (item.percentage === undefined || item.percentage === null) return 0;
	if (typeof item.percentage === 'string') {
		const num = parseFloat(item.percentage);
		return isNaN(num) ? 0 : num;
	}
	return item.percentage;
};

const supportsWithAverage = computed(() => {
	if (!averageSupports.value || !Array.isArray(averageSupports.value)) {
		return [];
	}
	return averageSupports.value
		.filter((item) => item.average_amount !== null && item.average_amount > 0)
		.sort((a, b) => {
			const aPercent = getPercentage(a);
			const bPercent = getPercentage(b);
			return bPercent - aPercent;
		});
});

const supportsWithoutAverage = computed(() => {
	if (!averageSupports.value || !Array.isArray(averageSupports.value)) {
		return [];
	}
	return averageSupports.value
		.filter((item) => item.average_amount === null || item.average_amount === 0)
		.sort((a, b) => b.project_count - a.project_count);
});

const hasData = computed(() => {
	return supportsWithAverage.value.length > 0;
});

const loadData = async () => {
	try {
		loading.value = true;
		loadError.value = null;

		const filtersToSend: any = {};

		if (props.filters.id_state && props.filters.id_state !== '' && props.filters.id_state !== 'null') {
			filtersToSend.id_state = props.filters.id_state;
		}

		if (props.filters.id_institution && props.filters.id_institution !== '' && props.filters.id_institution !== 'null') {
			filtersToSend.id_institution = props.filters.id_institution;
		}

		const response = await getAverageAmountByEconomicSupport(filtersToSend);

		let data: EconomicSupport[] = [];

		if (Array.isArray(response.data)) {
			data = response.data;
		} else if (response.data?.data && Array.isArray(response.data.data)) {
			data = response.data.data;
		} else {
			data = [];
		}

		averageSupports.value = data;

	} catch (err: any) {
		console.error('Error al cargar apoyos económicos:', err);
		loadError.value = err.message || 'Error desconocido';
		averageSupports.value = [];
	} finally {
		loading.value = false;
	}
};

const onSupportClick = (support: EconomicSupport) => {
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
	:deep(.text-sm) {
		font-size: 0.8125rem !important;
	}
}

@media (max-width: 480px) {
	:deep(.text-xs) {
		font-size: 0.75rem !important;
	}
}
</style>