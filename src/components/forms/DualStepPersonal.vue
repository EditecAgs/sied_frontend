<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
	modelValue: Object,
	careers: Array,
	specialties: Array
});
const emit = defineEmits(['update:modelValue']);

const errors = ref({
	control_number: '',
	name_student: '',
	lastname: '',
	gender: '',
	semester: '',
	id_career: '',
	id_specialty: '',
});


const searchCareer = ref('');
const searchSpecialty = ref('');
const showCareerDropdown = ref(false);
const showSpecialtyDropdown = ref(false);


const filteredCareers = computed(() => {
	if (!searchCareer.value) return props.careers || [];
	return (props.careers || []).filter(c =>
		c.name.toLowerCase().includes(searchCareer.value.toLowerCase())
	);
});
const filteredSpecialties = computed(() => {
	if (!searchSpecialty.value) return props.specialties || [];
	return (props.specialties || []).filter(s =>
		s.name.toLowerCase().includes(searchSpecialty.value.toLowerCase())
	);
});

const update = (field, value) => {
	emit('update:modelValue', { ...props.modelValue, [field]: value });
	if (errors.value[field]) errors.value[field] = '';


	if (field === 'id_career') {
		const selected = props.careers?.find(c => c.id === value);
		searchCareer.value = selected?.name || '';
		showCareerDropdown.value = false;
	}
	if (field === 'id_specialty') {
		const selected = props.specialties?.find(s => s.id === value);
		searchSpecialty.value = selected?.name || '';
		showSpecialtyDropdown.value = false;
	}
};

const validate = () => {
	let valid = true;

	for (const field in errors.value) {
		if (!props.modelValue?.[field]) {
			errors.value[field] = 'Este campo es obligatorio';
			valid = false;
		}
	}
	return valid;
};

defineExpose({ validate });
watch(
  [
    () => props.modelValue?.id_career,
    () => props.modelValue?.id_specialty
  ],
  ([newCareerId, newSpecialtyId]) => {
    if (newCareerId && props.careers?.length) {
      const selectedCareer = props.careers.find(c => c.id === newCareerId);
      searchCareer.value = selectedCareer?.name || '';
    }

    if (newSpecialtyId && props.specialties?.length) {
      const selectedSpecialty = props.specialties.find(s => s.id === newSpecialtyId);
      searchSpecialty.value = selectedSpecialty?.name || '';
    }
  },
  { immediate: true }
);

</script>

<template>
	<div class="space-y-6">
		<h2 class="text-xl font-semibold text-brand-900 mb-6">Datos del Estudiante</h2>

		<div>
			<label class="label">No. de control / Matrícula</label>
			<input
				type="text" :value="modelValue.control_number" class="input"
				:class="{ 'border-red-500': errors.control_number }"
				@input="update('control_number', $event.target.value)" />
			<p v-if="errors.control_number" class="text-red-500 text-sm mt-1">{{ errors.control_number }}</p>
		</div>

		<div>
			<label class="label">Nombre</label>
			<input
				type="text" :value="modelValue.name_student" class="input"
				:class="{ 'border-red-500': errors.name_student }"
				@input="update('name_student', $event.target.value)" />
			<p v-if="errors.name_student" class="text-red-500 text-sm mt-1">{{ errors.name_student }}</p>
		</div>

		<div>
			<label class="label">Apellidos</label>
			<input
				type="text" :value="modelValue.lastname" class="input"
				:class="{ 'border-red-500': errors.lastname }"
				@input="update('lastname', $event.target.value)" />
			<p v-if="errors.lastname" class="text-red-500 text-sm mt-1">{{ errors.lastname }}</p>
		</div>

		<div>
			<label class="label">Género</label>
			<div class="flex space-x-4">
				<label class="inline-flex items-center space-x-2">
					<input
						type="radio" class="radio" :checked="modelValue.gender === 'Masculino'"
						@change="update('gender', 'Masculino')" />
					<span>Masculino</span>
				</label>
				<label class="inline-flex items-center space-x-2">
					<input
						type="radio" class="radio" :checked="modelValue.gender === 'Femenino'"
						@change="update('gender', 'Femenino')" />
					<span>Femenino</span>
				</label>
			</div>
			<p v-if="errors.gender" class="text-red-500 text-sm mt-1">{{ errors.gender }}</p>
		</div>

		<div>
			<label class="label">Semestre que cursa</label>
			<input
				type="number" min="1" max="12" class="input" :value="modelValue.semester"
				:class="{ 'border-red-500': errors.semester }"
				@input="update('semester', $event.target.value)" />
			<p v-if="errors.semester" class="text-red-500 text-sm mt-1">{{ errors.semester }}</p>
		</div>

		<div>
			<label class="label">Modalidad</label>
			<select
				class="input"
				:class="{ 'border-red-500': errors.modality }"
				:value="modelValue.modality"
				@change="update('modality', $event.target.value)">
				<option value="" disabled>Selecciona una modalidad</option>
				<option value="Becario">Becario</option>
				<option value="Residente">Residente</option>
				<option value="Modelo Dual">Modelo Dual</option>
			</select>
		</div>

		<div>
			<label class="label">Carrera</label>
			<div class="relative">
				<input
					v-model="searchCareer" class="input" placeholder="Buscar carrera..."
					:class="{ 'border-red-500': errors.id_career }" @focus="showCareerDropdown = true"
					@input="showCareerDropdown = true" />
				<ul
					v-if="showCareerDropdown && filteredCareers.length"
					class="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md">
					<li
						v-for="carrera in filteredCareers" :key="carrera.id"
						class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
						@click="update('id_career', carrera.id)">
						{{ carrera.name }}
					</li>
				</ul>
			</div>
			<p v-if="errors.id_career" class="text-red-500 text-sm mt-1">{{ errors.id_career }}</p>
		</div>

		<div>
			<label class="label">Especialidad</label>
			<div class="relative">
				<input
					v-model="searchSpecialty" class="input"
					placeholder="Buscar especialidad..." :class="{ 'border-red-500': errors.id_specialty }" @focus="showSpecialtyDropdown = true"
					@input="showSpecialtyDropdown = true" />
				<ul
					v-if="showSpecialtyDropdown && filteredSpecialties.length"
					class="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md">
					<li
						v-for="specialty in filteredSpecialties" :key="specialty.id"
						class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
						@click="update('id_specialty', specialty.id)">
						{{ specialty.name }}
					</li>
				</ul>
			</div>
			<p v-if="errors.id_specialty" class="text-red-500 text-sm mt-1">{{ errors.id_specialty }}</p>
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
