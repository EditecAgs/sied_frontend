<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import btnCreate from '../../components/buttons/btnCreate.vue';
import mdlInstitution from '../modals/modals-forms/mdlInstitution.vue';
import { useModal } from '../../composables/UseModal';
import { getInstitutions } from '../../services/institutions/institutions.js';

const { showModal, modalData, openModal, closeModal } = useModal();

const props = defineProps({
	modelValue: Object,
	reportaModeloDual: Boolean,
	institutions: Array,
	mode: String
});
const emit = defineEmits(['update:modelValue', 'update:reportaModeloDual', 'submitSinUnidadDual', 'update:institutions']);

const errors = ref<{ id_institution?: string }>({});
const searchTerm = ref('');
const showDropdown = ref(false);
const isDropdownFocused = ref(false);

const filteredInstitutions = computed(() => {
	if (!searchTerm.value) return props.institutions || [];
	return (props.institutions || []).filter(inst =>
		inst.name.toLowerCase().includes(searchTerm.value.toLowerCase())
	);
});

const updateField = (field: string, value: any) => {
	emit('update:modelValue', {
		...props.modelValue,
		[field]: value
	});

	if (field === 'id_institution') {
		errors.value.id_institution = '';
		const selected = props.institutions?.find(i => i.id === value);
		searchTerm.value = selected?.name || '';
		showDropdown.value = false;
	}
};

const handleSearchInput = (event: Event) => {
	const value = (event.target as HTMLInputElement).value;
	searchTerm.value = value;

	if (!value.trim() && props.modelValue?.id_institution) {
		updateField('id_institution', '');
	}
};

const validate = () => {
	let valid = true;

	if (!props.modelValue?.id_institution) {
		errors.value.id_institution = 'Este campo es obligatorio';
		valid = false;
	}

	return valid;
};

defineExpose({ validate });

const handleSaved = async () => {
	closeModal();
	const res = await getInstitutions();
	emit('update:institutions', res.data);
};

const handleDropdownBlur = () => {
	setTimeout(() => {
		if (!isDropdownFocused.value) {
			showDropdown.value = false;
		}
	}, 200);
};

const handleDropdownFocus = () => {
	isDropdownFocused.value = true;
};

const handleDropdownBlurInternal = () => {
	isDropdownFocused.value = false;
	showDropdown.value = false;
};

watch(
	() => props.modelValue?.id_institution,
	(newId) => {
		if (!newId || !props.institutions?.length) {
			if (props.modelValue?.id_institution === '' && searchTerm.value !== '') {
				searchTerm.value = '';
			}
			return;
		}

		const selected = props.institutions.find(i => i.id === newId);
		searchTerm.value = selected?.name || '';
	},
	{ immediate: true }
);

watch(searchTerm, (newValue) => {
	if (!newValue.trim() && props.modelValue?.id_institution) {
		const isManualClear = !props.institutions?.some(inst =>
			inst.name === newValue || inst.id === props.modelValue?.id_institution
		);

		if (isManualClear) {
			updateField('id_institution', '');
		}
	}
});
</script>

<template>
	<div class="space-y-8">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-brand-900 mb-2">Información de la Institución</h2>
			<p class="text-gray-600 text-sm">Complete los datos académicos del proyecto dual</p>
		</div>

		<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
			<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
				<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">1</span>
				Selección de Institución
			</h3>

			<div class="space-y-4">
				<div>
					<label class="label">Institución Educativa</label>
					<div class="flex gap-3 items-start">
						<div class="flex-1 relative">
							<div class="relative">
								<input
									v-model="searchTerm"
									placeholder="Buscar institución por nombre..."
									class="input pl-10 pr-4 w-full"
									:class="{ 'border-red-500': errors.id_institution, 'border-brand-600': props.modelValue?.id_institution }"
									@focus="showDropdown = true; isDropdownFocused = true"
									@blur="handleDropdownBlur"
									@input="handleSearchInput" />
							</div>

							<transition name="fade">
								<ul
									v-if="showDropdown && filteredInstitutions.length"
									class="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg"
									@mouseenter="handleDropdownFocus"
									@mouseleave="handleDropdownBlurInternal">
									<li
										v-for="inst in filteredInstitutions"
										:key="inst.id"
										class="px-4 py-3 hover:bg-brand-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
										:class="{ 'bg-brand-50': props.modelValue?.id_institution === inst.id }"
										@click="updateField('id_institution', inst.id)">
										<div class="font-medium text-gray-900">{{ inst.name }}</div>
										<div v-if="inst.abbreviation" class="text-sm text-gray-500">{{ inst.abbreviation }}</div>
									</li>
								</ul>
							</transition>
						</div>

						<btn-create
							:table="'institution'"
							class="h-12 px-4 flex-shrink-0"
							tooltip="Crear nueva institución"
							@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
					</div>
					<p v-if="errors.id_institution" class="text-red-500 text-sm mt-2 flex items-center">
						<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
						</svg>
						{{ errors.id_institution }}
					</p>
				</div>

				<div
					v-if="props.modelValue?.id_institution && searchTerm && props.institutions?.find(i => i.id === props.modelValue?.id_institution)?.name === searchTerm"
					class="bg-green-50 border border-green-200 rounded-lg p-4">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
						<span class="text-green-800 font-medium">Institución seleccionada</span>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="mode === 'create' || (mode !== 'create' && reportaModeloDual !== true)"
			class="bg-gray-50 rounded-xl p-6 border border-gray-200">
			<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
				<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">2</span>
				Tipo de Seguimiento
			</h3>

			<div class="space-y-4">
				<label class="label">¿Este seguimiento incluye información del Modelo Dual?</label>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<label
						class="relative flex cursor-pointer rounded-xl border-2 p-4 transition-all"
						:class="reportaModeloDual === true
							? 'border-brand-600 bg-brand-50'
							: 'border-gray-200 hover:border-brand-300'">
						<input
							type="radio"
							:checked="reportaModeloDual === true"
							class="radio sr-only"
							@change="$emit('update:reportaModeloDual', true)" />
						<div class="flex items-center w-full">
							<div class="flex-shrink-0">
								<div
									class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
									:class="reportaModeloDual === true ? 'border-brand-600 bg-brand-600' : 'border-gray-400'">
									<svg v-if="reportaModeloDual === true" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</div>
							</div>
							<div class="ml-3">
								<p class="font-medium text-gray-900">Sí, con Modelo Dual</p>
								<p class="text-sm text-gray-500">Incluye información completa</p>
							</div>
						</div>
					</label>

					<label
						class="relative flex cursor-pointer rounded-xl border-2 p-4 transition-all"
						:class="reportaModeloDual === false
							? 'border-brand-600 bg-brand-50'
							: 'border-gray-200 hover:border-brand-300'">
						<input
							type="radio"
							:checked="reportaModeloDual === false"
							class="radio sr-only"
							@change="$emit('update:reportaModeloDual', false)" />
						<div class="flex items-center w-full">
							<div class="flex-shrink-0">
								<div
									class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
									:class="reportaModeloDual === false ? 'border-brand-600 bg-brand-600' : 'border-gray-400'">
									<svg v-if="reportaModeloDual === false" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</div>
							</div>
							<div class="ml-3">
								<p class="font-medium text-gray-900">No, solo seguimiento</p>
								<p class="text-sm text-gray-500">Información básica únicamente</p>
							</div>
						</div>
					</label>
				</div>
			</div>
		</div>

		<div class="bg-brand-100 rounded-xl p-6 border border-brand-200">
			<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
				<span class="w-6 h-6 bg-brand-200 rounded-full flex items-center justify-center text-brand-100 text-sm mr-2">3</span>
				Información Importante
			</h3>
			<div class="space-y-3">
				<div class="flex items-start">
					<svg class="w-5 h-5 text-brand-800 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
					</svg>
					<div>
						<p class="font-medium text-brand-800">Registro de Estudiantes</p>
						<p class="text-brand-800 text-sm">En el paso 3 podrás agregar los estudiantes participantes. Debes agregar al menos 1 estudiante.</p>
					</div>
				</div>
				<div class="flex items-start">
					<svg class="w-5 h-5 text-brand-800 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
					</svg>
					<div>
						<p class="font-medium text-brand-800">Flexibilidad</p>
						<p class="text-brand-800 text-sm">Puedes agregar tantos estudiantes como necesites. No hay límite máximo.</p>
					</div>
				</div>
			</div>
		</div>


		<mdl-institution
			:show="showModal"
			:data="modalData"
			@close="closeModal"
			@saved="handleSaved" />
	</div>
</template>

<style scoped>
.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors;
}
.radio {
	@apply sr-only;
}

.fade-enter-active,
.fade-leave-active {
	transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>