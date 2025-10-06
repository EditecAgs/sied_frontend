<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, ref, onMounted, computed, nextTick } from 'vue';
import axios from 'axios';
import DualStepPersonal from '../../forms/DualStepPersonal.vue';
import DualStepAcademico from '../../forms/DualStepAcademico.vue';
import DualStepUnidad from '../../forms/DualStepUnidad.vue';
import mdlInstitution from './mdlInstitution.vue';
import { useModal } from '../../../composables/UseModal';
import { createDualProject, updateDualProject, showDualProject } from '../../../services/dual_projects/dual_projects';
import { getInstitutions } from '../../../services/institutions/institutions.js';
import { getCareers } from '../../../services/institutions/careers.js';
import { getSpecialties } from '../../../services/institutions/specialties.js';
import { getClusters } from '../../../services/organizations/clusters.js';
import { getDualAreas } from '../../../services/dual_projects/dual-areas.js';
import { getOrganizations } from '../../../services/organizations/organizations.js';
import { getDocumentStatuses } from '../../../services/dual_projects/documents-statuses.js';
import { getEconomicSupports } from '../../../services/dual_projects/economic-supports.js';
import { getDualTypes } from '../../../services/dual_projects/dual-types';
import { getMicroCredentials } from '../../../services/dual_projects/micro-credentials';

const emit = defineEmits(['close', 'saved']);
// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean;
	data: {
		mode: 'create' | 'edit' | 'complete';
		pk: number | null;
		table: string;
	};
}>();

const { showModal, modalData, openModal, closeModal } = useModal();
const isLoading = ref(false);
const currentStep = ref(0);
const reportaModeloDual = ref<boolean>(false);

const stepAcademicoRef = ref();
const stepPersonalRef = ref();
const stepUnidadDualRef = ref(null);

const institutions = ref([]);
const careers = ref([]);
const specialties = ref([]);
const clusters = ref([]);
const areas = ref([]);
const agreementStatuses = ref([]);
const supportTypes = ref([]);
const organizations = ref([]);
const dualTypes = ref([]);
const noChangesDetected = ref(false);
const originalFormData = ref<any>(null);
const microCredentials = ref([]);

const personalStepKey = ref(0);

const LoadDependence = async () => {
	const [
		institutionsRes,
		careersRes,
		specialtiesRes,
		clustersRes,
		statusesRes,
		areasRes,
		supportsRes,
		orgsRes,
		typesRes,
		microRes
	] = await Promise.all([
		getInstitutions(),
		getCareers(),
		getSpecialties(),
		getClusters(),
		getDocumentStatuses(),
		getDualAreas(),
		getEconomicSupports(),
		getOrganizations(),
		getDualTypes(),
		getMicroCredentials()
	]);

	institutions.value = institutionsRes.data;
	careers.value = careersRes.data;
	specialties.value = specialtiesRes.data;
	clusters.value = clustersRes.data;
	agreementStatuses.value = statusesRes.data;
	areas.value = areasRes.data;
	supportTypes.value = supportsRes.data;
	organizations.value = orgsRes.data;
	dualTypes.value = typesRes.data;
	microCredentials.value = microRes.data;
};


onMounted(() => {
	LoadDependence();
});

const steps = [
	{ title: 'Información de Institución' },
	{ title: 'Unidad Dual' },
	{ title: 'Datos Personales' }
];

const formData = reactive({
	personal: {
		id_student: '',
		control_number: '',
		name_student: '',
		lastname: '',
		gender: '',
		semester: '',
		id_career: '',
		id_specialty: '',
		dual_project_students: []
	},
	academico: {
		id_institution: '',
	},
	unidadDual: {
		name_report: '',
		id_organization: '',
		id_dual_area: '',
		period_start: '',
		period_end: '',
		status_document: '',
		economic_support: '',
		amount: '',
		qualification: '',
		max_qualification: '',
		advisor: '',
		is_concluded: 0,
		is_hired: 0,
		dual_type_id: '',
		micro_credentials: []
	}
});


const canSubmit = computed(() => {
	if (currentStep.value === 2) {
		const studentCount = formData.personal.dual_project_students?.length || 0;
		return studentCount >= 1;
	}
	return true;
});

const formatDate = (date: string | Date): string => {
	if (!date) return '';
	const d = new Date(date);
	return d.toISOString().slice(0, 10);
};

const resetForm = () => {
	formData.personal = {
		id_student: '',
		control_number: '',
		name_student: '',
		lastname: '',
		gender: '',
		semester: '',
		id_career: '',
		id_specialty: '',
		dual_project_students: []
	};
	formData.academico = {
		id_institution: '',
	};
	formData.unidadDual = {
		name_report: '',
		id_organization: '',
		id_dual_area: '',
		period_start: '',
		period_end: '',
		status_document: '',
		economic_support: '',
		amount: '',
		qualification: '',
		max_qualification: '',
		advisor: '',
		is_concluded: 0,
		is_hired: 0,
		dual_type_id: '',
		micro_credentials: []
	};
	reportaModeloDual.value = null;
	currentStep.value = 0;
};

watch(
	() => props.data,
	async (newData) => {
		currentStep.value = 0;
		personalStepKey.value = 0;

		if ((newData.mode === 'edit' || newData.mode === 'complete') && newData.pk !== null) {
			isLoading.value = true;
			try {
				const res = await showDualProject(newData.pk);
				const project = res.data;

				formData.personal = {
					id_student: '',
					control_number: '',
					name_student: '',
					lastname: '',
					gender: '',
					semester: '',
					id_career: '',
					id_specialty: '',
					dual_project_students: project.dual_project_students || []
				};

				if (project.dual_project_students && project.dual_project_students.length > 0) {
					const firstStudent = project.dual_project_students[0].student;
					formData.personal.control_number = firstStudent.control_number || '';
					formData.personal.name_student = firstStudent.name || '';
					formData.personal.lastname = firstStudent.lastname || '';
					formData.personal.gender = firstStudent.gender || '';
					formData.personal.semester = firstStudent.semester || '';
					formData.personal.id_career = firstStudent.id_career || '';
					formData.personal.id_specialty = firstStudent.id_specialty || '';
				}

				formData.academico = {
					id_institution: project.id_institution ?? '',
				};

				formData.unidadDual = {
					name_report: project.dual_project_reports?.name ?? '',
					id_organization: project.organization_dual_projects?.organization?.id ?? '',
					id_dual_area: project.dual_project_reports?.dual_area?.id ?? '',
					period_start: project.dual_project_reports?.period_start ?? '',
					period_end: project.dual_project_reports?.period_end ?? '',
					status_document: project.dual_project_reports?.status_document?.id ?? '',
					economic_support: project.dual_project_reports?.economic_support?.id ?? '',
					amount: String(project.dual_project_reports?.amount ?? ''),
					qualification: project.dual_project_reports?.qualification ?? '',
					advisor: project.dual_project_reports?.advisor ?? '',
					is_concluded: project.dual_project_reports?.is_concluded ?? 0,
					is_hired: project.dual_project_reports?.is_hired ?? 0,
					dual_type_id: project.dual_project_reports?.dual_type?.id ?? '',
					max_qualification: project.dual_project_reports?.max_qualification ?? '',
					micro_credentials: project.dual_project_reports?.micro_credentials?.map(m => m.id) || []
				};

				reportaModeloDual.value = newData.mode === 'complete' ? true : !!project.dual_project_reports;

				originalFormData.value = JSON.stringify(formData);
			} catch (error) {
				console.error('Error al cargar el proyecto dual:', error);
			} finally {
				isLoading.value = false;
			}
		} else if (newData.mode === 'create') {
			resetForm();
		}
	},
	{ immediate: true }
);

const handleNextOrSubmit = async () => {
	if (currentStep.value === 0) {
		if (reportaModeloDual.value === null) {
			alert('Debes seleccionar si este seguimiento incluye información del Modelo Dual');
			return;
		}

		const isValid = await stepAcademicoRef.value?.validate?.();
		if (!isValid) {
			await nextTick();
			return;
		}

		if (reportaModeloDual.value === false) {
			await imprimirYGuardar();
			return;
		}
		nextStep();
	}  else if (currentStep.value === 1) {
		const isValid = await stepUnidadDualRef.value?.validate?.();
		if (!isValid) return;
		nextStep();
	} else if (currentStep.value === 2) {

		const studentCount = formData.personal.dual_project_students?.length || 0;

		if (studentCount < 1) {
			alert('Debes agregar al menos 1 estudiante.');
			return;
		}

		const isValid = stepPersonalRef.value?.validate ? stepPersonalRef.value.validate() : false;

		if (!isValid) {
			return;
		}

		imprimirYGuardar();
	}
};

const nextStep = async () => {
	if (currentStep.value < steps.length - 1) {
		currentStep.value++;
		if (currentStep.value === 2) {
			await nextTick();
			personalStepKey.value++;
		}
	}
};

const prevStep = async () => {
	if (currentStep.value > 0) {
		currentStep.value--;
		if (currentStep.value === 2) {
			await nextTick();
			personalStepKey.value++;
		}
	}
};

const imprimirYGuardar = async () => {
	try {
		let payload: Record<string, any>;

		if (reportaModeloDual.value === false) {
			if (!formData.academico.id_institution) {
				alert('Debes seleccionar una institución');
				return;
			}
			payload = {
				has_report: 0,
				id_institution: Number(formData.academico.id_institution)
			};
		} else {
			if (!formData.unidadDual.name_report || !formData.unidadDual.id_organization || !formData.unidadDual.id_dual_area) {
				alert('Debes llenar todos los campos de la Unidad Dual');
				return;
			}

			const studentCount = formData.personal.dual_project_students?.length || 0;

			if (studentCount < 1) {
				alert('Debes agregar al menos 1 estudiante.');
				return;
			}

			const studentsPayload = formData.personal.dual_project_students.map(student => ({
				control_number: student.student?.control_number || student.control_number,
				name_student: student.student?.name || student.name_student,
				lastname: student.student?.lastname || student.lastname,
				gender: student.student?.gender || student.gender,
				semester: student.student?.semester || student.semester,
				id_career: student.student?.id_career || student.id_career,
				id_specialty: student.student?.id_specialty || student.id_specialty,
				id_institution: Number(formData.academico.id_institution)
			}));

			payload = {
				has_report: 1,
				id_institution: Number(formData.academico.id_institution),
				number_student: studentCount,
				students: studentsPayload,
				name_report: formData.unidadDual.name_report,
				id_organization: Number(formData.unidadDual.id_organization),
				id_dual_area: Number(formData.unidadDual.id_dual_area),
				period_start: formatDate(formData.unidadDual.period_start),
				period_end: formatDate(formData.unidadDual.period_end),
				status_document: Number(formData.unidadDual.status_document),
				economic_support: Number(formData.unidadDual.economic_support),
				amount: Number(formData.unidadDual.amount),
				qualification: formData.unidadDual.qualification,
				max_qualification: String(formData.unidadDual.max_qualification) || 10,
				advisor: formData.unidadDual.advisor,
				is_concluded: formData.unidadDual.is_concluded,
				is_hired: formData.unidadDual.is_hired,
				dual_type_id: Number(formData.unidadDual.dual_type_id),
				micro_credentials: formData.unidadDual.micro_credentials
			};
		}

		const currentData = JSON.stringify(formData);
		if (props.data.mode === 'create') {
			await createDualProject(payload);
		} else {
			if (currentData === originalFormData.value) {
				noChangesDetected.value = true;
				return;
			}
			noChangesDetected.value = false;
			await updateDualProject(props.data.pk, payload);
		}
		emit('saved');
		emit('close');
	} catch (err: any) {
		if (axios.isAxiosError(err) && err.response) {
			console.error('422 Response data:', err.response.data);
		} else {
			console.error('Error al enviar el formulario:', err);
		}
	}
};

const handleInstitutionSaved = () => {
	closeModal();
};
const handleInstitutionsUpdate = (newInstitutions: any[]) => {
	console.log('Instituciones actualizadas desde el hijo:', newInstitutions.length);
	institutions.value = newInstitutions;
};
const handleOrganizationsUpdate = (newOrganizations: any[]) => {
	console.log('Organizaciones actualizadas desde el hijo:', newOrganizations.length);
	organizations.value = newOrganizations;
};

const handleMicroCredentialsUpdate = (newMicroCredentials: any[]) => {
	console.log('Microcredenciales actualizadas desde el hijo:', newMicroCredentials.length);
	microCredentials.value = newMicroCredentials;
};

const closeModalAndReset = () => {
	noChangesDetected.value = false;
	emit('close');
};
</script>

<template>
	<transition name="fade-scale">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			style="margin-top: 0"
			@click.self="emit('close')">
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] flex flex-col overflow-hidden"
				style="background-image: url('/images/background/bg-white-flores.png');">
				<div
					class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{
							props.data.mode === 'create'
								? 'Crear Proyecto Dual'
								: props.data.mode === 'complete'
									? 'Completar Proyecto Dual'
									: 'Editar Proyecto Dual'
						}}
					</h4>
					<button
						class="text-white/80 hover:text-white text-2xl font-bold"
						@click="closeModalAndReset">
						&times;
					</button>
				</div>

				<div class="flex justify-between mb-6 mt-5">
					<div
						v-for="(step, index) in steps"
						:key="index"
						class="flex-1 flex flex-col items-center">
						<div
							:class="[
								'w-8 h-8 flex items-center justify-center rounded-full mb-1 text-sm font-semibold',
								currentStep === index
									? 'bg-brand-800 text-white'
									: currentStep > index
										? 'bg-brand-600 text-white'
										: 'bg-gray-200 text-gray-600'
							]">
							{{ currentStep > index ? '✓' : index + 1 }}
						</div>
						<span
							:class="
								currentStep === index
									? 'text-brand-800 font-bold text-xs'
									: 'text-gray-500 text-xs'
							">
							{{ step.title }}
						</span>
					</div>
				</div>

				<div class="flex-grow overflow-y-auto pr-2 mb-4">
					<template v-if="!isLoading">
						<DualStepAcademico
							v-if="currentStep === 0"
							ref="stepAcademicoRef"
							v-model="formData.academico"
							v-model:reportaModeloDual="reportaModeloDual"
							:institutions="institutions"
							:mode="props.data.mode"
							@submitSinUnidadDual="imprimirYGuardar"
							@update:institutions="handleInstitutionsUpdate" />
						<DualStepUnidad
							v-else-if="currentStep === 1 && reportaModeloDual"
							ref="stepUnidadDualRef"
							:key="'unidad-step-' + currentStep"
							v-model="formData.unidadDual"
							:areas="areas"
							:clusters="clusters"
							:agreementStatuses="agreementStatuses"
							:supportTypes="supportTypes"
							:organizations="organizations"
							:dualTypes="dualTypes"
							:microCredentials="microCredentials"
							@update:organizations="handleOrganizationsUpdate"
							@update:microCredentials="handleMicroCredentialsUpdate" />

						<DualStepPersonal
							v-else-if="currentStep === 2"
							:key="'personal-step-' + personalStepKey"
							ref="stepPersonalRef"
							v-model="formData.personal"
							:careers="careers"
							:specialties="specialties"
							:institution="{
								id: formData.academico.id_institution,
								name: institutions.find(i => i.id === formData.academico.id_institution)?.name || ''
							}" />
					</template>
					<template v-else>
						<div class="flex justify-center items-center h-full">
							<div
								class="w-10 h-10 border-4 border-gray-300 border-t-brand-800 rounded-full animate-spin" />
							<span class="ml-4 text-gray-500 font-medium">Cargando información...</span>
						</div>
					</template>
				</div>

				<p v-if="noChangesDetected" class="text-red-500 mt-2">
					No se detectaron cambios en el formulario.
				</p>
				<div class="flex justify-between pt-4 border-t">
					<button :disabled="currentStep === 0" class="btn" @click="prevStep">
						Anterior
					</button>
					<button
						class="btn bg-brand-800 text-white hover:bg-brand-900"
						:disabled="currentStep === steps.length - 1 && !canSubmit"
						@click="handleNextOrSubmit">
						{{
							currentStep === steps.length - 1 ||
								(currentStep === 0 && reportaModeloDual === false)
								? 'Enviar'
								: 'Siguiente'
						}}
					</button>
				</div>

				<mdlInstitution
					:show="showModal"
					:data="modalData"
					@close="closeModal"
					@saved="handleInstitutionSaved" />
			</div>
		</div>
	</transition>
</template>

<style scoped>
.btn {
	@apply px-5 py-2 rounded-lg font-medium transition;
}
.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>