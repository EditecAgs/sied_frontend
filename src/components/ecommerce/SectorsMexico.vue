<template>
	<div
		class="rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm"
		style="background: linear-gradient(to top, rgba(211, 211, 210, 0.85) 30%, rgba(159, 129, 60, 0.85) 100%)">
		<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<h3 class="text-lg sm:text-xl font-semibold text-white">Sectores de Proyectos del Plan México</h3>

			<div class="flex items-center gap-3">
				<div class="inline-flex rounded-md shadow-sm">
					<button
						v-if="totalPages > 1"
						:disabled="currentPage === 1"
						class="rounded-l-md bg-white/80 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50"
						@click="goToPage(currentPage - 1)">
						Anterior
					</button>
					<button
						v-if="totalPages > 1"
						:disabled="currentPage === totalPages"
						class="rounded-r-md bg-white/80 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50"
						@click="goToPage(currentPage + 1)">
						Siguiente
					</button>
				</div>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full border-collapse">
				<thead class="bg-[#9f813c] text-white">
				<tr>
					<th class="px-4 py-3 text-left text-xs font-semibold uppercase">Sector</th>
					<th
						class="px-4 py-3 text-right text-xs font-semibold uppercase w-28 sm:w-40 cursor-pointer hover:bg-[#8a7334]"
						@click="toggleSort">
						<div class="flex items-center justify-end gap-1">
							Proyectos
							<span v-if="sortOrder === 'desc'" class="text-xs">▼</span>
							<span v-else class="text-xs">▲</span>
						</div>
					</th>
					<th class="px-4 py-3 text-right text-xs font-semibold uppercase w-28 sm:w-40">%</th>
				</tr>
				</thead>

				<tbody class="divide-y divide-white/30">
				<tr
					v-for="(item, index) in paginatedProjects"
					:key="index"
					class="hover:bg-white/20 transition">
					<td class="px-4 py-3">
						<div class="flex items-start gap-3 min-w-0">
							<img
								v-if="sectorLogos[item.sector_name]"
								:src="sectorLogos[item.sector_name]"
								class="w-6 h-6 flex-shrink-0 object-contain"
								alt="Sector" />
							<span class="text-sm sm:text-base text-gray-900 whitespace-normal break-words">
									{{ item.sector_name }}
								</span>
						</div>
					</td>

					<td class="px-4 py-3 text-right text-sm text-gray-800">
						{{ item.project_count }}
					</td>

					<td class="px-4 py-3 text-right text-sm text-gray-800">{{ formatPercentage(item.percentage) }}%</td>
				</tr>

				<tr v-if="!loading && paginatedProjects.length === 0">
					<td
						colspan="3"
						class="py-6 text-center text-sm text-gray-700">
						No hay datos disponibles
					</td>
				</tr>

				<tr v-if="loading">
					<td
						colspan="3"
						class="py-6 text-center text-sm text-gray-700">
						Cargando datos...
					</td>
				</tr>
				</tbody>
			</table>
		</div>

		<p
			v-if="!loading && totalPages > 1"
			class="mt-3 text-center text-sm text-gray-700">
			Página {{ currentPage }} de {{ totalPages }}
		</p>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { getProjectsBySectorMexico } from '../../services/statistics/dashboard';

const props = defineProps({
	filters: { type: Object, default: () => ({}) },
});

const allProjects = ref([]);
const currentPage = ref(1);
const itemsPerPage = 6;
const loading = ref(false);
const sortOrder = ref('desc');

const sectorLogos = {
	Agroindustrial: '/images/sectorsMLogo/agroindustrial.svg',
	'Textiles, Vestuario y Cuero': '/images/sectorsMLogo/textil.svg',
	Química: '/images/sectorsMLogo/pertroquimica.svg',
	'Tecnologías de la Información y Comunicaciones': '/images/sectorsMLogo/tics.svg',
	'Farmacéutico y Dispositivos Médicos': '/images/sectorsMLogo/farmaceutico.svg',
	Energía: '/images/sectorsMLogo/energia.svg',
	Calzado: '/images/sectorsMLogo/calzado.svg',
	'Bienes de consumo y economía circular': '/images/sectorsMLogo/economia-circular.svg',
	Aeroespacial: '/images/sectorsMLogo/aeroespacial.svg',
	Semiconductores: '/images/sectorsMLogo/semiconductores.svg',
	'Automotriz y Electromovilidad': '/images/sectorsMLogo/automotriz.svg',
};

const formatPercentage = (percentage) => {
	if (percentage === undefined || percentage === null) return '0.00';
	return typeof percentage === 'number' ? percentage.toFixed(2) : parseFloat(percentage).toFixed(2);
};

// Filtrar solo sectores de Plan México (plan_mexico === 1)
const mexicoSectors = computed(() => {
	return allProjects.value.filter(project => project.plan_mexico === 1);
});

const sortedProjects = computed(() => {
	return [...mexicoSectors.value].sort((a, b) => {
		if (sortOrder.value === 'desc') {
			return b.project_count - a.project_count;
		} else {
			return a.project_count - b.project_count;
		}
	});
});

const paginatedProjects = computed(() => {
	const startIndex = (currentPage.value - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	return sortedProjects.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
	return Math.ceil(sortedProjects.value.length / itemsPerPage);
});

const toggleSort = () => {
	sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
	currentPage.value = 1;
};

const goToPage = (page) => {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page;
	}
};

const fetchData = async () => {
	loading.value = true;
	try {
		// IMPORTANTE: Solo pasar los filtros, no el parámetro page
		const response = await getProjectsBySectorMexico(props.filters);

		if (Array.isArray(response.data)) {
			allProjects.value = response.data;
		} else {
			allProjects.value = [];
		}

		currentPage.value = 1;

	} catch (error) {
		console.error('Error fetching data:', error);
		allProjects.value = [];
	} finally {
		loading.value = false;
	}
};

onMounted(() => fetchData());

watch(
	() => props.filters,
	fetchData,
	{ deep: true }
);
</script>