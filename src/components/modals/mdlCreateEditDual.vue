<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref } from 'vue';
import axios from 'axios';

import DualStepPersonal from '../forms/DualStepPersonal.vue';
import DualStepAcademico from '../forms/DualStepAcademico.vue';
import DualStepUnidad from '../forms/DualStepUnidad.vue';
import MdlInstitution from '../modals/mdlInstitution.vue';
import { useModal } from '../../composables/UseModal';
import { createDualProject } from '../../services/dual_projects/dual_projects';

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
	formData.academico = {
		id_institution: ''
	};
	formData.unidadDual = {
		name_report: '',
		id_organization: '',
		id_dual_area: '',
		period_start: '',
		period_end: '',
		status_document: '',
		economic_support: '',
		amount: '1500'
	};
	reportaModeloDual.value = null;
	currentStep.value = 0;
};

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		isLoading.value = true;
		axios.get(`dual-projects/${props.data.pk}`).then((res) => {
			const project = res.data;
			formData.personal = {
				control_number: project.student_id,
				name_student: project.first_name,
				lastname: project.last_name,
				gender: project.gender,
				semester: project.semester,
				id_career: project.career,
				id_specialty: project.id_specialty,
				number_men: '1',
				number_women: '1'
			};
			formData.academico = {
				id_institution: project.institution_id
			};
			if (project.has_dual_unit) {
				formData.unidadDual = {
					name_report: project.project_name,
					id_organization: project.organization_id,
					id_dual_area: project.project_area_id,
					period_start: project.start_date,
					period_end: project.end_date,
					status_document: project.dual_status_id,
					economic_support: project.support_type_id,
					amount: '1500'
				};
				reportaModeloDual.value = true;
			} else {
				reportaModeloDual.value = false;
			}
		}).finally(() => {
			isLoading.value = false;
		});
	} else if (props.data.mode === 'create') {
		resetForm();
	}
});

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
				// Datos académicos
				has_report: 1,
				id_institution: Number(formData.academico.id_institution),

				// Datos personales
				control_number: formData.personal.control_number,
				name_student: formData.personal.name_student,
				lastname: formData.personal.lastname,
				gender: formData.personal.gender,
				semester: Number(formData.personal.semester),
				id_career: Number(formData.personal.id_career),
				id_specialty: Number(formData.personal.id_specialty),
				number_men: Number(formData.personal.number_men),
				number_women: Number(formData.personal.number_women),

				// Unidad dual
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

		console.log('Payload a enviar:', payload);
		await createDualProject(payload);
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
</script>

<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] flex flex-col overflow-hidden">
				<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold" @click="emit('close')">&times;</button>

				<h4 class="text-2xl font-bold text-brand-900 mb-6">
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
					<DualStepAcademico
						ref="stepAcademicoRef"
						v-if="currentStep === 0"
						v-model="formData.academico"
						v-model:reportaModeloDual="reportaModeloDual"
						@submitSinUnidadDual="imprimirYGuardar" />

					<DualStepPersonal
						ref="stepPersonalRef"
						v-else-if="currentStep === 1"
						v-model="formData.personal" />

					<DualStepUnidad
						v-else-if="currentStep === 2 && reportaModeloDual"
						v-model="formData.unidadDual"
						ref="stepUnidadDualRef" />

					<div v-else-if="currentStep === 2 && reportaModeloDual === false" class="text-center py-8">
						<p class="text-gray-600 mb-4">No se requieren datos de Unidad Dual</p>
						<button class="bg-brand-800 text-white px-6 py-2 rounded-lg hover:bg-brand-900" @click="submitForm">
							Enviar Formulario
						</button>
					</div>
				</div>

				<!-- Botones -->
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
