<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref, onMounted, watch, watchEffect, computed, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { VTooltip } from 'floating-vue'
import 'floating-vue/dist/style.css'
import btnCreate from '../../buttons/btnCreate.vue';
import mdlSectors from '../modals-forms/mdlSectors.vue';
import mdlClusters from '../modals-forms/mdlClusters.vue';
import { useModal } from "../../../composables/UseModal";
import { getStates } from '../../../services/location/states.js'
import { getMunicipalities } from '../../../services/location/municipalities.js'
import { showOrganization } from '../../../services/organizations/organizations'
import { getTypes } from '../../../services/organizations/types.js'
import { getSectors } from '../../../services/organizations/sectors.js'
import { getClusters } from '../../../services/organizations/clusters.js'

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)
const alvRoute = ref()
const alvMethod = ref('POST')

const { showModal: showSectorModal, modalData: sectorModalData, openModal: openSectorModal, closeModal: closeSectorModal } = useModal();
const { showModal: showClusterModal, modalData: clusterModalData, openModal: openClusterModal, closeModal: closeClusterModal } = useModal();

const tableRef = ref(null);

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean
	data: {
		mode: 'create' | 'edit'
		pk: number | null
		table: string
	}
}>()

const form = reactive({
	name: '',
	id_type: '',
	id_sector: '',
	size: '',
	id_cluster: '',
	id_cluster_local: '',
	street: '',
	external_number: '',
	internal_number: '',
	neighborhood: '',
	postal_code: '',
	id_state: '',
	id_municipality: '',
	country: 'México',
	city: '',
	scope: ''
})

const states = ref([])
const municipalities = ref([])
const allMunicipalities = ref([])
const types = ref([])
const sectors = ref([])
const clusters = ref([])


const sectorDropdownOpen = ref(false)
const searchQuery = ref('')

const highlightedSectors = [
	'Agroindustrial',
	'Textiles, Vestuario y Cuero',
	'Química',
	'Tecnologías de la Información y Comunicaciones',
	'Farmacéutico y Dispositivos Médicos',
	'Energía',
	'Calzado',
	'Bienes de consumo y economía circular',
	'Aeroespacial',
	'Semiconductores',
	'Automotriz y Electromovilidad'
];

const filteredSectors = computed(() => {
	if (!sectors.value) return [];

	let filtered = sectors.value;

	if (searchQuery.value) {
		filtered = sectors.value.filter(sector =>
			sector.name.toLowerCase().includes(searchQuery.value.toLowerCase())
		);
	}

	return filtered.map(sector => ({
		...sector,
		isHighlighted: highlightedSectors.includes(sector.name)
	}));
});

const selectedSectorName = computed(() => {
	if (!form.id_sector || !sectors.value) return '';
	const sector = sectors.value.find(s => s.id === form.id_sector);
	return sector ? sector.name : '';
});

const toggleSectorDropdown = () => {
	sectorDropdownOpen.value = !sectorDropdownOpen.value;
	searchQuery.value = '';
};

const selectSector = (sector: any) => {
	form.id_sector = sector.id;
	sectorDropdownOpen.value = false;
	searchQuery.value = '';
};

const closeSectorDropdown = () => {
	sectorDropdownOpen.value = false;
	searchQuery.value = '';
};

const handleSavedSector = async () => {
	try {
		const sectorsRes = await getSectors();
		sectors.value = sectorsRes.data;

		const newSector = sectorsRes.data[sectorsRes.data.length - 1];
		if (newSector) {
			form.id_sector = newSector.id;
		}

		closeSectorModal();
	} catch (error) {
		console.error('Error al recargar sectores:', error);
		closeSectorModal();
	}
};

const handleSavedCluster = async () => {
	try {
		const clustersRes = await getClusters();
		clusters.value = clustersRes.data;

		const newCluster = clustersRes.data[clustersRes.data.length - 1];
		if (newCluster) {
			if (newCluster.type === 'Nacional') {
				form.id_cluster = newCluster.id;
			} else if (newCluster.type === 'Local') {
				form.id_cluster_local = newCluster.id;
			}
		}

		closeClusterModal();
	} catch (error) {
		console.error('Error al recargar clusters:', error);
		closeClusterModal();
	}
};

const clustersNacionales = computed(() => clusters.value.filter(c => c.type === 'Nacional'))
const clustersLocales = computed(() => clusters.value.filter(c => c.type === 'Local'))

const fieldHelpTexts: Record<string, string> = {
	name: 'Nombre completo de la organización o empresa.',
	size: 'Clasificación según el número de trabajadores.',
	id_type: 'Tipo de organización (empresa, institución, asociación, etc.).',
	id_sector: 'Sector económico o industrial al que pertenece.',
	id_cluster: 'Cámara o clúster nacional al que pertenece la organización.',
	id_cluster_local: 'Cámara o clúster local correspondiente.',
	scope: 'Nivel de alcance geográfico de la organización.',
	street: 'Nombre de la calle donde se encuentra ubicada la organización.',
	external_number: 'Número exterior del domicilio.',
	internal_number: 'Número interior (si aplica).',
	neighborhood: 'Colonia o fraccionamiento.',
	postal_code: 'Código postal de la ubicación.',
	city: 'Ciudad donde se encuentra la organización.',
	id_state: 'Estado de la República donde se ubica la organización.',
	id_municipality: 'Municipio correspondiente.'
}

const vTooltip = VTooltip

const loadDependents = async () => {
	try {
		const [statesRes, municipalitiesRes, typesRes, sectorsRes, clustersRes] = await Promise.all([
			getStates(),
			getMunicipalities(),
			getTypes(),
			getSectors(),
			getClusters()
		])
		states.value = statesRes.data
		allMunicipalities.value = municipalitiesRes.data
		types.value = typesRes.data
		sectors.value = sectorsRes.data
		clusters.value = clustersRes.data
	} catch (error) {
		console.error('Error cargando datos:', error)
	}
}

watch(() => form.id_state, newState => {
	municipalities.value = allMunicipalities.value.filter(m => m.id_state === newState)
})

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}organizations/${props.data.pk}`
		alvMethod.value = 'PUT'
		isLoading.value = true

		showOrganization(props.data.pk)
			.then(({ data }) => {
				Object.keys(form).forEach(key => {
					if (data[key] !== undefined) form[key] = data[key]
				})
				if (data.id_state) {
					municipalities.value = allMunicipalities.value.filter(m => m.id_state === data.id_state)
				}
			})
			.finally(() => {
				isLoading.value = false
			})
	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}organizations`
		alvMethod.value = 'POST'
		Object.keys(form).forEach(key => (form[key] = key === 'country' ? 'México' : ''))
		municipalities.value = []
	}
})

onMounted(loadDependents)

const afterDone = () => {
	emit('saved')
	emit('close')
}

const afterError = (res: any) => {
	console.error('Error al guardar:', res)
}
</script>

<template>
	<transition name="fade-scale">
		<div
			v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			style="margin-top: 0px" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] flex flex-col overflow-hidden" style="background-image: url('/images/background/bg-white-flores.png');">
				<div class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
					</h4>
					<div class="flex items-center gap-4">
						<div v-if="isLoading" class="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />
						<button class="text-white/80 hover:text-white text-2xl font-bold leading-none" @click="emit('close')">&times;</button>
					</div>
				</div>

				<alv-form
					id="OrganizationForm"
					:action="alvRoute"
					:method="alvMethod"
					:data-object="form"
					class="overflow-y-auto pr-2 flex-grow"
					@after-done="afterDone"
					@after-error="afterError">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Nombre*
								<button
									v-tooltip="fieldHelpTexts.name"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<input v-model="form.name" name="name" required class="w-full px-3 py-2 border rounded-md" />
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Tamaño*
								<button
									v-tooltip="fieldHelpTexts.size"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select v-model="form.size" name="size" required class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tamaño</option>
								<option value="Micro (1 a 10 trabajadores)">Micro (1 a 10 trabajadores)</option>
								<option value="Pequeña (11 a 50 trabajadores)">Pequeña (11 a 50 trabajadores)</option>
								<option value="Mediana (51 a 100 trabajadores)">Mediana (51 a 100 trabajadores)</option>
								<option value="Grande (Más de 100 trabajadores)">Grande (Más de 100 trabajadores)</option>
							</select>
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Tipo*
								<button
									v-tooltip="fieldHelpTexts.id_type"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select v-model="form.id_type" name="id_type" required class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tipo</option>
								<option v-for="type in types" :key="type.id" :value="type.id">{{ type.name }}</option>
							</select>
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Sector*
								<button
									v-tooltip="fieldHelpTexts.id_sector"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>

							<div class="flex gap-2 relative">
								<div class="w-full relative">
									<div
										@click="toggleSectorDropdown"
										class="w-full px-3 py-2 border rounded-md bg-white cursor-pointer flex items-center justify-between"
										:class="{ 'border-brand-600': sectorDropdownOpen }">
										<span v-if="selectedSectorName" class="text-gray-700">
											{{ selectedSectorName }}
										</span>
										<span v-else class="text-gray-400">Selecciona sector</span>
										<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
										</svg>
									</div>

									<input type="hidden" :name="'id_sector'" :value="form.id_sector" />

									<div
										v-if="sectorDropdownOpen"
										class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
										<div class="p-2 border-b">
											<input
												v-model="searchQuery"
												type="text"
												placeholder="Buscar sector..."
												class="w-full px-3 py-2 border rounded-md text-sm"
												@click.stop />
										</div>

										<div class="py-1">
											<div
												v-for="sector in filteredSectors"
												:key="sector.id"
												@click="selectSector(sector)"
												class="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
												:class="{
													'bg-brand-50 text-brand-700': form.id_sector === sector.id,
													'font-semibold text-brand-700': sector.isHighlighted,
													'text-gray-700': !sector.isHighlighted
												}">
												{{ sector.name }}
											</div>
											<div
												v-if="filteredSectors.length === 0"
												class="px-3 py-2 text-gray-500 text-sm text-center">
												No se encontraron sectores
											</div>
										</div>
									</div>
								</div>

								<btn-create
									:table="'Sector'"
									class="flex-shrink-0"
									tooltip="Crear nuevo sector"
									@open="({ mode, pk, table }) => openSectorModal(mode, pk, table)" />
							</div>
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Cámara (cluster) Nacional*
								<button
									v-tooltip="fieldHelpTexts.id_cluster"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<div class="flex gap-2">
								<select
									v-model="form.id_cluster"
									name="id_cluster"
									required
									class="w-full px-3 py-2 border rounded-md flex-1">
									<option value="">Selecciona cluster nacional</option>
									<option v-for="cluster in clustersNacionales" :key="cluster.id" :value="cluster.id">
										{{ cluster.name }}
									</option>
								</select>
								<btn-create
									:table="'Cámara'"
									class="flex-shrink-0"
									tooltip="Crear nueva cámara"
									@open="({ mode, pk, table }) => openClusterModal(mode, pk, table)" />
							</div>
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Cámara (cluster) Local*
								<button
									v-tooltip="fieldHelpTexts.id_cluster_local"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<div class="flex gap-2">
								<select
									v-model="form.id_cluster_local"
									name="id_cluster_local"
									required
									class="w-full px-3 py-2 border rounded-md flex-1">
									<option value="">Selecciona cluster local</option>
									<option v-for="cluster in clustersLocales" :key="cluster.id" :value="cluster.id">
										{{ cluster.name }}
									</option>
								</select>
								<btn-create
									:table="'Cámara'"
									class="flex-shrink-0"
									tooltip="Crear nueva cámara"
									@open="({ mode, pk, table }) => openClusterModal(mode, pk, table)" />
							</div>
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Operación de la organización *
								<button
									v-tooltip="fieldHelpTexts.scope"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select v-model="form.scope" name="scope" required class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona alcance</option>
								<option value="Municipal">Municipal</option>
								<option value="Estatal">Estatal</option>
								<option value="Federal">Federal</option>
								<option value="Internacional">Internacional</option>
							</select>
						</div>
					</div>

					<div class="border-t pt-4 mb-6">
						<h5 class="text-md font-semibold text-brand-800 mb-3">Dirección</h5>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Calle*
									<button
										v-tooltip="fieldHelpTexts.street"
										type="button"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.street" name="street" required class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Número Exterior*
									<button
										v-tooltip="fieldHelpTexts.external_number"
										type="button"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.external_number" name="external_number" required class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div>
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Número Interior
									<button
										v-tooltip="fieldHelpTexts.internal_number"
										type="button"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.internal_number" name="internal_number" class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Colonia*
									<button
										v-tooltip="fieldHelpTexts.neighborhood"
										type="button"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.neighborhood" name="neighborhood" required class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div class="form-error">
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Código Postal*
									<button
										v-tooltip="fieldHelpTexts.postal_code"
										type="button"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.postal_code" name="postal_code" required class="w-full px-3 py-2 border rounded-md" />
							</div>

							<div>
								<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
									Ciudad
									<button
										v-tooltip="fieldHelpTexts.city"
										type="button"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
								</label>
								<input v-model="form.city" name="city" class="w-full px-3 py-2 border rounded-md" />
							</div>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Estado*
								<button
									v-tooltip="fieldHelpTexts.id_state"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select v-model="form.id_state" name="id_state" class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tu Estado</option>
								<option v-for="state in states" :key="state.id" :value="state.id">{{ state.name }}</option>
							</select>
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Municipio*
								<button
									v-tooltip="fieldHelpTexts.id_municipality"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select v-model="form.id_municipality" name="id_municipality" class="w-full px-3 py-2 border rounded-md">
								<option value="">Selecciona tu Municipio</option>
								<option v-for="municipalitie in municipalities" :key="municipalitie.id" :value="municipalitie.id">{{ municipalitie.name }}</option>
							</select>
						</div>
					</div>
				</alv-form>
				<div class="flex justify-end gap-3  pt-4 border-t border-gray-200 sticky bottom-0 bg-transparent z-10">
					<button type="button" class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200" :disabled="isLoading" @click="emit('close')">
						Cancelar
					</button>
					<button form="OrganizationForm" class="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110" :disabled="isLoading">
						{{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
					</button>
				</div>

				<mdl-sectors
					:show="showSectorModal"
					:data="sectorModalData"
					@close="closeSectorModal"
					@saved="handleSavedSector" />

				<mdl-clusters
					:show="showClusterModal"
					:data="clusterModalData"
					@close="closeClusterModal"
					@saved="handleSavedCluster" />
			</div>
		</div>
	</transition>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

.help-icon {
	@apply w-4 h-4 flex items-center justify-center rounded-full border border-current text-xs font-bold;
}

:deep() {
	.dropdown-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 40;
	}
}
</style>