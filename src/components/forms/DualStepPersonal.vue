<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted } from "vue";

const props = defineProps({
	modelValue: Object,
	careers: Array,
	specialties: Array,
	numberStudent: Number,
	institution: Object
});

const emit = defineEmits(['update:modelValue', 'validate']);

const localModel = ref({...props.modelValue});
const students = ref([]);

const form = ref({
	control_number: "",
	name_student: "",
	lastname: "",
	gender: "",
	semester: "",
	id_career: "",
	id_specialty: "",
});

const errors = ref({});

const addedCount = computed(() => students.value.length);
const canSubmit = computed(() => addedCount.value === props.numberStudent);

const validateForm = () => {
	errors.value = {};
	let valid = true;

	const requiredFields = ['control_number', 'name_student', 'lastname', 'gender', 'semester', 'id_career', 'id_specialty'];

	requiredFields.forEach(field => {
		if (!form.value[field]) {
			errors.value[field] = "Este campo es obligatorio";
			valid = false;
		}
	});

	return valid;
};

const validate = () => {
	const requiredStudents = Number(props.numberStudent) || 0;
	const currentStudents = students.value.length;

	if (currentStudents < requiredStudents) {
		emit('validate', false);
		return false;
	}

	emit('validate', true);
	return true;
};

const addStudent = () => {
	if (!validateForm()) {
		console.log('Validación falló, no se puede agregar estudiante');
		return;
	}

	const newStudent = {
		id: null,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		id_student: null,
		id_dual_project: null,
		deleted_at: null,
		student: {
			id: null,
			control_number: form.value.control_number,
			name: form.value.name_student,
			lastname: form.value.lastname,
			gender: form.value.gender,
			semester: parseInt(form.value.semester),
			id_institution: props.institution?.id || '',
			id_career: parseInt(form.value.id_career),
			id_specialty: parseInt(form.value.id_specialty),
			institution: props.institution || {},
			career: props.careers.find(c => c.id === parseInt(form.value.id_career)) || {},
			specialty: props.specialties.find(s => s.id === parseInt(form.value.id_specialty)) || {}
		}
	};

	students.value.push(newStudent);

	const updatedValue = {
		...localModel.value,
		dual_project_students: [...students.value]
	};

	localModel.value = updatedValue;
	emit('update:modelValue', updatedValue);

	form.value = {
		control_number: "",
		name_student: "",
		lastname: "",
		gender: "",
		semester: "",
		id_career: "",
		id_specialty: "",
	};

	errors.value = {};
	console.log('Estudiante agregado correctamente. Total:', students.value.length);

	validate();
};

const removeStudent = (index) => {
	students.value.splice(index, 1);

	const updatedValue = {
		...localModel.value,
		dual_project_students: [...students.value]
	};

	localModel.value = updatedValue;
	emit('update:modelValue', updatedValue);

	validate();
};

const initializeStudents = () => {
	if (props.modelValue?.dual_project_students && Array.isArray(props.modelValue.dual_project_students)) {
		students.value = [...props.modelValue.dual_project_students];
		console.log('Estudiantes inicializados:', students.value.length);
	} else {
		students.value = [];
	}
};

onMounted(() => {
	initializeStudents();
	localModel.value = {...props.modelValue};

	validate();
});


defineExpose({
	validate
});
</script>

<template>
	<div class="space-y-8">
		<div class="bg-blue-50 p-4 rounded-lg">
			<h3 class="text-lg font-semibold text-blue-800 mb-2">Institución seleccionada</h3>
			<p class="text-blue-600 font-medium">
				{{ institution.name || 'No se ha seleccionado institución' }}
			</p>
			<p class="text-sm text-blue-500 mt-1">
				ID: {{ institution.id || 'N/A' }}
			</p>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-md space-y-4">
			<h2 class="text-xl font-bold text-brand-900">Registro de Estudiante</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">No. Control</label>
					<input v-model="form.control_number" class="input" placeholder="Número de control" />
					<p v-if="errors.control_number" class="text-red-500 text-sm">{{ errors.control_number }}</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
					<input v-model="form.name_student" class="input" placeholder="Nombre del estudiante" />
					<p v-if="errors.name_student" class="text-red-500 text-sm">{{ errors.name_student }}</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
					<input v-model="form.lastname" class="input" placeholder="Apellidos del estudiante" />
					<p v-if="errors.lastname" class="text-red-500 text-sm">{{ errors.lastname }}</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
					<input v-model="form.semester" type="number" min="1" max="12" class="input" placeholder="Semestre (1-12)" />
					<p v-if="errors.semester" class="text-red-500 text-sm">{{ errors.semester }}</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
					<select v-model="form.id_career" class="input">
						<option value="">Selecciona carrera</option>
						<option v-for="c in careers" :key="c.id" :value="c.id">{{ c.name }}</option>
					</select>
					<p v-if="errors.id_career" class="text-red-500 text-sm">{{ errors.id_career }}</p>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
					<select v-model="form.id_specialty" class="input">
						<option value="">Selecciona especialidad</option>
						<option v-for="s in specialties" :key="s.id" :value="s.id">{{ s.name }}</option>
					</select>
					<p v-if="errors.id_specialty" class="text-red-500 text-sm">{{ errors.id_specialty }}</p>
				</div>

				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2">Género</label>
					<div class="flex gap-6">
						<label class="flex items-center">
							<input v-model="form.gender" type="radio" value="Masculino" class="mr-2" /> Masculino
						</label>
						<label class="flex items-center">
							<input v-model="form.gender" type="radio" value="Femenino" class="mr-2" /> Femenino
						</label>
					</div>
					<p v-if="errors.gender" class="text-red-500 text-sm">{{ errors.gender }}</p>
				</div>
			</div>

			<div class="flex justify-between items-center mt-6">
				<button
					class="px-4 py-2 bg-brand-800 text-white rounded-lg disabled:bg-gray-400 hover:bg-brand-900 transition"
					:disabled="addedCount >= numberStudent"
					@click="addStudent">
					Agregar estudiante
				</button>

				<span class="text-sm text-gray-600 font-medium">
					{{ addedCount }} / {{ numberStudent }} registrados
				</span>
			</div>
		</div>

		<div v-if="students.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
			<div class="overflow-x-auto">
				<table class="min-w-full">
					<thead>
						<tr class="bg-brand-800 text-white">
							<th class="px-4 py-2 text-left">No. Control</th>
							<th class="px-4 py-2 text-left">Nombre</th>
							<th class="px-4 py-2 text-left">Apellidos</th>
							<th class="px-4 py-2 text-left">Semestre</th>
							<th class="px-4 py-2 text-left">Carrera</th>
							<th class="px-4 py-2 text-left">Especialidad</th>
							<th class="px-4 py-2 text-left">Género</th>
							<th class="px-4 py-2 text-left">Acciones</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(s, i) in students" :key="i" class="border-b hover:bg-gray-50">
							<td class="px-4 py-2">{{ s.student.control_number }}</td>
							<td class="px-4 py-2">{{ s.student.name }}</td>
							<td class="px-4 py-2">{{ s.student.lastname }}</td>
							<td class="px-4 py-2">{{ s.student.semester }}</td>
							<td class="px-4 py-2">{{ s.student.career?.name }}</td>
							<td class="px-4 py-2">{{ s.student.specialty?.name }}</td>
							<td class="px-4 py-2">{{ s.student.gender }}</td>
							<td class="px-4 py-2">
								<button
									class="text-red-500 hover:text-red-700 px-2 py-1 rounded disabled:opacity-50"
									:disabled="students.length <= 1"
									@click="removeStudent(i)">
									Eliminar
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div v-else class="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
			No se han agregado estudiantes aún. Utilice el formulario superior para agregarlos.
		</div>
	</div>
</template>

<style scoped>
.input {
	@apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent;
}
</style>