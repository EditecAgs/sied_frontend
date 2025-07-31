<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, ref, onMounted } from 'vue';
import axios from 'axios';
import DualStepPersonal from '../forms/DualStepPersonal.vue';
import DualStepAcademico from '../forms/DualStepAcademico.vue';
import DualStepUnidad from '../forms/DualStepUnidad.vue';
import mdlInstitution from '../modals/mdlInstitution.vue';
import { useModal } from '../../composables/UseModal';
import { createDualProject, updateDualProject, showDualProject } from '../../services/dual_projects/dual_projects';
import {getInstitutions} from '../../services/institutions/institutions.js'
import { getCareers } from '../../services/institutions/careers.js';
import { getSpecialties } from '../../services/institutions/specialties.js';
import { getClusters } from '../../services/organizations/clusters.js';
import { getDualAreas } from '../../services/dual_projects/dual-areas.js';
import { getOrganizations } from '../../services/organizations/organizations.js';
import { getDocumentStatuses } from '../../services/dual_projects/documents-statuses.js';
import { getEconomicSupports }from '../../services/dual_projects/economic-supports.js';


const emit = defineEmits(['close', 'saved']);
// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean;
	data: {
		mode: 'create' | 'edit';
		pk: number | null;
		table: string;
	};
}>();

const { showModal, modalData, openModal, closeModal } = useModal();
const isLoading = ref(false);
const currentStep = ref(0);
const reportaModeloDual = ref<boolean | null>(null);
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
const noChangesDetected = ref(false);
const originalFormData = ref<any>(null);

const LoadDependence = async () => {
  const [institutionsRes, careersRes, specialtiesRes, clustersRes, statusesRes, areasRes, supportsRes, orgsRes] = await Promise.all([
    getInstitutions(),
    getCareers(),
    getSpecialties(),
    getClusters(),
    getDocumentStatuses(),
    getDualAreas(),
    getEconomicSupports(),
    getOrganizations()
  ]);
  institutions.value = institutionsRes.data;
  careers.value = careersRes.data;
  specialties.value = specialtiesRes.data;
  clusters.value = clustersRes.data;
  agreementStatuses.value = statusesRes.data;
  areas.value = areasRes.data;
  supportTypes.value = supportsRes.data;
  organizations.value = orgsRes.data;
};



onMounted(() => {
  LoadDependence();
});


const steps = [
	{ title: 'Información de Institución' },
	{ title: 'Datos Personales' },
	{ title: 'Unidad Dual' }
];

const formData = reactive({
	personal: {
		control_number: '',
		name_student: '',
		lastname: '',
		gender: '',
		semester: '',
		id_career: '',
		id_specialty: '',
		number_men: '1',
		number_women: '1'
	},
	academico: {
		id_institution: ''
	},
	unidadDual: {
		name_report: '',
		id_organization: '',
		id_dual_area: '',
		period_start: '',
		period_end: '',
		status_document: '',
		economic_support: '',
		amount: '1500'
	}
});

const formatDate = (date: string | Date): string => {
	if (!date) return '';
	const d = new Date(date);
	return d.toISOString().slice(0, 10);
};

const resetForm = () => {
	formData.personal = {
		control_number: '', name_student: '', lastname: '', gender: '', semester: '', id_career: '', id_specialty: '', number_men: '1', number_women: '1'
	};
	formData.academico = { id_institution: '' };
	formData.unidadDual = {
		name_report: '', id_organization: '', id_dual_area: '',
		period_start: '', period_end: '', status_document: '',
		economic_support: '', amount: '1500'
	};
	reportaModeloDual.value = null;
	currentStep.value = 0;
};

watch(
  () => props.data,
  async (newData) => {
    if (newData.mode === 'edit' && newData.pk !== null) {
      isLoading.value = true;
      try {
        const res = await showDualProject(newData.pk);
        const project = res.data;
        formData.personal = {
          control_number: project.students?.[0]?.control_number ?? '',
          name_student: project.students?.[0]?.name ?? '',
          lastname: project.students?.[0]?.lastname ?? '',
          gender: project.students?.[0]?.gender ?? '',
          semester: project.students?.[0]?.semester ?? '',
          id_career: project.students?.[0]?.career?.id ?? '',
          id_specialty: project.students?.[0]?.specialty?.id ?? '',
          number_men: String(project.dual_project_reports?.number_men ?? '1'),
          number_women: String(project.dual_project_reports?.number_women ?? '1')
        };

        formData.academico = {
          id_institution: project.id_institution ?? ''
        };

        if (project.has_report === 1) {
          formData.unidadDual = {
            name_report: project.dual_project_reports?.name ?? '',
            id_organization: project.organization_dual_projects?.organization?.id ?? '',
            id_dual_area: project.dual_project_reports?.dual_area?.id ?? '',
            period_start: project.dual_project_reports?.period_start ?? '',
            period_end: project.dual_project_reports?.period_end ?? '',
            status_document: project.dual_project_reports?.status_document?.id ?? '',
            economic_support: project.dual_project_reports?.economic_support?.id ?? '',
            amount: String(project.dual_project_reports?.amount ?? '1500')
          };
          reportaModeloDual.value = true;
        } else {
          reportaModeloDual.value = false;
        }
      } catch (error) {
        console.error("Error al cargar el proyecto dual:", error);
      } finally {
        isLoading.value = false;
		originalFormData.value = JSON.stringify(formData);
      }
    } else if (newData.mode === 'create') {
      resetForm();
    }
  },
  { immediate: true }
);


const handleNextOrSubmit = async () => {
	if (currentStep.value === 0) {
		const isValid = await stepAcademicoRef.value?.validate?.();
		if (!isValid) return;

		if (reportaModeloDual.value === false) {
			imprimirYGuardar();
			return;
		}
		nextStep();
	} else if (currentStep.value === 1) {
		const isValid = await stepPersonalRef.value?.validate?.();
		if (!isValid) return;
		nextStep();
	} else if (currentStep.value === 2) {
		const isValid = await stepUnidadDualRef.value?.validate?.();
		if (!isValid) return;

		imprimirYGuardar();
	}
};

const nextStep = () => {
	if (currentStep.value < steps.length - 1) {
		currentStep.value++;
	}
};

const prevStep = () => {
	if (currentStep.value > 0) {
		currentStep.value--;
	}
};

const imprimirYGuardar = async () => {
	try {
		let payload: Record<string, any>;

		if (reportaModeloDual.value === false) {
			payload = {
				has_report: 0,
				id_institution: Number(formData.academico.id_institution)
			};
		} else {
			payload = {
				has_report: 1,
				id_institution: Number(formData.academico.id_institution),
				control_number: formData.personal.control_number,
				name_student: formData.personal.name_student,
				lastname: formData.personal.lastname,
				gender: formData.personal.gender,
				semester: Number(formData.personal.semester),
				id_career: Number(formData.personal.id_career),
				id_specialty: Number(formData.personal.id_specialty),
				number_men: Number(formData.personal.number_men),
				number_women: Number(formData.personal.number_women),
				name_report: formData.unidadDual.name_report,
				id_organization: Number(formData.unidadDual.id_organization),
				id_dual_area: Number(formData.unidadDual.id_dual_area),
				period_start: formatDate(formData.unidadDual.period_start),
				period_end: formatDate(formData.unidadDual.period_end),
				status_document: Number(formData.unidadDual.status_document),
				economic_support: Number(formData.unidadDual.economic_support),
				amount: Number(formData.unidadDual.amount)
			};
		}
		const currentData = JSON.stringify(formData);
		if (props.data.mode === 'create') {
			console.log('Payload a enviar create:', payload);
			await createDualProject(payload);
		} else {
			if (currentData === originalFormData.value) {
				noChangesDetected.value = true;
				return;
			}
			noChangesDetected.value = false;
			console.log('Payload a enviar update:', payload);
			await updateDualProject(props.data.pk, payload);
		}
		emit('saved');
		emit('close');
	} catch (err: any) {
		if (axios.isAxiosError(err) && err.response) {
			console.error("422 Response data:", err.response.data);
		} else {
			console.error("Error al enviar el formulario:", err);
		}
	}
};

const handleInstitutionSaved = () => {
	closeModal();
};

const closeModalAndReset = () => {
  noChangesDetected.value = false;
  emit('close');
}
</script>


<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] flex flex-col overflow-hidden">
				<button
					class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
					@click="closeModalAndReset">
					&times;
				</button>

				<h4 class="text-2xl font-bold text-brand-900 mb-6 flex items-center justify-between">
					{{ props.data.mode === 'create' ? 'Crear Proyecto Dual' : 'Editar Proyecto Dual' }}
				</h4>

				<!-- Steps -->
				<div class="flex justify-between mb-6">
					<div v-for="(step, index) in steps" :key="index" class="flex-1 flex flex-col items-center">
						<div
							:class="[ 'w-8 h-8 flex items-center justify-center rounded-full mb-1 text-sm font-semibold',
								currentStep === index ? 'bg-brand-800 text-white' :
								currentStep > index ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'
							]">
							{{ currentStep > index ? '✓' : index + 1 }}
						</div>
						<span :class="currentStep === index ? 'text-brand-800 font-bold text-xs' : 'text-gray-500 text-xs'">
							{{ step.title }}
						</span>
					</div>
				</div>

				<!-- Form Steps -->
				<div class="flex-grow overflow-y-auto pr-2 mb-4">
					<template v-if="!isLoading">
						<DualStepAcademico
							v-if="currentStep === 0"
							ref="stepAcademicoRef"
							v-model="formData.academico"
							v-model:reportaModeloDual="reportaModeloDual"
							v-model:institutions="institutions"
							@submitSinUnidadDual="imprimirYGuardar" />

						<DualStepPersonal
							v-else-if="currentStep === 1"
							ref="stepPersonalRef"
							v-model="formData.personal"
							:careers="careers"
							:specialties="specialties" />

						<DualStepUnidad
							v-else-if="currentStep === 2 && reportaModeloDual"
							ref="stepUnidadDualRef"
							v-model="formData.unidadDual"
							:areas="areas"
							:clusters="clusters"
							:agreementStatuses="agreementStatuses"
							:supportTypes="supportTypes"
							:organizations="organizations" />


					</template>
					<template v-else>
						<div class="flex justify-center items-center h-full">
							<div class="w-10 h-10 border-4 border-gray-300 border-t-brand-800 rounded-full animate-spin" />
							<span class="ml-4 text-gray-500 font-medium">Cargando información...</span>
						</div>
					</template>
				</div>


				<p v-if="noChangesDetected" class="text-red-500 mt-2">
					No se detectaron cambios en el formulario.
				</p>
				<div class="flex justify-between pt-4 border-t">
					<button :disabled="currentStep === 0" class="btn" @click="prevStep">Anterior</button>
					<button
						class="btn bg-brand-800 text-white hover:bg-brand-900"
						:disabled="currentStep === 0 && reportaModeloDual === null"
						@click="handleNextOrSubmit">
						{{ currentStep === steps.length - 1 || (currentStep === 0 && reportaModeloDual === false) ? 'Enviar' : 'Siguiente' }}
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
