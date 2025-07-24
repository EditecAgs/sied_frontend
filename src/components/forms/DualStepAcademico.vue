<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { getInstitutions } from '../../services/institutions/institutions';
import { getAcademicPeriods } from '../../services/institutions/academic-periods';
import { getsubsystems } from '../../services/institutions/subsystems';

const institutions = ref([]);
const subsystems = ref([]);
const academicPeriods = ref([]);

onMounted(async () => {
	const [resInstitutions, resSubsystems, resPeriods] = await Promise.all([
		getInstitutions(),
		getsubsystems(),
		getAcademicPeriods()
	]);
	institutions.value = resInstitutions.data;
	subsystems.value = resSubsystems.data;
	academicPeriods.value = resPeriods.data;
});

defineProps({
	modelValue: Object,
	reportaModeloDual: Boolean
});

defineEmits(['update:modelValue', 'update:reportaModeloDual', 'submitSinUnidadDual']);

const buttonClass = (isSelected) => [
	'px-4 py-2 rounded-lg border flex-1 transition',
	isSelected ? 'bg-brand-800 text-white border-brand-800' : 'border-gray-300 hover:bg-gray-50'
];
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-xl font-semibold text-brand-900 mb-6">Información de la Institución</h2>

		<!-- Nombre -->
		<div>
			<label class="label">Nombre de la institución</label>
			<input
				type="text" :value="modelValue.nombre" class="input"
				@input="$emit('update:modelValue', { ...modelValue, nombre: $event.target.value })" />
		</div>

		<!-- Tipo de Institución -->
		<div>
			<label class="label">Tipo de Institución</label>
			<div class="flex space-x-4">
				<button
					type="button" :class="buttonClass(modelValue.tipoInstitucion === 'Publica')"
					@click="$emit('update:modelValue', { ...modelValue, tipoInstitucion: 'Publica' })">
					Pública
				</button>
				<button
					type="button" :class="buttonClass(modelValue.tipoInstitucion === 'Privada')"
					@click="$emit('update:modelValue', { ...modelValue, tipoInstitucion: 'Privada' })">
					Privada
				</button>
			</div>
		</div>

		<!-- Institución -->

		<!-- Subsistema -->
		<div>
			<label class="label">Subsistema</label>
			<select
				:value="modelValue.subsistema" class="select"
				@change="$emit('update:modelValue', { ...modelValue, subsistema: $event.target.value })">
				<option value="">Seleccione una opción</option>
				<option v-for="sub in subsystems" :key="sub.id" :value="sub.id">{{ sub.name }}</option>
			</select>
		</div>

		<!-- Periodo Académico -->
		<div>
			<label class="label">Periodo Académico</label>
			<select
				:value="modelValue.periodoAcademico" class="select"
				@change="$emit('update:modelValue', { ...modelValue, periodoAcademico: $event.target.value })">
				<option value="">Seleccione una opción</option>
				<option v-for="period in academicPeriods" :key="period.id" :value="period.id">{{ period.name }}</option>
			</select>
		</div>

		<!-- Dirección -->
		<div>
			<label class="label">Dirección</label>
			<input
				type="text" :value="modelValue.direccion" class="input"
				@input="$emit('update:modelValue', { ...modelValue, direccion: $event.target.value })" />
		</div>

		<!-- ¿Tiene modelo dual? -->
		<div class="pt-6 border-t space-y-4">
			<label class="label">¿Este seguimiento tiene información del Modelo Dual?</label>
			<div class="flex space-x-6">
				<label class="inline-flex items-center space-x-2 cursor-pointer">
					<input
						type="radio" :checked="reportaModeloDual === true" class="radio"
						@change="$emit('update:reportaModeloDual', true)" />
					<span>Sí</span>
				</label>
				<label class="inline-flex items-center space-x-2 cursor-pointer">
					<input
						type="radio" :checked="reportaModeloDual === false" class="radio"
						@change="$emit('update:reportaModeloDual', false)" />
					<span>No</span>
				</label>
			</div>
		</div>

		<!-- Botón si no hay unidad dual -->
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
