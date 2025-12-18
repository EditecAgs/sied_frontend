<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted, nextTick } from "vue";
import { VTooltip } from 'floating-vue'
import 'floating-vue/dist/style.css'
import btnCreate from '../../components/buttons/btnCreate.vue';
import mdlCareers from '../modals/modals-forms/mdlCareers.vue';
import mdlSpecialties from '../modals/modals-forms/mdlSpecialties.vue';
import { useModal } from '../../composables/UseModal';

const props = defineProps({
	modelValue: Object,
	careers: Array,
	specialties: Array,
	institution: Object
});

const emit = defineEmits(['update:modelValue', 'validate', 'update:careers', 'update:specialties']);

const { showModal: showCareerModal, modalData: careerModalData, openModal: openCareerModal, closeModal: closeCareerModal } = useModal();
const { showModal: showSpecialtyModal, modalData: specialtyModalData, openModal: openSpecialtyModal, closeModal: closeSpecialtyModal } = useModal();

const localModel = ref({...props.modelValue});
const students = ref([]);
const careerSelectRef = ref(null);

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
const pendingCareerSelection = ref(false);
const pendingSpecialtySelection = ref(false);
const isCreatingSpecialty = ref(false);

const fieldHelpTexts = {
	control_number: 'Número de control o matrícula único del estudiante en la institución educativa.',
	name_student: 'Nombre(s) del estudiante.',
	lastname: 'Apellidos del estudiante.',
	gender: 'Género con el que se identifica el estudiante.',
	semester: 'Periodo académico actual del estudiante (generalmente semestres o cuatrimestres).',
	id_career: 'Carrera o programa educativo en el que está inscrito el estudiante.',
	id_specialty: 'Especialidad o área de enfoque dentro de la carrera (opcional).'
}

const vTooltip = VTooltip

const handleSavedCareer = async (savedData) => {
	try {
		closeCareerModal();
		emit('update:careers', savedData);

		if (savedData && savedData.career) {
			const newCareer = savedData.career;

			if (props.institution &&
				(newCareer.id_institution === props.institution.id ||
					newCareer.institution_id === props.institution.id)) {

				await nextTick();

				const careerInList = filteredCareers.value.find(c =>
					String(c.id) === String(newCareer.id)
				);

				if (careerInList) {
					form.value.id_career = String(newCareer.id);
					await nextTick();

					if (careerSelectRef.value) {
						careerSelectRef.value.value = String(newCareer.id);
						careerSelectRef.value.dispatchEvent(new Event('input'));
						careerSelectRef.value.dispatchEvent(new Event('change'));
					}

					form.value.id_specialty = "";
					await nextTick();
					return;
				}
			}
		}

		pendingCareerSelection.value = true;

		setTimeout(async () => {
			if (pendingCareerSelection.value && props.careers && props.careers.length > 0) {
				const latestCareer = [...props.careers]
					.sort((a, b) => b.id - a.id)
					.find(career =>
						(career.id_institution === props.institution?.id ||
							career.institution_id === props.institution?.id) &&
						String(career.id) !== String(form.value.id_career)
					);

				if (latestCareer) {
					form.value.id_career = String(latestCareer.id);

					await nextTick();
					if (careerSelectRef.value) {
						careerSelectRef.value.value = String(latestCareer.id);
					}

					form.value.id_specialty = "";
					pendingCareerSelection.value = false;
				} else {
					pendingCareerSelection.value = false;
				}
			}
		}, 1500);

	} catch (error) {
		closeCareerModal();
		pendingCareerSelection.value = false;
	}
};

const handleSavedSpecialty = async (savedData) => {
	try {
		isCreatingSpecialty.value = true;
		const currentCareerId = form.value.id_career;

		emit('update:specialties', savedData);
		closeSpecialtyModal();

		if (savedData && savedData.specialty) {
			const newSpecialty = savedData.specialty;

			if (currentCareerId &&
				(String(newSpecialty.id_career) === String(currentCareerId) ||
					String(newSpecialty.career_id) === String(currentCareerId))) {

				if (form.value.id_career !== currentCareerId) {
					form.value.id_career = currentCareerId;
				}

				form.value.id_specialty = String(newSpecialty.id);

				setTimeout(() => {
					isCreatingSpecialty.value = false;
				}, 300);
				return;
			}
		}

		if (form.value.id_career !== currentCareerId && currentCareerId) {
			form.value.id_career = currentCareerId;
		}

		pendingSpecialtySelection.value = true;

		setTimeout(async () => {
			if (pendingSpecialtySelection.value && props.specialties && props.specialties.length > 0 && currentCareerId) {
				const latestSpecialty = [...props.specialties]
					.sort((a, b) => b.id - a.id)
					.find(specialty =>
						String(specialty.id_career) === String(currentCareerId) ||
						String(specialty.career_id) === String(currentCareerId)
					);

				if (latestSpecialty) {
					form.value.id_specialty = String(latestSpecialty.id);
					pendingSpecialtySelection.value = false;
				} else {
					pendingSpecialtySelection.value = false;
				}
			}

			if (currentCareerId && form.value.id_career !== currentCareerId) {
				form.value.id_career = currentCareerId;
			}

			isCreatingSpecialty.value = false;
		}, 1500);

	} catch (error) {
		closeSpecialtyModal();
		pendingSpecialtySelection.value = false;
		isCreatingSpecialty.value = false;
	}
};

watch(() => props.careers, (newCareers, oldCareers) => {
	if (pendingCareerSelection.value && newCareers && newCareers.length > 0) {
		if (oldCareers) {
			const newCareer = newCareers.find(career =>
				!oldCareers.some(old => old.id === career.id) &&
				(career.id_institution === props.institution?.id ||
					career.institution_id === props.institution?.id)
			);

			if (newCareer) {
				form.value.id_career = String(newCareer.id);

				nextTick(() => {
					if (careerSelectRef.value) {
						careerSelectRef.value.value = String(newCareer.id);
					}
				});

				form.value.id_specialty = "";
				pendingCareerSelection.value = false;
			}
		}
	}
}, { deep: true });

watch(() => props.specialties, (newSpecialties, oldSpecialties) => {
	if (isCreatingSpecialty.value) {
		return;
	}

	if (pendingSpecialtySelection.value && newSpecialties && newSpecialties.length > 0 && form.value.id_career) {
		const newSpecialty = newSpecialties.find(specialty =>
			!oldSpecialties?.find(old => old.id === specialty.id) &&
			(String(specialty.id_career) === String(form.value.id_career) ||
				String(specialty.career_id) === String(form.value.id_career))
		);

		if (newSpecialty) {
			form.value.id_specialty = String(newSpecialty.id);
			pendingSpecialtySelection.value = false;
		}
	}
}, { deep: true });

const filteredCareers = computed(() => {
	if (!props.institution?.id) {
		return [];
	}

	const filtered = props.careers.filter(career => {
		return career.id_institution === props.institution.id ||
			career.institution_id === props.institution.id ||
			career.institution?.id === props.institution.id;
	});

	return filtered;
});

const filteredSpecialties = computed(() => {
	if (!form.value.id_career) {
		return [];
	}

	const selectedCareer = props.careers.find(c =>
		String(c.id) === String(form.value.id_career)
	);

	if (!selectedCareer) {
		return [];
	}

	const filtered = props.specialties.filter(specialty => {
		return String(specialty.id_career) === String(form.value.id_career) ||
			String(specialty.career_id) === String(form.value.id_career) ||
			String(specialty.career?.id) === String(form.value.id_career);
	});

	return filtered;
});

const studentCount = computed(() => students.value.length);
const canSubmit = computed(() => studentCount.value >= 1);

const validateForm = () => {
	errors.value = {};
	let valid = true;

	const requiredFields = ['control_number', 'name_student', 'lastname', 'gender', 'semester', 'id_career'];

	requiredFields.forEach(field => {
		if (!form.value[field]) {
			errors.value[field] = "Este campo es obligatorio";
			valid = false;
		}
	});

	if (form.value.semester) {
		const semesterNum = parseInt(form.value.semester);
		if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 12) {
			errors.value.semester = "El semestre debe ser un número entre 1 y 12";
			valid = false;
		}
	}

	return valid;
};

const validate = () => {
	const isValid = studentCount.value >= 1;
	emit('validate', isValid);
	return isValid;
};

const addStudent = () => {
	if (!validateForm()) {
		return;
	}

	const controlNumberExists = students.value.some(s =>
		s.student.control_number === form.value.control_number
	);

	if (controlNumberExists) {
		errors.value.control_number = "Este número de control ya ha sido registrado";
		return;
	}

	if (form.value.id_specialty === "null" || form.value.id_specialty === "") {
		form.value.id_specialty = null;
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
			id_specialty: form.value.id_specialty ? parseInt(form.value.id_specialty) : null,
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

const clearForm = () => {
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
};

watch(() => form.value.id_career, (newCareerId, oldCareerId) => {
	if (isCreatingSpecialty.value) {
		return;
	}

	if (newCareerId && oldCareerId && newCareerId !== oldCareerId) {
		if (form.value.id_specialty && form.value.id_specialty !== "null" && form.value.id_specialty !== "") {
			const currentSpecialty = props.specialties.find(s =>
				String(s.id) === String(form.value.id_specialty)
			);

			if (currentSpecialty &&
				String(currentSpecialty.id_career) !== String(newCareerId) &&
				String(currentSpecialty.career_id) !== String(newCareerId)) {
				form.value.id_specialty = "";
			}
		} else {
			form.value.id_specialty = "";
		}
	} else if (!newCareerId) {
		form.value.id_specialty = "";
	}
});

watch(() => props.institution, (newInstitution) => {
	if (newInstitution) {
		form.value.id_career = "";
		form.value.id_specialty = "";
	}
});

const initializeStudents = () => {
	if (props.modelValue?.dual_project_students && Array.isArray(props.modelValue.dual_project_students)) {
		students.value = props.modelValue.dual_project_students.map(s => ({
			...s,
			student: {
				...s.student,
				specialty:
					s.student.id_specialty === null
						? { id: null, name: 'Sin especialidad' }
						: s.student.specialty
			}
		}));
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
		<div class="bg-white p-6 rounded-lg shadow-md space-y-4">
			<h2 class="text-xl font-bold text-brand-900">Registro del Estudiante</h2>

			<div v-if="!institution" class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
				<p class="text-yellow-700">⚠️ Primero debe seleccionar una institución en el paso anterior</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
						No. Control o Matricula *
						<button
							v-tooltip="fieldHelpTexts.control_number"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
					</label>
					<input
						v-model="form.control_number"
						class="input"
						placeholder="Número de control"
						:class="{ 'border-red-500': errors.control_number }"
						:disabled="!institution" />
					<p v-if="errors.control_number" class="text-red-500 text-sm mt-1">{{ errors.control_number }}</p>
				</div>

				<div>
					<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
						Nombre *
						<button
							v-tooltip="fieldHelpTexts.name_student"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
					</label>
					<input
						v-model="form.name_student"
						class="input"
						placeholder="Nombre del estudiante"
						:class="{ 'border-red-500': errors.name_student }"
						:disabled="!institution" />
					<p v-if="errors.name_student" class="text-red-500 text-sm mt-1">{{ errors.name_student }}</p>
				</div>

				<div>
					<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
						Apellidos *
						<button
							v-tooltip="fieldHelpTexts.lastname"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
					</label>
					<input
						v-model="form.lastname"
						class="input"
						placeholder="Apellidos del estudiante"
						:class="{ 'border-red-500': errors.lastname }"
						:disabled="!institution" />
					<p v-if="errors.lastname" class="text-red-500 text-sm mt-1">{{ errors.lastname }}</p>
				</div>

				<div>
					<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
						Periodo académico *
						<button
							v-tooltip="fieldHelpTexts.semester"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
					</label>
					<input
						v-model="form.semester"
						type="number"
						min="1"
						max="12"
						class="input"
						placeholder="Periodo académico (1-12)"
						:class="{ 'border-red-500': errors.semester }"
						:disabled="!institution" />
					<p v-if="errors.semester" class="text-red-500 text-sm mt-1">{{ errors.semester }}</p>
				</div>

				<div>
					<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
						Carrera *
						<button
							v-tooltip="fieldHelpTexts.id_career"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
					</label>
					<div class="flex gap-2">
						<select
							ref="careerSelectRef"
							v-model="form.id_career"
							class="input flex-1"
							:class="{ 'border-red-500': errors.id_career }"
							:disabled="!institution || filteredCareers.length === 0">
							<option value="">Selecciona carrera</option>
							<option
								v-for="c in filteredCareers"
								:key="c.id"
								:value="String(c.id)">
								{{ c.name }}
							</option>
						</select>
						<btn-create
							:table="'Carrera'"
							class="flex-shrink-0"
							tooltip="Crear nueva carrera"
							:disabled="!institution"
							@open="({ mode, pk, table }) => openCareerModal(mode, pk, table)" />
					</div>
					<p v-if="errors.id_career" class="text-red-500 text-sm mt-1">{{ errors.id_career }}</p>
					<p v-if="institution && filteredCareers.length === 0" class="text-yellow-600 text-sm mt-1">
						No hay carreras disponibles para esta institución
					</p>
				</div>

				<div>
					<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
						Especialidad
						<button
							v-tooltip="fieldHelpTexts.id_specialty"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
					</label>
					<div class="flex gap-2">
						<select
							v-model="form.id_specialty"
							class="input flex-1"
							:class="{ 'border-red-500': errors.id_specialty }"
							:disabled="!institution || !form.id_career">
							<option value="">Selecciona especialidad</option>
							<option value="null">Sin especialidad</option>
							<option
								v-for="s in filteredSpecialties"
								:key="s.id"
								:value="String(s.id)">
								{{ s.name }}
							</option>
						</select>
						<btn-create
							:table="'Especialidad'"
							class="flex-shrink-0"
							tooltip="Crear nueva especialidad"
							:disabled="!institution || !form.id_career"
							@open="({ mode, pk, table }) => {
								specialtyModalData.careerId = form.id_career;
								openSpecialtyModal(mode, pk, table);
							}" />
					</div>
					<p v-if="errors.id_specialty" class="text-red-500 text-sm mt-1">{{ errors.id_specialty }}</p>

					<p v-if="form.id_career && filteredSpecialties.length === 0" class="text-[#800020]  text-sm mt-1">
						Esta carrera no tiene especialidades registradas. Puedes seleccionar "Sin especialidad" o crear una nueva.
					</p>
				</div>

				<div class="md:col-span-2">
					<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
						Género *
						<button
							v-tooltip="fieldHelpTexts.gender"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
					</label>
					<div class="flex gap-6">
						<label class="flex items-center">
							<input
								v-model="form.gender"
								type="radio"
								value="Masculino"
								class="mr-2"
								:disabled="!institution" /> Masculino
						</label>
						<label class="flex items-center">
							<input
								v-model="form.gender"
								type="radio"
								value="Femenino"
								class="mr-2"
								:disabled="!institution" /> Femenino
						</label>
						<label class="flex items-center">
							<input
								v-model="form.gender"
								type="radio"
								value="Otro"
								class="mr-2"
								:disabled="!institution" /> Otro
						</label>
					</div>
					<p v-if="errors.gender" class="text-red-500 text-sm mt-1">{{ errors.gender }}</p>
				</div>
			</div>

			<div class="flex justify-between items-center mt-6">
				<div class="flex gap-3">
					<button
						class="px-4 py-2 bg-brand-800 text-white rounded-lg hover:bg-brand-900 transition disabled:bg-gray-400"
						:disabled="!institution"
						@click="addStudent">
						Agregar estudiante
					</button>
					<button
						class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
						:disabled="!institution"
						@click="clearForm">
						Limpiar formulario
					</button>
				</div>

				<span class="text-sm text-gray-600 font-medium">
					{{ studentCount }} estudiante(s) registrado(s)
				</span>
			</div>
		</div>

		<div v-if="students.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
			<div class="overflow-x-auto">
				<table class="min-w-full">
					<thead>
						<tr class="bg-brand-800 text-white">
							<th class="px-4 py-2 text-left">No. Control o Matricula</th>
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
							<td class="px-4 py-2 font-mono">{{ s.student.control_number }}</td>
							<td class="px-4 py-2">{{ s.student.name }}</td>
							<td class="px-4 py-2">{{ s.student.lastname }}</td>
							<td class="px-4 py-2 text-center">{{ s.student.semester }}</td>
							<td class="px-4 py-2">{{ s.student.career?.name || 'N/A' }}</td>
							<td class="px-4 py-2">{{ s.student.specialty?.name || 'Sin especialidad' }}</td>
							<td class="px-4 py-2">{{ s.student.gender }}</td>
							<td class="px-4 py-2">
								<button
									class="text-red-500 hover:text-red-700 px-2 py-1 rounded transition"
									title="Eliminar estudiante"
									@click="removeStudent(i)">
									Eliminar
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div v-else class="bg-yellow-50 p-6 rounded-lg shadow-md text-center">
			<div class="flex items-center justify-center mb-3">
				<svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-yellow-800 mb-2">No hay estudiantes registrados</h3>
			<p class="text-yellow-600">Utilice el formulario superior para agregar al menos 1 estudiante.</p>
		</div>

		<div class="bg-gray-50 p-4 rounded-lg">
			<p class="text-sm text-gray-600 text-center">
				💡 <strong>Consejo:</strong> Puedes agregar tantos estudiantes como necesites.
				El sistema calculará automáticamente el total de participantes.
			</p>
		</div>

		<mdl-careers
			:show="showCareerModal"
			:data="careerModalData"
			@close="closeCareerModal"
			@saved="handleSavedCareer" />

		<mdl-specialties
			:show="showSpecialtyModal"
			:data="specialtyModalData"
			@close="closeSpecialtyModal"
			@saved="handleSavedSpecialty" />
	</div>
</template>

<style scoped>
.input {
	@apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors;
}

.help-icon {
	@apply w-4 h-4 flex items-center justify-center rounded-full border border-current text-xs font-bold;
}
</style>