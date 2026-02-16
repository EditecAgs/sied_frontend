<template>
	<div class="rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-4 shadow-md dark:border-gray-700 dark:bg-gray-900/90 sm:p-6 lg:p-8">
		<div class="mb-4 sm:mb-6">
			<h3 class="text-lg font-semibold text-gray-600 dark:text-white sm:text-xl">
				Tipos de Beneficio
			</h3>
			<p class="mt-1 text-gray-500 text-sm dark:text-gray-400">
				Uso de beneficios en proyectos y promedio registrado
			</p>

			<div v-if="loading" class="mt-2 text-xs text-gray-500">
				Cargando datos...
			</div>
			<div v-else-if="loadError" class="mt-2 text-xs text-red-500">
				Error al cargar datos
			</div>
			<div v-else class="mt-2 text-xs text-gray-500">
				{{ benefits.length }} tipos de beneficio
			</div>
		</div>

		<div class="relative min-h-[300px]">
			<!-- Skeleton -->
			<div
				v-if="loading"
				class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<div class="space-y-4 w-full max-w-sm px-4">
					<div
						v-for="i in 3"
						:key="i"
						class="flex items-center gap-3 p-2">
						<div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
						<div class="flex-1">
							<div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4" />
							<div class="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/2" />
						</div>
					</div>
				</div>
			</div>

			<!-- Empty -->
			<div
				v-else-if="!hasData"
				class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
				<p class="text-sm text-gray-500">No hay datos disponibles</p>
			</div>

			<!-- Data -->
			<div v-else class="space-y-4">
				<div
					v-for="(item, index) in benefits"
					:key="item.id"
					class="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/70 transition-colors">

					<div class="flex items-center gap-3 flex-1 min-w-0">
						<div
							class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
							:style="{ backgroundColor: colors[index % colors.length] }">
							{{ getInitials(item.benefit_type_name) }}
						</div>

						<div class="min-w-0">
							<p class="font-semibold text-sm text-gray-900 dark:text-white truncate">
								{{ item.benefit_type_name }}
							</p>
							<span class="text-xs text-gray-600 dark:text-gray-400">
								{{ item.project_count }} proyecto{{ item.project_count !== 1 ? 's' : '' }}
								• Promedio: {{ formatQuantity(item.avg_quantity) }}
							</span>
						</div>
					</div>

					<div class="flex items-center gap-2 w-full max-w-[140px]">
						<div class="relative w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-sm">
							<div
								class="absolute left-0 top-0 h-full rounded-sm transition-all duration-700"
								:style="{
									width: getPercentage(item) + '%',
									backgroundColor: colors[index % colors.length],
								}" />
						</div>
						<span class="text-xs font-medium">
							{{ getPercentage(item) }}%
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { getStatsByBenefitType } from '../../services/statistics/dashboard';

interface BenefitType {
	id: number;
	benefit_type_name: string;
	project_count: number;
	avg_quantity: number | string;
}

const props = defineProps({
	filters: {
		type: Object,
		default: () => ({}),
	},
});

const benefits = ref<BenefitType[]>([]);
const loading = ref(false);
const loadError = ref<string | null>(null);

const colors = ['#83181b', '#a34245', '#c36b6f', '#e39499', '#d1a17a', '#b8ae9d'];

const getInitials = (name: string) =>
	name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const formatQuantity = (value: number | string) => {
	const n = Number(value);
	return isNaN(n) ? '0' : n.toFixed(0);
};

const maxProjects = computed(() =>
	Math.max(...benefits.value.map(b => b.project_count), 1)
);

const getPercentage = (item: BenefitType) =>
	Math.round((item.project_count * 100) / maxProjects.value);

const hasData = computed(() => benefits.value.length > 0);

const loadData = async () => {
	try {
		loading.value = true;
		loadError.value = null;

		const response = await getStatsByBenefitType(props.filters);
		benefits.value = response.data ?? [];
	} catch (e: any) {
		loadError.value = e.message;
		benefits.value = [];
	} finally {
		loading.value = false;
	}
};

onMounted(loadData);

watch(() => props.filters, loadData, { deep: true });
</script>
