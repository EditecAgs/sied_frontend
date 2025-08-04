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


const validate = () => {
	if (!props.modelValue?.id_institution) {
		errors.value.id_institution = 'Este campo es obligatorio';
		return false;
	}
	return true;
};

defineExpose({ validate });

const handleSaved = async () => {
	closeModal();
	const res = await getInstitutions();
	emit('update:institutions', res.data);
};
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-xl font-semibold text-brand-900 mb-6">Información de la Institución</h2>

		<div>
			<label class="label">Selecciona una institución</label>
			<div class="flex gap-3 relative">
				<!-- Campo de texto con filtro -->
				<div class="flex-1 relative">
					<input
						v-model="searchTerm"
						@focus="showDropdown = true"
						@input="showDropdown = true"
						placeholder="Buscar institución..."
						class="input"
						:class="{ 'border-red-500': errors.id_institution }"
					/>
					<ul
						v-if="showDropdown && filteredInstitutions.length"
						class="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md">
						<li
							v-for="inst in filteredInstitutions"
							:key="inst.id"
							@click="updateField('id_institution', inst.id)"
							class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
							{{ inst.name }}
						</li>
					</ul>
				</div>

				<btn-create
					:table="'institution'"
					class="h-auto"
					@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
			</div>
			<p v-if="errors.id_institution" class="text-red-500 text-sm mt-1">{{ errors.id_institution }}</p>
		</div>

		<mdl-institution
			:show="showModal"
			:data="modalData"
			@close="closeModal"
			@saved="handleSaved" />

		<div
			v-if="mode === 'create' || (mode !== 'create' && reportaModeloDual !== true)"
			class="pt-6 border-t space-y-4">
			<label class="label">¿Este seguimiento tiene información del Modelo Dual?</label>
			<div class="flex space-x-6">
				<label class="inline-flex items-center space-x-2 cursor-pointer">
					<input
						type="radio"
						:checked="reportaModeloDual === true"
						class="radio"
						@change="$emit('update:reportaModeloDual', true)" />
					<span>Sí</span>
				</label>
				<label class="inline-flex items-center space-x-2 cursor-pointer">
					<input
						type="radio"
						:checked="reportaModeloDual === false"
						class="radio"
						@change="$emit('update:reportaModeloDual', false)" />
					<span>No</span>
				</label>
			</div>
		</div>
	</div>
</template>

<style scoped>
.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-800 focus:border-brand-800;
}
.radio {
	@apply h-5 w-5 text-brand-800 focus:ring-brand-800 border-gray-300;
}
</style>
