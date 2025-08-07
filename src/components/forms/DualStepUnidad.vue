<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted, onBeforeUnmount } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import btnCreate from '../../components/buttons/btnCreate.vue';
import mdlOrganization from '../modals/modals-forms/mdlOrganization.vue';
import { useModal } from '../../composables/UseModal';
import { getOrganizations } from '../../services/organizations/organizations.js';

const { showModal, modalData, openModal, closeModal } = useModal();
const handleSavedOrganization = async () => {
	closeModal();
	const res = await getOrganizations();
	emit('update:modelValue', {
		...props.modelValue,
		id_organization: res.data?.[res.data.length - 1]?.id // opcional: selecciona la nueva
	});
};

const props = defineProps({
	modelValue: Object,
	areas: Array,
	clusters: Array,
	agreementStatuses: Array,
	supportTypes: Array,
	organizations: Array
});
const emit = defineEmits(['update:modelValue']);

const errors = ref({});

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

// Función para manejar clicks fuera de los dropdowns
const handleClickOutside = (event) => {
	if (areaDropdownRef.value && !areaDropdownRef.value.contains(event.target)) {
		showAreaDropdown.value = false;
	}
	if (organizationDropdownRef.value && !organizationDropdownRef.value.contains(event.target)) {
		showOrganizationDropdown.value = false;
	}
	if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target)) {
		showStatusDropdown.value = false;
	}
	if (supportDropdownRef.value && !supportDropdownRef.value.contains(event.target)) {
		showSupportDropdown.value = false;
	}
};

// Agregar y remover event listener
onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside);
});

const filteredAreas = computed(() => {
	if (!searchArea.value) return props.areas || [];
	return (props.areas || []).filter(a => a.name.toLowerCase().includes(searchArea.value.toLowerCase()));
});
const filteredOrganizations = computed(() => {
	if (!searchOrganization.value) return props.organizations || [];
	return (props.organizations || []).filter(o => o.name.toLowerCase().includes(searchOrganization.value.toLowerCase()));
});
const filteredStatuses = computed(() => {
	if (!searchStatus.value) return props.agreementStatuses || [];
	return (props.agreementStatuses || []).filter(s => s.name.toLowerCase().includes(searchStatus.value.toLowerCase()));
});
const filteredSupports = computed(() => {
	if (!searchSupport.value) return props.supportTypes || [];
	return (props.supportTypes || []).filter(s => s.name.toLowerCase().includes(searchSupport.value.toLowerCase()));
});

const period_start = ref(props.modelValue.period_start ? new Date(props.modelValue.period_start) : null);
const period_end = ref(props.modelValue.period_end ? new Date(props.modelValue.period_end) : null);

const update = (field, value) => {
	emit('update:modelValue', {
		...props.modelValue,
		[field]: value
	});
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
};

const validate = () => {
	const requiredFields = [
		'name_report',
		'id_organization',
		'id_dual_area',
		'period_start',
		'period_end',
		'status_document',
		'economic_support'
	];

	let isValid = true;
	errors.value = {};

	for (const field of requiredFields) {
		if (!props.modelValue?.[field]) {
			errors.value[field] = 'Este campo es obligatorio';
			isValid = false;
		}
	}

	const start = new Date(props.modelValue?.period_start);
	const end = new Date(props.modelValue?.period_end);
	if (start && end && start > end) {
		errors.value.period_end = 'La fecha de fin debe ser posterior a la fecha de inicio';
		isValid = false;
	}

	return isValid;
};
defineExpose({ validate });

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

watch(
	[
		() => props.modelValue?.id_dual_area,
		() => props.modelValue?.id_organization,
		() => props.modelValue?.status_document,
		() => props.modelValue?.economic_support
	],
	([newAreaId, newOrgId, newStatusId, newSupportId]) => {
		if (newAreaId && props.areas?.length) {
			const selected = props.areas.find(a => a.id === newAreaId);
			searchArea.value = selected?.name || '';
		} else {
			searchArea.value = '';
		}
		if (newOrgId && props.organizations?.length) {
			const selected = props.organizations.find(o => o.id === newOrgId);
			searchOrganization.value = selected?.name || '';
		} else {
			searchOrganization.value = '';
		}
		if (newStatusId && props.agreementStatuses?.length) {
			const selected = props.agreementStatuses.find(s => s.id === newStatusId);
			searchStatus.value = selected?.name || '';
		} else {
			searchStatus.value = '';
		}
		if (newSupportId && props.supportTypes?.length) {
			const selected = props.supportTypes.find(s => s.id === newSupportId);
			searchSupport.value = selected?.name || '';
		} else {
			searchSupport.value = '';
		}
	},
	{ immediate: true }
);
</script>

<template>
	<div class="space-y-8">
		<h2 class="text-xl font-semibold text-brand-900">Unidad Dual</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="label">Nombre del Proyecto</label>
				<input
					type="text"
					class="input"
					:value="modelValue.name_report"
					@input="update('name_report', $event.target.value)" />
				<p v-if="errors.name_report" class="text-red-500 text-sm mt-1">{{ errors.name_report }}</p>
			</div>

			<div ref="areaDropdownRef">
				<label class="label">Área del Proyecto Dual</label>
				<div class="relative">
					<input
						v-model="searchArea"
						class="input"
						placeholder="Buscar área..."
						@focus="showAreaDropdown = true"
						@input="showAreaDropdown = true" />
					<ul
						v-if="showAreaDropdown && filteredAreas.length"
						class="absolute z-[9999] bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md">
						<li
							v-for="area in filteredAreas"
							:key="area.id"
							class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
							@click="update('id_dual_area', area.id)">
							{{ area.name }}
						</li>
					</ul>
				</div>
				<p v-if="errors.id_dual_area" class="text-red-500 text-sm mt-1">{{ errors.id_dual_area }}</p>
			</div>

			<div class="flex items-end gap-2" ref="organizationDropdownRef">
				<div class="flex-1">
					<label class="label">Organización</label>
					<div class="relative">
						<input
							v-model="searchOrganization"
							class="input"
							placeholder="Buscar organización..."
							@focus="showOrganizationDropdown = true"
							@input="showOrganizationDropdown = true" />
						<ul
							v-if="showOrganizationDropdown && filteredOrganizations.length"
							class="absolute z-[9999] bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md">
							<li
								v-for="org in filteredOrganizations"
								:key="org.id"
								class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
								@click="update('id_organization', org.id)">
								{{ org.name }}
							</li>
						</ul>
					</div>
					<p v-if="errors.id_organization" class="text-red-500 text-sm mt-1">{{ errors.id_organization }}</p>
				</div>
				<btn-create
					:table="'organization'"
					class="h-auto mb-[9px]"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 z-50 relative overflow-visible">
			<div class="relative z-50">
				<label class="label">Fecha de Inicio del Proyecto Dual</label>
				<Datepicker
					v-model="period_start"
					placeholder="Seleccione la fecha de inicio"
					:teleport="true"
					class="input z-50"
					placement="bottom-start"
					:adaptivePosition="true"
					:enable-time-picker="false" />
				<p v-if="errors.period_start" class="text-red-500 text-sm mt-1">{{ errors.period_start }}</p>
			</div>
			<div class="relative z-50">
				<label class="label">Fecha de Fin del Proyecto Dual</label>
				<Datepicker
					v-model="period_end"
					placeholder="Seleccione la fecha de fin"
					:teleport="true"
					class="input z-50"
					placement="bottom-start"
					:adaptivePosition="true"
					:enable-time-picker="false" />
				<p v-if="errors.period_end" class="text-red-500 text-sm mt-1">{{ errors.period_end }}</p>
			</div>
		</div>

		<div ref="statusDropdownRef">
			<label class="label">Estado del Convenio Dual</label>
			<div class="relative">
				<input
					v-model="searchStatus"
					class="input"
					placeholder="Buscar estado..."
					@focus="showStatusDropdown = true"
					@input="showStatusDropdown = true" />
				<ul
					v-if="showStatusDropdown && filteredStatuses.length"
					class="absolute z-[9999] bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md">
					<li
						v-for="estado in filteredStatuses"
						:key="estado.id"
						class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
						@click="update('status_document', estado.id)">
						{{ estado.name }}
					</li>
				</ul>
			</div>
			<p v-if="errors.status_document" class="text-red-500 text-sm mt-1">{{ errors.status_document }}</p>
		</div>

		<div ref="supportDropdownRef">
			<label class="label">Tipo de Apoyo Económico</label>
			<div class="relative">
				<input
					v-model="searchSupport"
					class="input"
					placeholder="Buscar apoyo económico..."
					@focus="showSupportDropdown = true"
					@input="showSupportDropdown = true" />
				<ul
					v-if="showSupportDropdown && filteredSupports.length"
					class="absolute z-[9999] bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md">
					<li
						v-for="apoyo in filteredSupports"
						:key="apoyo.id"
						class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
						@click="update('economic_support', apoyo.id)">
						{{ apoyo.name }}
					</li>
				</ul>
			</div>
			<p v-if="errors.economic_support" class="text-red-500 text-sm mt-1">{{ errors.economic_support }}</p>
		</div>
	</div>

	<mdl-organization
		:show="showModal"
		:data="modalData"
		@close="closeModal"
		@saved="handleSavedOrganization" />
</template>

<style >
.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-800 focus:border-brand-800;
}

.dp__menu {
	background-color: #ffffff;
	border-radius: 10px;
	border: 1px solid #d1d1d1;
	color: #333;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.dp__calendar_header {
	background-color: #fff;
	color: #5b2245;
	font-weight: bold;
	border-bottom: 1px solid #e0e0e0;
}

.dp__calendar_header_item {
	color: #82181a;
}
.dp__today {
	background-color: #800033;
	color: white;
	font-weight: bold;
}

.dp__cell_inner {
	background-color: transparent;
	border-radius: 6px;
	padding: 5px;
	color: #333;
	transition: background-color 0.2s ease;
}

.dp__today {
	background-color: #f7e6f1;
	color: #82181a;
	font-weight: bold;
}

.dp__cell_inner:hover {
	background-color: #f2e5ed;
	cursor: pointer;
}

.dp__cell_inner.dp__active_date {
	background-color: #82181a;
	color: #fff;
}
</style>