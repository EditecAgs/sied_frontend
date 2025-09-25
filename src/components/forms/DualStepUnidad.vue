
<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted, onBeforeUnmount } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import btnCreate from '../../components/buttons/btnCreate.vue';
import mdlOrganization from '../modals/modals-forms/mdlOrganization.vue';
import { useModal } from '../../composables/UseModal';
import { getOrganizations } from '../../services/organizations/organizations.js';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
	modelValue: { type: Object, required: true },
	areas: Array,
	organizations: Array,
	agreementStatuses: Array,
	supportTypes: Array,
	dualTypes: Array,
	microCredentials: Array
});

const { showModal, modalData, openModal, closeModal } = useModal();

const maxQualification = ref(props.modelValue.max_qualification || '');
const handleSavedOrganization = async () => {
	closeModal();
	const res = await getOrganizations();
	emit('update:modelValue', {
		...props.modelValue,
		id_organization: res.data?.[res.data.length - 1]?.id
	});
};

const errors = ref({});

const initializeSearchValues = () => {
	if (props.modelValue.id_dual_area) {
		const area = props.areas?.find(a => a.id === props.modelValue.id_dual_area);
		searchArea.value = area?.name || '';
	}
	if (props.modelValue.id_organization) {
		const org = props.organizations?.find(o => o.id === props.modelValue.id_organization);
		searchOrganization.value = org?.name || '';
	}
	if (props.modelValue.status_document) {
		const status = props.agreementStatuses?.find(s => s.id === props.modelValue.status_document);
		searchStatus.value = status?.name || '';
	}
	if (props.modelValue.economic_support) {
		const support = props.supportTypes?.find(s => s.id === props.modelValue.economic_support);
		searchSupport.value = support?.name || '';
	}
	if (props.modelValue.dual_type_id) {
		const dualType = props.dualTypes?.find(d => d.id === props.modelValue.dual_type_id);
		searchDualType.value = dualType?.name || '';
	}
	if (props.modelValue.max_qualification) {
		maxQualification.value = props.modelValue.max_qualification.toString();
	}
};

// Dropdowns
const searchArea = ref('');
const showAreaDropdown = ref(false);
const areaDropdownRef = ref(null);

const searchOrganization = ref('');
const showOrganizationDropdown = ref(false);
const organizationDropdownRef = ref(null);

const searchStatus = ref('');
const showStatusDropdown = ref(false);
const statusDropdownRef = ref(null);

const searchSupport = ref('');
const showSupportDropdown = ref(false);
const supportDropdownRef = ref(null);

const searchDualType = ref('');
const showDualTypeDropdown = ref(false);
const dualTypeDropdownRef = ref(null);


const selectedMicroCredentials = ref(props.modelValue.micro_credentials || []);
const searchMicro = ref('');
const showMicroDropdown = ref(false);
const microDropdownRef = ref(null);
const allMicroCredentials = ref(props.microCredentials || []);

const filteredAreas = computed(() =>
	!searchArea.value ? props.areas || [] : (props.areas || []).filter(a => a.name.toLowerCase().includes(searchArea.value.toLowerCase()))
);
const filteredOrganizations = computed(() =>
	!searchOrganization.value ? props.organizations || [] : (props.organizations || []).filter(o => o.name.toLowerCase().includes(searchOrganization.value.toLowerCase()))
);
const filteredStatuses = computed(() =>
	!searchStatus.value ? props.agreementStatuses || [] : (props.agreementStatuses || []).filter(s => s.name.toLowerCase().includes(searchStatus.value.toLowerCase()))
);
const filteredSupports = computed(() =>
	!searchSupport.value ? props.supportTypes || [] : (props.supportTypes || []).filter(s => s.name.toLowerCase().includes(searchSupport.value.toLowerCase()))
);
const filteredDualTypes = computed(() =>
	!searchDualType.value ? props.dualTypes || [] : (props.dualTypes || []).filter(d => d.name.toLowerCase().includes(searchDualType.value.toLowerCase()))
);
const filteredMicro = computed(() =>
	!searchMicro.value
		? allMicroCredentials.value.filter(m => !selectedMicroCredentials.value.some(s => s.id === m.id))
		: allMicroCredentials.value.filter(
			m =>
				m.name.toLowerCase().includes(searchMicro.value.toLowerCase()) &&
				!selectedMicroCredentials.value.some(s => s.id === m.id)
		)
);

const period_start = ref(props.modelValue.period_start ? new Date(props.modelValue.period_start) : null);
const period_end = ref(props.modelValue.period_end ? new Date(props.modelValue.period_end) : null);

const handleClickOutside = (event) => {
	if (areaDropdownRef.value && !areaDropdownRef.value.contains(event.target)) showAreaDropdown.value = false;
	if (organizationDropdownRef.value && !organizationDropdownRef.value.contains(event.target)) showOrganizationDropdown.value = false;
	if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target)) showStatusDropdown.value = false;
	if (supportDropdownRef.value && !supportDropdownRef.value.contains(event.target)) showSupportDropdown.value = false;
	if (dualTypeDropdownRef.value && !dualTypeDropdownRef.value.contains(event.target)) showDualTypeDropdown.value = false;
	if (microDropdownRef.value && !microDropdownRef.value.contains(event.target)) showMicroDropdown.value = false;
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
	initializeSearchValues();
});

onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

watch(() => props.modelValue, () => {
	initializeSearchValues();
}, { deep: true });

const update = (field, value) => {
	emit('update:modelValue', { ...props.modelValue, [field]: value });
	if (errors.value[field]) errors.value[field] = '';

	if (field === 'id_dual_area') {
		const selected = props.areas?.find(a => a.id === value);
		searchArea.value = selected?.name || '';
		showAreaDropdown.value = false;
	}
	if (field === 'id_organization') {
		const selected = props.organizations?.find(o => o.id === value);
		searchOrganization.value = selected?.name || '';
		showOrganizationDropdown.value = false;
	}
	if (field === 'status_document') {
		const selected = props.agreementStatuses?.find(s => s.id === value);
		searchStatus.value = selected?.name || '';
		showStatusDropdown.value = false;
	}
	if (field === 'economic_support') {
		const selected = props.supportTypes?.find(s => s.id === value);
		searchSupport.value = selected?.name || '';
		showSupportDropdown.value = false;
	}
	if (field === 'dual_type_id') {
		const selected = props.dualTypes?.find(d => d.id === value);
		searchDualType.value = selected?.name || '';
		showDualTypeDropdown.value = false;
	}
};

const addMicroCredential = (micro) => {
	selectedMicroCredentials.value.push(micro);
	emit('update:modelValue', {
		...props.modelValue,
		micro_credentials: selectedMicroCredentials.value.map(m => m.id)
	});
	searchMicro.value = '';
	showMicroDropdown.value = false;
};


const removeMicroCredential = (micro) => {
	selectedMicroCredentials.value = selectedMicroCredentials.value.filter(m => m.id !== micro.id);
	emit('update:modelValue', {
		...props.modelValue,
		micro_credentials: selectedMicroCredentials.value.map(m => m.id)
	});
};


watch(() => props.modelValue.micro_credentials, (val) => {
	selectedMicroCredentials.value = val || [];
});

const validate = () => {
	const requiredFields = [
		'name_report',
		'id_organization',
		'id_dual_area',
		'period_start',
		'period_end',
		'status_document',
		'economic_support',
		'amount',
		'advisor',
		'is_concluded',
		'is_hired',
		'dual_type_id'
	];

	let isValid = true;
	errors.value = {};

	for (const field of requiredFields) {
		if (
			props.modelValue[field] === null ||
			props.modelValue[field] === undefined ||
			props.modelValue[field] === ''
		) {
			errors.value[field] = 'Este campo es obligatorio';
			isValid = false;
		}
	}

	if (
		props.modelValue.qualification !== null &&
		props.modelValue.qualification !== undefined &&
		props.modelValue.qualification !== ''
	) {
		if (!props.modelValue.max_qualification) {
			errors.value.max_qualification = 'Seleccione la calificación máxima';
			isValid = false;
		} else if (
			props.modelValue.qualification < 0 ||
			props.modelValue.qualification > props.modelValue.max_qualification
		) {
			errors.value.qualification = `La calificación debe estar entre 0 y ${props.modelValue.max_qualification}`;
			isValid = false;
		}
	}

	if (props.modelValue.amount < 0) {
		errors.value.amount = 'El monto debe ser mayor o igual a 0';
		isValid = false;
	}

	const start = new Date(props.modelValue.period_start);
	const end = new Date(props.modelValue.period_end);
	if (start && end && start > end) {
		errors.value.period_end = 'La fecha de fin debe ser posterior a la fecha de inicio';
		isValid = false;
	}

	return isValid;
};

defineExpose({ validate });

watch(() => props.microCredentials, (val) => {
	allMicroCredentials.value = val || [];
});

watch(period_start, (val) => {
	if (val) {
		const formatted = new Date(val).toISOString().slice(0, 10);
		update('period_start', formatted);
	}
});
watch(period_end, (val) => {
	if (val) {
		const formatted = new Date(val).toISOString().slice(0, 10);
		update('period_end', formatted);
	}
});

watch(searchDualType, (val) => {
	if (!val) {
		update('dual_type_id', '');
	}
});

watch(() => props.modelValue.max_qualification, (newVal) => {
	if (newVal !== null && newVal !== undefined) {
		maxQualification.value = newVal.toString();
	} else {
		maxQualification.value = '';
	}
});
watch(maxQualification, (newVal) => {
	if (newVal) {
		update('max_qualification', Number(newVal));
	} else {
		update('max_qualification', '');
	}
});
</script>

<template>
	<div class="space-y-8">
		<div class="space-y-8">
			<div class="text-center">
				<h2 class="text-2xl font-bold text-brand-900 mb-2">Unidad Dual</h2>
				<p class="text-gray-600 text-sm">Complete la información del proyecto dual</p>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">1</span>
					Proyecto Dual
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="label">Nombre del Proyecto</label>
						<input
							type="text"
							class="input"
							:value="modelValue.name_report"
							@input="update('name_report', $event.target.value)" />
						<p v-if="errors.name_report" class="error-msg">{{ errors.name_report }}</p>
					</div>

					<div ref="areaDropdownRef">
						<label class="label">Área del Proyecto Dual</label>
						<div class="relative">
							<input
								v-model="searchArea" class="input" placeholder="Buscar área..."
								@focus="showAreaDropdown = true" @input="showAreaDropdown = true" />
							<ul
								v-if="showAreaDropdown && filteredAreas.length"
								class="dropdown">
								<li
									v-for="area in filteredAreas" :key="area.id"
									class="dropdown-item"
									@click="update('id_dual_area', area.id)">
									{{ area.name }}
								</li>
							</ul>
						</div>
						<p v-if="errors.id_dual_area" class="error-msg">{{ errors.id_dual_area }}</p>
					</div>
				</div>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">2</span>
					Organización
				</h3>
				<div ref="organizationDropdownRef" class="flex items-end gap-2">
					<div class="flex-1 relative">
						<label class="label">Organización</label>
						<input
							v-model="searchOrganization" class="input" placeholder="Buscar organización..."
							@focus="showOrganizationDropdown = true" @input="showOrganizationDropdown = true" />
						<ul
							v-if="showOrganizationDropdown && filteredOrganizations.length"
							class="dropdown">
							<li
								v-for="org in filteredOrganizations" :key="org.id"
								class="dropdown-item"
								@click="update('id_organization', org.id)">
								{{ org.name }}
							</li>
						</ul>
						<p v-if="errors.id_organization" class="error-msg">{{ errors.id_organization }}</p>
					</div>
					<btn-create
						:table="'organization'" class="h-12 px-4 flex-shrink-0"
						tooltip="Crear nueva organización"
						@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
				</div>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">3</span>
					Periodo
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="label">Fecha de Inicio</label>
						<Datepicker v-model="period_start" placeholder="Seleccione la fecha" :enable-time-picker="false" class="input" />
						<p v-if="errors.period_start" class="error-msg">{{ errors.period_start }}</p>
					</div>
					<div>
						<label class="label">Fecha de Fin</label>
						<Datepicker v-model="period_end" placeholder="Seleccione la fecha" :enable-time-picker="false" class="input" />
						<p v-if="errors.period_end" class="error-msg">{{ errors.period_end }}</p>
					</div>
				</div>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">4</span>
					Convenio y Apoyo
				</h3>

				<div ref="statusDropdownRef">
					<label class="label">Estado del Convenio Dual</label>
					<div class="relative">
						<input
							v-model="searchStatus" class="input" placeholder="Buscar estado..."
							@focus="showStatusDropdown = true" @input="showStatusDropdown = true" />
						<ul v-if="showStatusDropdown && filteredStatuses.length" class="dropdown">
							<li
								v-for="estado in filteredStatuses" :key="estado.id"
								class="dropdown-item"
								@click="update('status_document', estado.id)">
								{{ estado.name }}
							</li>
						</ul>
					</div>
					<p v-if="errors.status_document" class="error-msg">{{ errors.status_document }}</p>
				</div>

				<div ref="supportDropdownRef" class="flex gap-4 items-end">
					<div class="flex-1">
						<label class="label">Tipo de Apoyo Económico</label>
						<div class="relative">
							<input
								v-model="searchSupport" class="input" placeholder="Buscar apoyo..."
								@focus="showSupportDropdown = true" @input="showSupportDropdown = true" />
							<ul v-if="showSupportDropdown && filteredSupports.length" class="dropdown">
								<li
									v-for="apoyo in filteredSupports" :key="apoyo.id"
									class="dropdown-item"
									@click="update('economic_support', apoyo.id)">
									{{ apoyo.name }}
								</li>
							</ul>
						</div>
						<p v-if="errors.economic_support" class="error-msg">{{ errors.economic_support }}</p>
					</div>
					<div class="w-40 flex-shrink-0">
						<label class="label">Monto</label>
						<input
							type="number" min="0" step="0.01" class="input"
							:value="modelValue.amount"
							@input="update('amount', parseFloat($event.target.value))" />
						<p v-if="errors.amount" class="error-msg">{{ errors.amount }}</p>
					</div>
				</div>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">5</span>
					Información Adicional
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="label">Calificación máxima</label>
						<select
							v-model="modelValue.max_qualification"
							class="input"
							@change="update('max_qualification', Number(modelValue.max_qualification))">
							<option value="">Seleccione...</option>
							<option value="10">10</option>
							<option value="100">100</option>
						</select>
						<p v-if="errors.max_qualification" class="error-msg">{{ errors.max_qualification }}</p>
					</div>

					<div>
						<label class="label">Calificación</label>
						<input
							type="number"
							class="input"
							:min="0"
							:max="modelValue.max_qualification || 100"
							:value="modelValue.qualification"
							@input="update('qualification', Number($event.target.value))" />
						<p v-if="errors.qualification" class="error-msg">{{ errors.qualification }}</p>
					</div>
				</div>

				<div>
					<label class="label">Asesor</label>
					<select
						class="input" :value="modelValue.advisor"
						@change="update('advisor', $event.target.value)">
						<option value="">Seleccione...</option>
						<option value="interno">Interno</option>
						<option value="externo">Externo</option>
					</select>
					<p v-if="errors.advisor" class="error-msg">{{ errors.advisor }}</p>
				</div>
			</div>


			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">4</span>
					Estado del Proyecto
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="label">Proyecto Concluido</label>
						<select
							class="input"
							:value="modelValue.is_concluded"
							@change="update('is_concluded', parseInt($event.target.value))">
							<option :value="0">No</option>
							<option :value="1">Sí</option>
						</select>
					</div>

					<div>
						<label class="label">Contratado</label>
						<select
							class="input"
							:value="modelValue.is_hired"
							@change="update('is_hired', parseInt($event.target.value))">
							<option :value="0">No</option>
							<option :value="1">Sí</option>
						</select>
					</div>
				</div>

				<div ref="dualTypeDropdownRef" class="pt-3">
					<label class="label">Tipo de Proyecto Dual</label>
					<div class="relative">
						<input
							v-model="searchDualType" class="input" placeholder="Buscar tipo..."
							@focus="showDualTypeDropdown = true" @input="showDualTypeDropdown = true" />
						<ul
							v-if="showDualTypeDropdown && filteredDualTypes.length"
							class="dropdown">
							<li
								v-for="dual in filteredDualTypes" :key="dual.id"
								class="dropdown-item"
								@click="update('dual_type_id', dual.id)">
								{{ dual.name }}
							</li>
						</ul>
					</div>
					<p v-if="errors.dual_type_id" class="error-msg">{{ errors.dual_type_id }}</p>
				</div>
			</div>
			<!-- ... mantengo las secciones Proyecto Dual, Organización, Periodo, Convenio y Apoyo, Información Adicional, Estado del Proyecto -->

			<!-- NUEVO: Microcredenciales -->
			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">7</span>
					Microcredenciales
				</h3>

				<div ref="microDropdownRef" class="relative">
					<input
						v-model="searchMicro"
						class="input"
						placeholder="Buscar microcredencial..."
						@focus="showMicroDropdown = true"
						@input="showMicroDropdown = true" />
					<ul v-if="showMicroDropdown && filteredMicro.length" class="dropdown">
						<li
							v-for="micro in filteredMicro" :key="micro.id" class="dropdown-item"
							@click="addMicroCredential(micro)">
							{{ micro.name }}
						</li>
					</ul>
				</div>

				<div class="flex flex-wrap gap-2 mt-2">
					<span v-for="micro in selectedMicroCredentials" :key="micro.id" class="bg-brand-100 text-brand-800 px-3 py-1 rounded-full flex items-center gap-2">
						{{ micro.name }}
						<button type="button" class="text-red-500 hover:text-red-700 font-bold" @click="removeMicroCredential(micro)">×</button>
					</span>
				</div>
			</div>

			<mdl-organization
				:show="showModal" :data="modalData"
				@close="closeModal" @saved="handleSavedOrganization" />
		</div>
	</div>
</template>

<style scoped>
.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors;
}
.dropdown {
	@apply absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg;
}
.dropdown-item {
	@apply px-4 py-3 hover:bg-brand-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0;
}
.error-msg {
	@apply text-red-500 text-sm mt-2 flex items-center;
}
</style>
