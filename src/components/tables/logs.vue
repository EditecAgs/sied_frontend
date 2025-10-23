<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden">
		<div class="px-6 py-4 bg-gradient-to-r from-brand-800 to-brand-900">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-bold text-white">Registro de Actividades de Usuario</h2>
			</div>
		</div>

		<div class="overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="bg-brand-800/80 text-white">
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Usuario</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Módulo</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Acción</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50 border-r border-brand-700/30">Detalle</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Fecha / Hora</th>
						<th class="px-5 py-3 text-left text-sm font-semibold border-b border-brand-700/50">Opciones</th>
					</tr>
					<tr class="bg-brand-800/60 text-white">
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.user" placeholder="Usuario" class="w-full bg-white/10 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.module" placeholder="Módulo" class="w-full bg-white/10 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.action" placeholder="Acción" class="w-full bg-white/10 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.detail" placeholder="Detalle" class="w-full bg-white/10 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50 border-r border-brand-700/30">
							<input v-model="filters.timestamp" placeholder="Fecha / Hora" class="w-full bg-white/10 text-white text-xs px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white/50" />
						</th>
						<th class="px-5 py-2 border-b border-brand-700/50" />
					</tr>
				</thead>

				<tbody>
					<tr v-for="(log, index) in paginatedLogs" :key="log.id ?? index" class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors even:bg-gray-50">
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ log.user }}</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ log.module }}</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ log.action }}</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ log.detail || '—' }}</td>
						<td class="px-5 py-3 text-sm border-r border-gray-100">{{ log.timestamp }}</td>
						<td class="px-5 py-3 text-sm">
							<button class="text-brand-800 hover:underline" @click="$emit('open', { pk: log.id })">Ver detalles</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
			<span class="text-xs text-gray-600">Mostrando {{ paginatedLogs.length }} de {{ filteredLogs.length }} registros</span>
			<div class="flex items-center space-x-2">
				<select v-model="rowsPerPage" class="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700">
					<option value="10">10 por página</option>
					<option value="25">25 por página</option>
					<option value="50">50 por página</option>
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
import { ref, computed, onMounted } from "vue";
import { getLogs } from "../../services/statistics/logsService";

const logs = ref([]);
const isLoading = ref(false);

const filters = ref({ user: "", module: "", action: "", detail: "", timestamp: "" });
const rowsPerPage = ref(10);
const currentPage = ref(1);

const filteredLogs = computed(() => {
  const { user, module, action, detail, timestamp } = filters.value;
  return logs.value.filter(l => 
    l.user.toLowerCase().includes(user.toLowerCase()) &&
    (l.module ?? "").toLowerCase().includes(module.toLowerCase()) &&
    l.action.toLowerCase().includes(action.toLowerCase()) &&
    (l.detail ?? "").toLowerCase().includes(detail.toLowerCase()) &&
    l.timestamp.toLowerCase().includes(timestamp.toLowerCase())
  );
}); 

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / rowsPerPage.value));
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return filteredLogs.value.slice(start, start + rowsPerPage.value);
});

const fetchData = async () => {
  isLoading.value = true;
  try {
    const { data } = await getLogs();
    logs.value = data;
  } finally { 
    isLoading.value = false; 
  }
};

onMounted(() => fetchData());

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
