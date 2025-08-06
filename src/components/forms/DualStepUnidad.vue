<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

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

const update = (field, value) => {
	emit('update:modelValue', {
		...props.modelValue,
		[field]: value
	});
	if (errors.value[field]) errors.value[field] = '';
};

const period_start = ref(props.modelValue.period_start || null);
const period_end = ref(props.modelValue.period_end || null);

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

// Validación general
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

	// Validar que fecha fin sea mayor a fecha inicio
	const start = new Date(props.modelValue?.period_start);
	const end = new Date(props.modelValue?.period_end);
	if (start && end && start > end) {
		errors.value.period_end = 'La fecha de fin debe ser posterior a la fecha de inicio';
		isValid = false;
	}

	return isValid;
};

defineExpose({ validate });
</script>


<template>
	<div class="space-y-8">
		<h2 class="text-xl font-semibold text-brand-900">Unidad Dual</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Nombre del Proyecto -->
			<div>
				<label class="label">Nombre del Proyecto</label>
				<input
					type="text"
					class="input"
					:value="modelValue.name_report"
					@input="update('name_report', $event.target.value)" />
				<p v-if="errors.name_report" class="text-red-500 text-sm mt-1">{{ errors.name_report }}</p>
			</div>

			<!-- Área del Proyecto Dual -->
			<div>
				<label class="label">Área del Proyecto Dual</label>
				<select class="select" :value="modelValue.id_dual_area" @change="update('id_dual_area', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="area in areas" :key="area.id" :value="area.id">{{ area.name }}</option>
				</select>
				<p v-if="errors.id_dual_area" class="text-red-500 text-sm mt-1">{{ errors.id_dual_area }}</p>
			</div>

			<!-- Organización -->
			<div>
				<label class="label">Organización</label>
				<select class="select" :value="modelValue.id_organization" @change="update('id_organization', $event.target.value)">
					<option value="">Seleccione una organización</option>
					<option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
				</select>
				<p v-if="errors.id_organization" class="text-red-500 text-sm mt-1">{{ errors.id_organization }}</p>
			</div>
		</div>

		<!-- Fechas -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 z-50 relative overflow-visible">
			<!-- Fecha de Inicio -->
			<div class="relative z-40">
				<label class="label">Fecha de Inicio del Proyecto Dual</label>
				<Datepicker
					v-model="period_start"
					placeholder="Seleccione la fecha de inicio"
					:teleport="true"
					class="input z-40"
				/>
				<p v-if="errors.period_start" class="text-red-500 text-sm mt-1">{{ errors.period_start }}</p>
			</div>

			<!-- Fecha de Fin -->
			<div class="relative z-40">
				<label class="label">Fecha de Fin del Proyecto Dual</label>
				<Datepicker
					v-model="period_end"
					placeholder="Seleccione la fecha de fin"
					:teleport="true"
					class="input z-40"
				/>
				<p v-if="errors.period_end" class="text-red-500 text-sm mt-1">{{ errors.period_end }}</p>
			</div>
		</div>

		<!-- Estado y Apoyo -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="label">Estado del Convenio Dual</label>
				<select class="select" :value="modelValue.status_document" @change="update('status_document', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="estado in agreementStatuses" :key="estado.id" :value="estado.id">{{ estado.name }}</option>
				</select>
				<p v-if="errors.status_document" class="text-red-500 text-sm mt-1">{{ errors.status_document }}</p>
			</div>

			<div>
				<label class="label">Tipo de Apoyo Económico</label>
				<select class="select" :value="modelValue.economic_support" @change="update('economic_support', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="apoyo in supportTypes" :key="apoyo.id" :value="apoyo.id">{{ apoyo.name }}</option>
				</select>
				<p v-if="errors.economic_support" class="text-red-500 text-sm mt-1">{{ errors.economic_support }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input,
.select {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-800 focus:border-brand-800;
}
</style>

