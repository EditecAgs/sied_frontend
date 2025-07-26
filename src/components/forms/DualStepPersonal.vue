<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
import { getCareers } from '../../services/institutions/careers';

const careers = ref([]);
onMounted(async () => {
	const res = await getCareers();
	careers.value = res.data;
});

const props = defineProps({
	modelValue: Object
});
const emit = defineEmits(['update:modelValue']);

const update = (field, value) => {
	emit('update:modelValue', { ...props.modelValue, [field]: value });
	if (errors.value[field]) errors.value[field] = ''; // limpiar error al escribir
};

const errors = ref({
	matricula: '',
	nombre: '',
	apellidos: '',
	genero: '',
	semestre: '',
	carrera: ''
});

const validate = () => {
	let valid = true;

	if (!props.modelValue?.matricula) {
		errors.value.matricula = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.nombre) {
		errors.value.nombre = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.apellidos) {
		errors.value.apellidos = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.genero) {
		errors.value.genero = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.semestre) {
		errors.value.semestre = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.carrera) {
		errors.value.carrera = 'Este campo es obligatorio';
		valid = false;
	}

	return valid;
};

defineExpose({ validate });
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-xl font-semibold text-brand-900 mb-6">Datos del Estudiante</h2>

		<!-- Matrícula -->
		<div>
			<label class="label">No. de control / Matrícula</label>
			<input
				type="text"
				:value="modelValue.matricula"
				class="input"
				:class="{ 'border-red-500': errors.matricula }"
				@input="update('matricula', $event.target.value)" />
			<p v-if="errors.matricula" class="text-red-500 text-sm mt-1">{{ errors.matricula }}</p>
		</div>

		<!-- Nombre -->
		<div>
			<label class="label">Nombre</label>
			<input
				type="text"
				:value="modelValue.nombre"
				class="input"
				:class="{ 'border-red-500': errors.nombre }"
				@input="update('nombre', $event.target.value)" />
			<p v-if="errors.nombre" class="text-red-500 text-sm mt-1">{{ errors.nombre }}</p>
		</div>

		<!-- Apellidos -->
		<div>
			<label class="label">Apellidos</label>
			<input
				type="text"
				:value="modelValue.apellidos"
				class="input"
				:class="{ 'border-red-500': errors.apellidos }"
				@input="update('apellidos', $event.target.value)" />
			<p v-if="errors.apellidos" class="text-red-500 text-sm mt-1">{{ errors.apellidos }}</p>
		</div>

		<!-- Género -->
		<div>
			<label class="label">Género</label>
			<div class="flex space-x-4">
				<label class="inline-flex items-center space-x-2">
					<input
						type="radio"
						class="radio"
						:checked="modelValue.genero === 'Masculino'"
						@change="update('genero', 'Masculino')" />
					<span>Masculino</span>
				</label>
				<label class="inline-flex items-center space-x-2">
					<input
						type="radio"
						class="radio"
						:checked="modelValue.genero === 'Femenino'"
						@change="update('genero', 'Femenino')" />
					<span>Femenino</span>
				</label>
			</div>
			<p v-if="errors.genero" class="text-red-500 text-sm mt-1">{{ errors.genero }}</p>
		</div>

		<!-- Semestre -->
		<div>
			<label class="label">Semestre que cursa</label>
			<input
				type="number"
				min="1"
				max="12"
				class="input"
				:value="modelValue.semestre"
				:class="{ 'border-red-500': errors.semestre }"
				@input="update('semestre', $event.target.value)" />
			<p v-if="errors.semestre" class="text-red-500 text-sm mt-1">{{ errors.semestre }}</p>
		</div>

		<!-- Carrera -->
		<div>
			<label class="label">Carrera</label>
			<select
				class="select"
				:value="modelValue.carrera"
				:class="{ 'border-red-500': errors.carrera }"
				@change="update('carrera', $event.target.value)">
				<option value="">Seleccione una opción</option>
				<option v-for="carrera in careers" :key="carrera.id" :value="carrera.id">
					{{ carrera.name }}
				</option>
			</select>
			<p v-if="errors.carrera" class="text-red-500 text-sm mt-1">{{ errors.carrera }}</p>
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
.radio {
	@apply h-5 w-5 text-brand-800 focus:ring-brand-800 border-gray-300;
}
</style>
