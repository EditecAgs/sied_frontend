<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Registro de Accesos de Usuario</h2>
      </div>
    </div>

    <div class="overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="bg-brand-800/80 text-white">
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Usuario</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Acción</th>
            <th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Fecha / Hora</th>
          </tr>
          <tr class="bg-brand-800/60 text-white">
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.user" placeholder="Usuario" class="w-full bg-white/10 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white/50" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.accion" placeholder="Acción" class="w-full bg-white/10 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white/50" />
            </th>
            <th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
              <input v-model="filters.fecha_hora" placeholder="Fecha / Hora" class="w-full bg-white/10 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white/50" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(bitacora, index) in bitacoras" :key="bitacora.id ?? index" class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ bitacora.user?.name || '—' }}</td>
            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ bitacora.accion }}</td>
            <td class="px-5 py-3 text-sm border-r border-gray-100">{{ bitacora.fecha_hora }}</td>
          </tr>

          <tr v-if="!isLoading && bitacoras.length === 0">
            <td colspan="4" class="text-center py-5 text-gray-500 text-sm">No hay registros</td>
          </tr>
          <tr v-if="isLoading">
            <td colspan="4" class="text-center py-5 text-gray-500 text-sm animate-pulse">Cargando...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
      <span class="text-xs text-gray-600">Página {{ currentPage }} de {{ totalPages }}</span>
      <div class="flex items-center space-x-2">
        <select v-model="rowsPerPage" class="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700">
          <option value="10">10 por página</option>
          <option value="25">25 por página</option>
          <option value="50">50 por página</option>
          <option value="100">100 por página</option>
        </select>

        <button
          :disabled="currentPage === 1"
          class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30"
          @click="currentPage--">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          :disabled="currentPage === totalPages"
          class="p-1 rounded-full text-brand-800 hover:bg-brand-100 disabled:opacity-30"
          @click="currentPage++">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { getBitacoraAccesos } from "../../services/statistics/accesLogsService";

const bitacoras = ref([]);
const isLoading = ref(false);
const totalPages = ref(1);
const currentPage = ref(1);
const rowsPerPage = ref(20);

const filters = ref({
  user: "",
  accion: "",
  fecha_hora: "",
});

const fetchData = async () => {
  isLoading.value = true;
  try {
    const { data } = await getBitacoraAccesos(currentPage.value, rowsPerPage.value, filters.value);
    bitacoras.value = data.data;
    totalPages.value = data.last_page ?? 1;
  } catch (error) {
    console.error("Error al obtener bitácora de accesos:", error);
  } finally {
    isLoading.value = false;
  }
};

// Re-fetch al cambiar página, filas por página o filtros
watch([currentPage, rowsPerPage, filters], fetchData, { deep: true });

onMounted(fetchData);

defineExpose({ fetchData });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #82181a;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #460809;
}
</style>
