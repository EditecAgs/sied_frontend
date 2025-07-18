<template>
	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
		<div class="max-w-full overflow-x-auto custom-scrollbar">
			<table class="min-w-full">
				<thead>
					<tr class="border-b border-gray-200 bg-brand-50">
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Nombre
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Dirección
							</p>
						</th>
						<th class="px-5 py-3 text-left w-1/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Tipo
							</p>
						</th>
						<th class="px-5 py-3 text-left w-1/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Subsistema
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Ciudad/Estado
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Código Postal
							</p>
						</th>
						<th class="px-5 py-3 text-left w-2/12 sm:px-6">
							<p class="font-medium text-brand-900 text-theme-xs">
								Opciones
							</p>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					<tr v-if="isLoading">
						<td colspan="7" class="py-12 text-center">
							<svg class="animate-spin h-8 w-8 text-brand-800 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
							<p class="text-gray-500">Cargando Instituciones...</p>
						</td>
					</tr>

					<tr
						v-for="(institution, index) in institutions"
						v-else
						:key="institution.id ?? index"
						class="border-t border-gray-100 hover:bg-brand-50/50 transition-colors">
						<td class="px-5 py-4 sm:px-6">
							<span class="block font-medium text-brand-900 text-theme-sm">
								{{ institution.name }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-700 text-theme-sm">
								{{ institution.street }} {{ institution.external_number }} {{ institution.internal_number ? `Int. ${institution.internal_number}` : '' }}
							</p>
							<p class="text-gray-500 text-xs mt-1">{{ institution.neighborhood }}</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<span
								class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
								:class="getTypeClass(institution.type)">
								{{ institution.type }}
							</span>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-500 text-theme-sm">
								{{ institution.subsystem?.name || 'N/A' }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-700 text-theme-sm">
								{{ institution.city }}, {{ institution.state?.name }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<p class="text-gray-500 text-theme-sm">
								{{ institution.postal_code }}
							</p>
						</td>
						<td class="px-5 py-4 sm:px-6">
							<div class="flex space-x-2">
								<btnEdit
									:table="'institutions'"
									:pk="institution.id ?? index"
									class="text-brand-800 hover:text-brand-900"
									@open="(data) => $emit('open', data)" />
								<btnDelete
									:table="'institutions'"
									:pk="institution.id ?? index"
									class="text-brand-800 hover:text-brand-900"
									@deleted="onInstitutionDeleted" />
							</div>
						</td>
					</tr>

					<tr v-if="!isLoading && institutions.length === 0">
						<td colspan="7" class="px-5 py-8 text-center sm:px-6">
							<p class="text-gray-500">No se encontraron instituciones registradas</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import btnEdit from "../../../components/buttons/btnEdit.vue";
import btnDelete from "../../../components/buttons/btnDelete.vue";
import axios from "axios";
import { useAxios } from "../../../axios";

useAxios();

const institutions = ref([]);
const isLoading = ref(false);

// Mapeo de tipos de institución
const institutionTypes = {
	1: { name: 'Pública', class: 'bg-blue-100 text-blue-800' },
	2: { name: 'Privada', class: 'bg-purple-100 text-purple-800' },
	3: { name: 'Mixta', class: 'bg-green-100 text-green-800' }
};

const fetchInstitutions = async () => {
	isLoading.value = true;
	try {
		const res = await axios.get("institutions?include=state,subsystem");
		institutions.value = res.data;
	} catch (err) {
		console.error("Error al obtener las instituciones:", err);
	} finally {
		isLoading.value = false;
	}
};

const getTypeName = (type) => {
	return institutionTypes[type]?.name || 'Desconocido';
};

const getTypeClass = (type) => {
	return institutionTypes[type]?.class || 'bg-gray-100 text-gray-800';
};

const onInstitutionDeleted = (deletedId) => {
	institutions.value = institutions.value.filter((inst) => inst.id !== deletedId);
};

onMounted(() => {
	fetchInstitutions();
});

defineExpose({
	fetchData: fetchInstitutions,
});
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
	background: #82181a; /* brand-800 */
	border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: #460809; /* brand-900 */
}
</style>