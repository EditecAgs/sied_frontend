<template>
	<div class="overflow-hidden rounded-2xl border border-gray-200 bg-[rgb(211,211,210)]/50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-900/90">
		<div class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
			<h3 class="text-xl font-semibold text-gray-600 dark:text-white">Proyectos por Sectores de Modelo Dual</h3>

			<nav
				class="inline-flex rounded-md shadow-sm"
				role="navigation"
				aria-label="Pagination">
				<button
					:disabled="currentPage === 1 || loading"
					class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white/80 backdrop-blur-sm px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700"
					aria-label="Previous page"
					@click="goToPage(currentPage - 1)">
					<svg
						v-if="loading && currentPage > 1"
						class="animate-spin h-4 w-4 mr-2"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4" />
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
					Anterior
				</button>

				<button
					:disabled="currentPage === totalPages || loading"
					class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white/80 backdrop-blur-sm px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700"
					aria-label="Next page"
					@click="goToPage(currentPage + 1)">
					Siguiente
					<svg
						v-if="loading && currentPage < totalPages"
						class="animate-spin h-4 w-4 ml-2"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4" />
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
				</button>
			</nav>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
				<thead class="bg-gray-100/70 dark:bg-gray-800/80">
					<tr>
						<th
							scope="col"
							class="py-3 px-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 max-w-[250px]">
							Sector
						</th>
						<th
							scope="col"
							class="py-3 px-4 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 w-32 cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
							@click="toggleSort">
							<div class="flex items-center justify-end gap-1">
								Proyectos
								<span v-if="sortOrder === 'desc'" class="text-xs">▼</span>
								<span v-else class="text-xs">▲</span>
							</div>
						</th>
						<th
							scope="col"
							class="py-3 px-4 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 w-32">
							Porcentaje
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
					<template v-if="loading && paginatedData.length === 0">
						<tr
							v-for="i in 5"
							:key="`skeleton-${i}`">
							<td class="py-3 px-4">
								<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-[200px]" />
							</td>
							<td class="py-3 px-4 text-right">
								<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block w-12" />
							</td>
							<td class="py-3 px-4 text-right">
								<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block w-16" />
							</td>
						</tr>
					</template>

					<tr
						v-for="(item, index) in paginatedData"
						v-else
						:key="index"
						class="hover:bg-gray-200/60 dark:hover:bg-gray-800/80 transition-colors">
						<td class="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white break-words max-w-[250px]">
							{{ item.name }}
						</td>
						<td class="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">
							{{ item.project_count }}
						</td>
						<td class="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">{{ formatPercentage(item.percentage) }}%</td>
					</tr>

					<tr v-if="!loading && paginatedData.length === 0">
						<td
							colspan="3"
							class="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
							No hay datos disponibles
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<p
			v-if="!loading"
			class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
			aria-live="polite">
			Página {{ currentPage }} de {{ totalPages }} • Mostrando {{ startItem }}-{{ endItem }} de {{ totalItems }} sectores
		</p>
		<p
			v-else
			class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
			Cargando datos...
		</p>

		<div
			v-if="!loading && totalPages > 1"
			class="mt-4 flex justify-center">
			<div class="flex items-center gap-1">
				<button
					v-for="page in visiblePages"
					:key="page"
					:class="[
						'px-3 py-1 text-sm rounded-md transition-colors',
						currentPage === page
							? 'bg-[#82181a] text-white'
							: 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700',
					]"
					@click="goToPage(page)">
					{{ page }}
				</button>
				<span
					v-if="showEllipsis"
					class="px-2 text-gray-500">
					...
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { getProjectsBySector } from '../../services/statistics/dashboard';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({}),
  },
});

const allSectors = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(false);
const sortOrder = ref('desc');

const totalItems = computed(() => allSectors.value.length);

const totalPages = computed(() => {
  return Math.ceil(allSectors.value.length / itemsPerPage);
});

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, totalItems.value);
});

const sortedSectors = computed(() => {
  return [...allSectors.value].sort((a, b) => {
    if (sortOrder.value === 'desc') {
      return b.project_count - a.project_count;
    } else {
      return a.project_count - b.project_count;
    }
  });
});

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sortedSectors.value.slice(startIndex, endIndex);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const showEllipsis = computed(() => {
  return totalPages.value > visiblePages.value.length;
});

const formatPercentage = (percentage) => {
  if (percentage === undefined || percentage === null) return '0.00';
  return typeof percentage === 'number' ? percentage.toFixed(2) : parseFloat(percentage).toFixed(2);
};

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
  currentPage.value = 1;
};

const fetchData = async () => {
  try {
    loading.value = true;

    const response = await getProjectsBySector(props.filters);

    if (Array.isArray(response.data)) {
      allSectors.value = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      allSectors.value = response.data.data;
    } else if (response.data && typeof response.data === 'object') {
      if (response.data.results && Array.isArray(response.data.results)) {
        allSectors.value = response.data.results;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        allSectors.value = response.data.items;
      } else if (response.data.sectors && Array.isArray(response.data.sectors)) {
        allSectors.value = response.data.sectors;
      } else {
        allSectors.value = [];
      }
    } else {
      allSectors.value = [];
    }

    currentPage.value = 1;

  } catch (error) {
    console.error('Error al cargar sectores:', error);
    allSectors.value = [];
  } finally {
    loading.value = false;
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(() => {
  fetchData();
});

watch(
    () => props.filters,
    () => {
      fetchData();
    },
    { deep: true }
);
</script>