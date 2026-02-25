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
	institution: Object,
	academicPeriods: Array
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
	id_academic_period: "",
});

const errors = ref({});
const pendingCareerSelection = ref(false);
const pendingSpecialtySelection = ref(false);
const isCreatingSpecialty = ref(false);
const debugInfo = ref({
	lastCreatedCareerId: null,
	selectionAttempts: 0,
	careerListUpdated: false
});

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

const verifyCareerSelection = (careerId) => {
	const careerIdStr = String(careerId);
	const selectedValue = form.value.id_career;
	const careerExists = filteredCareers.value.some(c => String(c.id) === careerIdStr);
	
	return {
		selected: selectedValue === careerIdStr,
		existsInList: careerExists,
		selectedValue,
		careerId: careerIdStr
	};
};

const forceSelectCareer = async (careerId) => {
	const careerIdStr = String(careerId);
	
	form.value.id_career = careerIdStr;
	
	await nextTick();
	
	if (careerSelectRef.value) {
		careerSelectRef.value.value = careerIdStr;
		
		const inputEvent = new Event('input', { bubbles: true });
		const changeEvent = new Event('change', { bubbles: true });
		careerSelectRef.value.dispatchEvent(inputEvent);
		careerSelectRef.value.dispatchEvent(changeEvent);
	}

	form.value.id_specialty = "";
	
	return verifyCareerSelection(careerId);
};

const handleSavedCareer = async (savedData) => {
	try {
		closeCareerModal();
		emit('update:careers', savedData);

		if (savedData && savedData.career) {
			const newCareer = savedData.career;
			debugInfo.value.lastCreatedCareerId = newCareer.id;
			debugInfo.value.selectionAttempts = 0;

			const belongsToInstitution = props.institution &&
				(String(newCareer.id_institution) === String(props.institution.id) ||
				 String(newCareer.institution_id) === String(props.institution.id));

			if (belongsToInstitution) {
				await new Promise(resolve => setTimeout(resolve, 100));
				
				const verification = await forceSelectCareer(newCareer.id);
				
				if (verification.selected && verification.existsInList) {
					pendingCareerSelection.value = false;
					return;
				}
			}
		}

		pendingCareerSelection.value = true;
		debugInfo.value.careerListUpdated = false;

		const timeoutId = setTimeout(() => {
			if (pendingCareerSelection.value) {
				pendingCareerSelection.value = false;
			}
		}, 5000);

		const intervalId = setInterval(async () => {
			if (!pendingCareerSelection.value) {
				clearInterval(intervalId);
				return;
			}
			
			debugInfo.value.selectionAttempts++;
			
			if (props.careers && props.careers.length > 0) {
				const latestCareer = [...props.careers]
					.sort((a, b) => String(b.id).localeCompare(String(a.id)))
					.find(career => {
						const matchesInstitution = 
							String(career.id_institution) === String(props.institution?.id) ||
							String(career.institution_id) === String(props.institution?.id);
						
						const isNewCareer = debugInfo.value.lastCreatedCareerId && 
							String(career.id) === String(debugInfo.value.lastCreatedCareerId);
						
						return matchesInstitution && isNewCareer;
					});

				if (latestCareer) {
					const verification = await forceSelectCareer(latestCareer.id);
					
					if (verification.selected && verification.existsInList) {
						pendingCareerSelection.value = false;
						clearInterval(intervalId);
						clearTimeout(timeoutId);
					}
				}
			}
			if (debugInfo.value.selectionAttempts >= 10) {
				pendingCareerSelection.value = false;
				clearInterval(intervalId);
				clearTimeout(timeoutId);
			}
		}, 500);

	} catch (error) {
		console.error('Error en handleSavedCareer:', error);
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
					.sort((a, b) => String(b.id).localeCompare(String(a.id)))
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
	// Actualizar estudiantes cuando cambian las carreras
	if (newCareers?.length && students.value.length > 0) {
		students.value = students.value.map(s => {
			const careerId = s.student?.id_career;
			if (careerId) {
				const career = newCareers.find(c => String(c.id) === String(careerId));
				if (career) {
					s.student.career = career;
				}
			}
			return s;
		});
	}

	if (pendingCareerSelection.value && newCareers && newCareers.length > 0) {
		const newCareerForInstitution = newCareers.find(career => {
			const isNew = !oldCareers?.some(old => String(old.id) === String(career.id));
			const matchesInstitution = 
				String(career.id_institution) === String(props.institution?.id) ||
				String(career.institution_id) === String(props.institution?.id);
			
			return isNew && matchesInstitution;
		});

		if (newCareerForInstitution) {
			forceSelectCareer(newCareerForInstitution.id).then(verification => {
				if (verification.selected && verification.existsInList) {
					pendingCareerSelection.value = false;
					debugInfo.value.careerListUpdated = true;
				}
			});
		}
	}
}, { deep: true });

watch(() => props.specialties, (newSpecialties, oldSpecialties) => {
	// Actualizar estudiantes cuando cambian las especialidades
	if (newSpecialties?.length && students.value.length > 0) {
		students.value = students.value.map(s => {
			const specialtyId = s.student?.id_specialty;
			if (specialtyId) {
				const specialty = newSpecialties.find(sp => String(sp.id) === String(specialtyId));
				if (specialty) {
					s.student.specialty = specialty;
				}
			}
			return s;
		});
	}

	if (isCreatingSpecialty.value) {
		return;
	}

	if (pendingSpecialtySelection.value && newSpecialties && newSpecialties.length > 0 && form.value.id_career) {
		const newSpecialty = newSpecialties.find(specialty =>
			!oldSpecialties?.find(old => String(old.id) === String(specialty.id)) &&
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

	const institutionId = String(props.institution.id);
	
	const filtered = props.careers?.filter(career => {
		return String(career.id_institution) === institutionId ||
			String(career.institution_id) === institutionId ||
			String(career.institution?.id) === institutionId;
	}) || [];

	return filtered;
});

const filteredSpecialties = computed(() => {
	if (!form.value.id_career) {
		return [];
	}

	const selectedCareer = props.careers?.find(c =>
		String(c.id) === String(form.value.id_career)
	);

	if (!selectedCareer) {
		return [];
	}

	const filtered = props.specialties?.filter(specialty => {
		return String(specialty.id_career) === String(form.value.id_career) ||
			String(specialty.career_id) === String(form.value.id_career) ||
			String(specialty.career?.id) === String(form.value.id_career);
	}) || [];

	return filtered;
});

const institutionAcademicPeriod = computed(() => {

	if (!props.institution?.id_academic_period) {
		return null;
	}

	if (props.academicPeriods && props.academicPeriods.length > 0) {
		const found = props.academicPeriods.find(
			period => period.id === props.institution.id_academic_period
		);
		return found;
	}

	return null;
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

	// Verificar que la carrera seleccionada existe
	if (form.value.id_career) {
		const careerExists = filteredCareers.value.some(c => 
			String(c.id) === String(form.value.id_career)
		);
		
		if (!careerExists) {
			errors.value.id_career = "La carrera seleccionada no es válida";
			return;
		}
	}

	if (form.value.id_specialty === "null" || form.value.id_specialty === "") {
		form.value.id_specialty = null;
	}

	// Buscar la carrera seleccionada usando string comparison
	const selectedCareer = filteredCareers.value.find(c => 
		String(c.id) === String(form.value.id_career)
	);

	// Buscar la especialidad seleccionada (si existe)
	const selectedSpecialty = form.value.id_specialty ? 
		props.specialties?.find(s => String(s.id) === String(form.value.id_specialty)) : null;

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
				id_career: form.value.id_career ? String(form.value.id_career) : '',
			id_specialty: form.value.id_specialty ? String(form.value.id_specialty) : null,
			institution: props.institution || {},
			career: selectedCareer || { name: 'N/A', id: form.value.id_career },
			specialty: selectedSpecialty || { name: 'Sin especialidad', id: form.value.id_specialty },
			academic_period: institutionAcademicPeriod.value || {}
		}
	};

	students.value.push(newStudent);

	const updatedValue = {
		...localModel.value,
		dual_project_students: [...students.value]
	};

	localModel.value = updatedValue;
	emit('update:modelValue', updatedValue);

	// Limpiar formulario
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
			const currentSpecialty = props.specialties?.find(s =>
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
		pendingCareerSelection.value = false;
	}
});

// CORREGIDO: Función initializeStudents mejorada
const initializeStudents = () => {
	if (props.modelValue?.dual_project_students && Array.isArray(props.modelValue.dual_project_students)) {
		students.value = props.modelValue.dual_project_students.map(s => {
			// Obtener los IDs
			const careerId = s.student?.id_career;
			const specialtyId = s.student?.id_specialty;
			
			// Buscar la carrera en la lista completa de carreras
			const career = careerId ? props.careers?.find(c => String(c.id) === String(careerId)) : null;
			
			// Buscar la especialidad en la lista completa de especialidades
			const specialty = specialtyId ? props.specialties?.find(sp => String(sp.id) === String(specialtyId)) : null;
			
			// Log para depuración (opcional)
			console.log('Inicializando estudiante:', {
				careerId,
				careerFound: career?.name || 'NO ENCONTRADA',
				specialtyId,
				specialtyFound: specialty?.name || 'Sin especialidad'
			});
			
			return {
				...s,
				student: {
					...s.student,
					id_career: careerId ? String(careerId) : '',
					id_specialty: specialtyId ? String(specialtyId) : null,
					career: career || { name: 'N/A', id: careerId || 'no-id' },
					specialty: specialty || { name: 'Sin especialidad', id: specialtyId || null }
				}
			};
		});
	} else {
		students.value = [];
	}
};

// CORREGIDO: Watch para cuando cambian las carreras - actualizar la tabla
watch(() => props.careers, (newCareers) => {
	if (newCareers?.length && students.value.length > 0) {
		// Actualizar la información de carrera de cada estudiante
		students.value = students.value.map(s => {
			const careerId = s.student?.id_career;
			if (careerId) {
				const career = newCareers.find(c => String(c.id) === String(careerId));
				if (career) {
					s.student.career = career;
				}
			}
			return s;
		});
	}
}, { deep: true });

// CORREGIDO: Watch para cuando cambian las especialidades
watch(() => props.specialties, (newSpecialties) => {
	if (newSpecialties?.length && students.value.length > 0) {
		// Actualizar la información de especialidad de cada estudiante
		students.value = students.value.map(s => {
			const specialtyId = s.student?.id_specialty;
			if (specialtyId) {
				const specialty = newSpecialties.find(sp => String(sp.id) === String(specialtyId));
				if (specialty) {
					s.student.specialty = specialty;
				}
			}
			return s;
		});
	}
}, { deep: true });

onMounted(() => {
	console.log('=== DualStepPersonal montado ===');
	console.log('modelValue:', props.modelValue);
	console.log('careers recibidas:', props.careers?.length);
	console.log('specialties recibidas:', props.specialties?.length);
	console.log('institution:', props.institution);
	
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
		<div v-if="false" class="bg-gray-100 p-4 rounded-lg border border-gray-300 text-xs">
			<h4 class="font-bold mb-2">🔍 Depuración de Carreras:</h4>
			<p><strong>ID Carrera seleccionada:</strong> {{ form.id_career || 'Ninguna' }}</p>
			<p><strong>Carreras totales:</strong> {{ careers?.length || 0 }}</p>
			<p><strong>Carreras filtradas:</strong> {{ filteredCareers.length }}</p>
			<p><strong>Selección pendiente:</strong> {{ pendingCareerSelection ? 'Sí' : 'No' }}</p>
			<p><strong>ID Institución:</strong> {{ institution?.id || 'Ninguna' }}</p>
			<p v-if="form.id_career">
				<strong>Carrera encontrada:</strong> {{ 
					filteredCareers.find(c => String(c.id) === String(form.id_career))?.name || 'No encontrada en lista filtrada'
				}}
			</p>
		</div>

		<div class="bg-white p-6 rounded-lg shadow-md space-y-4">
			<h2 class="text-xl font-bold text-brand-900">Registro del Estudiante</h2>

			<div v-if="!institution" class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
				<p class="text-yellow-700">⚠️ Primero debe seleccionar una institución en el paso anterior</p>
			</div>

			<div v-if="pendingCareerSelection" class="bg-brand-100 p-3 rounded-lg border border-blue-200">
				<div class="flex items-center gap-2 ">
					<svg class="w-5 h-5 text-brand-500 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
					<p class="text-brand-700">⏳ Procesando nueva carrera. Se seleccionará automáticamente cuando esté disponible...</p>
				</div>
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
				<div v-if="institution" class="md:col-span-2 bg-brand-50 p-4 rounded-lg border border-brand-200">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg class="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span class="text-sm font-medium text-brand-800">Período Académico de la Institución:</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="px-3 py-1 bg-white rounded-full text-sm font-semibold text-brand-800 border border-brand-300">
								{{ institutionAcademicPeriod?.name || 'No definido' }}
							</span>
						</div>
					</div>
					<p class="text-xs text-gray-600 mt-2">
						Este es el período académico configurado para la institución seleccionada.
						Los estudiantes registrados heredarán este período automáticamente.
					</p>
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
							:class="{ 
								'border-red-500': errors.id_career,
								'border-green-500': form.id_career && filteredCareers.some(c => String(c.id) === String(form.id_career))
							}"
							:disabled="!institution || filteredCareers.length === 0">
							<option value="">Selecciona carrera</option>
							<option
								v-for="c in filteredCareers"
								:key="c.id"
								:value="String(c.id)"
								:selected="String(c.id) === String(form.id_career)">
								{{ c.name }}
							</option>
						</select>
						<btn-create
							:table="'Carrera'"
							class="flex-shrink-0"
							tooltip="Crear nueva carrera"
							:disabled="!institution"
							@open="() => {
								openCareerModal('create', null, 'Carrera', {
									institutionId: institution?.id
								});
							}" />
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
					<div>
						<select
							v-model="form.id_specialty"
							:disabled="!form.id_career"
							class="input w-full">
							<option value="">Selecciona una especialidad</option>
							<option value="null">Sin especialidad</option>
							<option
								v-for="s in filteredSpecialties"
								:key="s.id"
								:value="String(s.id)">
								{{ s.name }}
							</option>
						</select>

						<p v-if="!form.id_career" class="text-yellow-600 text-sm mt-1">
							⚠️ Primero selecciona una carrera
						</p>
						<p v-if="errors.id_specialty" class="text-red-500 text-sm mt-1">{{ errors.id_specialty }}</p>

						<p v-if="form.id_career && filteredSpecialties.length === 0" class="text-[#800020] text-sm mt-1">
							Esta carrera no tiene especialidades registradas. Puedes seleccionar "Sin especialidad" o crear una nueva.
						</p>
						<btn-create
							:table="'Especialidad'"
							class="flex-shrink-0 mt-2"
							tooltip="Crear nueva especialidad"
							:disabled="!institution || !form.id_career"
							@open="() => {
								openSpecialtyModal('create', null, 'Especialidad', {
									careerId: form.id_career,
									institutionId: institution?.id
								});
							}" />
					</div>
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
							<th class="px-4 py-2 text-left">Período Académico</th>
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
							<td class="px-4 py-2">
								<span class="px-2 py-1 bg-brand-100 text-brand-800 rounded-full text-xs">
									{{ s.student.academic_period?.name || 'No definido' }}
								</span>
							</td>
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