<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { getCareers } from '../../services/institutions/careers';
import { getSpecialties } from '../../services/institutions/specialties';

const careers = ref([]);
const specialties = ref([]);

onMounted(async () => {
	const resCareers = await getCareers();
	careers.value = resCareers.data;

	const resSpecialties = await getSpecialties();
	specialties.value = resSpecialties.data;
});

const props = defineProps({
	modelValue: Object
});
const emit = defineEmits(['update:modelValue']);

const errors = ref({
	control_number: '',
	name_student: '',
	lastname: '',
	gender: '',
	semester: '',
	id_career: '',
	id_specialty: ''
});

const update = (field, value) => {
	emit('update:modelValue', { ...props.modelValue, [field]: value });
	if (errors.value[field]) errors.value[field] = '';
};

const validate = () => {
	let valid = true;

	if (!props.modelValue?.control_number) {
		errors.value.control_number = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.name_student) {
		errors.value.name_student = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.lastname) {
		errors.value.lastname = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.gender) {
		errors.value.gender = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.semester) {
		errors.value.semester = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.id_career) {
		errors.value.id_career = 'Este campo es obligatorio';
		valid = false;
	}
	if (!props.modelValue?.id_specialty) {
		errors.value.id_specialty = 'Este campo es obligatorio';
		valid = false;
	}

	return valid;
};

defineExpose({ validate });
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-xl font-semibold text-brand-900 mb-6">Datos del Estudiante</h2>

		<!-- No. de control / Matrícula -->
		<div>
			<label class="label">No. de control / Matrícula</label>
			<input
				type="text"
				:value="modelValue.control_number"
				class="input"
				:class="{ 'border-red-500': errors.control_number }"
				@input="update('control_number', $event.target.value)" />
			<p v-if="errors.control_number" class="text-red-500 text-sm mt-1">{{ errors.control_number }}</p>
		</div>

		<!-- Nombre -->
		<div>
			<label class="label">Nombre</label>
			<input
				type="text"
				:value="modelValue.name_student"
				class="input"
				:class="{ 'border-red-500': errors.name_student }"
				@input="update('name_student', $event.target.value)" />
			<p v-if="errors.name_student" class="text-red-500 text-sm mt-1">{{ errors.name_student }}</p>
		</div>

		<!-- Apellidos -->
		<div>
			<label class="label">Apellidos</label>
			<input
				type="text"
				:value="modelValue.lastname"
				class="input"
				:class="{ 'border-red-500': errors.lastname }"
				@input="update('lastname', $event.target.value)" />
			<p v-if="errors.lastname" class="text-red-500 text-sm mt-1">{{ errors.lastname }}</p>
		</div>

		<!-- Género -->
		<div>
			<label class="label">Género</label>
			<div class="flex space-x-4">
				<label class="inline-flex items-center space-x-2">
					<input
						type="radio"
						class="radio"
						:checked="modelValue.gender === 'Masculino'"
						@change="update('gender', 'Masculino')" />
					<span>Masculino</span>
				</label>
				<label class="inline-flex items-center space-x-2">
					<input
						type="radio"
						class="radio"
						:checked="modelValue.gender === 'Femenino'"
						@change="update('gender', 'Femenino')" />
					<span>Femenino</span>
				</label>
			</div>
			<p v-if="errors.gender" class="text-red-500 text-sm mt-1">{{ errors.gender }}</p>
		</div>

		<!-- Semestre -->
		<div>
			<label class="label">Semestre que cursa</label>
			<input
				type="number"
				min="1"
				max="12"
				class="input"
				:value="modelValue.semester"
				:class="{ 'border-red-500': errors.semester }"
				@input="update('semester', $event.target.value)" />
			<p v-if="errors.semester" class="text-red-500 text-sm mt-1">{{ errors.semester }}</p>
		</div>

		<!-- Carrera -->
		<div>
			<label class="label">Carrera</label>
			<select
				class="select"
				:value="modelValue.id_career"
				:class="{ 'border-red-500': errors.id_career }"
				@change="update('id_career', $event.target.value)">
				<option value="">Seleccione una opción</option>
				<option v-for="carrera in careers" :key="carrera.id" :value="carrera.id">
					{{ carrera.name }}
				</option>
			</select>
			<p v-if="errors.id_career" class="text-red-500 text-sm mt-1">{{ errors.id_career }}</p>
		</div>

		<!-- Especialidad -->
		<div>
			<label class="label">Especialidad</label>
			<select
				class="select"
				:value="modelValue.id_specialty"
				:class="{ 'border-red-500': errors.id_specialty }"
				@change="update('id_specialty', $event.target.value)">
				<option value="">Seleccione una opción</option>
				<option v-for="specialty in specialties" :key="specialty.id" :value="specialty.id">
					{{ specialty.name }}
				</option>
			</select>
			<p v-if="errors.id_specialty" class="text-red-500 text-sm mt-1">{{ errors.id_specialty }}</p>
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