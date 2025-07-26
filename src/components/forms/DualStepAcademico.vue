<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
import { getInstitutions } from '../../services/institutions/institutions';
import btnCreate from '../../components/buttons/btnCreate.vue';
import mdlInstitution from '../../components/modals/mdlInstitution.vue';
import { useModal } from '../../composables/UseModal';

const institutions = ref([]);
const { showModal, modalData, openModal, closeModal } = useModal();

const props = defineProps({
	modelValue: Object,
	reportaModeloDual: Boolean
});


const emit = defineEmits(['update:modelValue', 'update:reportaModeloDual', 'submitSinUnidadDual']);

const errors = ref<{ institucion?: string }>({});

onMounted(async () => {
	const res = await getInstitutions();
	institutions.value = res.data;
});

watch(() => props.modelValue, () => {
	if (props.modelValue?.institucion) {
		errors.value.institucion = '';
	}
}, { deep: true });

const updateField = (field: string, value: any) => {
	emit('update:modelValue', {
		...props.modelValue,
		[field]: value
	});
	if (field === 'institucion' && value) {
		errors.value.institucion = '';
	}
};

const validate = () => {
	if (!props.modelValue?.institucion) {
		errors.value.institucion = 'Este campo es obligatorio';
		return false;
	}
	return true;
};

defineExpose({ validate });

const buttonClass = (isSelected: boolean) => [
	'px-4 py-2 rounded-lg border flex-1 transition',
	isSelected ? 'bg-brand-800 text-white border-brand-800' : 'border-gray-300 hover:bg-gray-50'
];

const handleSaved = async () => {
	closeModal();
	const res = await getInstitutions();
	institutions.value = res.data;
};
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-xl font-semibold text-brand-900 mb-6">Información de la Institución</h2>

		<div>
			<label class="label">Selecciona una institución</label>
			<select
				:value="modelValue.institucion"
				class="select"
				:class="{ 'border-red-500': errors.institucion }"
				@change="updateField('institucion', $event.target.value)">
				<option value="">Seleccione una institución</option>
				<option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
			</select>
			<p v-if="errors.institucion" class="text-red-500 text-sm mt-1">{{ errors.institucion }}</p>
		</div>

		<div class="mt-2">
			<btn-create
				:table="'institution'"
				@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
		</div>

		<mdl-institution
			:show="showModal"
			:data="modalData"
			@close="closeModal"
			@saved="handleSaved" />

		<div class="pt-6 border-t space-y-4">
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

		<div v-if="reportaModeloDual === false" class="text-center pt-4">
			<button
				class="bg-brand-800 text-white px-6 py-2 rounded-lg hover:bg-brand-900"
				@click="$emit('submitSinUnidadDual')">
				Guardar e Imprimir
			</button>
		</div>
	</div>
</template>

<style scoped>
.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input, .select {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-800 focus:border-brand-800;
}
.radio {
	@apply h-5 w-5 text-brand-800 focus:ring-brand-800 border-gray-300;
}
</style>
