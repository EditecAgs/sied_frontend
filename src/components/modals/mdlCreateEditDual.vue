<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted } from 'vue';
import axios from 'axios';
import DualStepPersonal from '../forms/DualStepPersonal.vue';
import DualStepAcademico from '../forms/DualStepAcademico.vue';
import DualStepUnidad from '../forms/DualStepUnidad.vue';

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

const isLoading = ref(false);
const currentStep = ref(0);
const reportaModeloDual = ref(null);

const steps = [
	{ title: 'Información Personal' },
	{ title: 'Datos Académicos' },
	{ title: 'Unidad Dual' }
];

// Formulario reactivo
const formData = reactive({
	personal: {
		nombre: '',
		direccion: '',
		tipoInstitucion: '',
		institucion: ''
	},
	academico: {
		matricula: '',
		carrera: '',
		periodo: ''
	},
	unidadDual: {
		nombreEmpresa: '',
		tipoEmpresa: '',
		fechaInicio: '',
		fechaTermino: '',
		areaProyecto: ''
	}
});

// Limpiar datos si es modo creación
const resetForm = () => {
	formData.personal = {
		nombre: '',
		direccion: '',
		tipoInstitucion: '',
		institucion: ''
	};
	formData.academico = {
		matricula: '',
		carrera: '',
		periodo: ''
	};
	formData.unidadDual = {
		nombreEmpresa: '',
		tipoEmpresa: '',
		fechaInicio: '',
		fechaTermino: '',
		areaProyecto: ''
	};
	reportaModeloDual.value = null;
	currentStep.value = 0;
};

// Cargar si modo edición
watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		isLoading.value = true;
		axios.get(`dual-projects/${props.data.pk}`).then((res) => {
			const project = res.data;
			formData.personal = {
				nombre: project.student_name,
				direccion: project.student_address,
				tipoInstitucion: project.institution_type,
				institucion: project.institution_id
			};
			formData.academico = {
				matricula: project.student_id,
				carrera: project.career,
				periodo: project.academic_period
			};
			if (project.has_dual_unit) {
				formData.unidadDual = {
					nombreEmpresa: project.company_name,
					tipoEmpresa: project.company_type,
					fechaInicio: project.start_date,
					fechaTermino: project.end_date,
					areaProyecto: project.project_area
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

const nextStep = () => {
	if (currentStep.value === 0 && reportaModeloDual.value === false) {
		submitForm();
	} else if (currentStep.value < steps.length - 1) {
		currentStep.value++;
	}
};

const prevStep = () => {
	if (currentStep.value > 0) {
		currentStep.value--;
	}
};

const submitForm = async () => {
	const payload = {
		student_data: formData.personal,
		academic_data: formData.academico,
		dual_unit_data: reportaModeloDual.value ? formData.unidadDual : null
	};

	try {
		if (props.data.mode === 'edit' && props.data.pk !== null) {
			await axios.put(`dual-projects/${props.data.pk}`, payload);
		} else {
			await axios.post('dual-projects', payload);
		}
		emit('saved');
		emit('close');
	} catch (err) {
		console.error("Error al enviar el formulario:", err);
	}
};
</script>

<template>
	<transition name="fade-scale">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" style="margin-top: 0px;"
			@click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] flex flex-col overflow-hidden">
				<button
					@click="emit('close')"
					class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-xl font-bold"
					title="Cerrar">
					&times;
				</button>
				<h4 class="text-2xl font-bold text-brand-900 mb-6">
					{{ props.data.mode === 'create' ? 'Crear Proyecto Dual' : 'Editar Proyecto Dual' }}
				</h4>

				<div class="flex justify-between mb-6">
					<div
						v-for="(step, index) in steps"
						:key="index"
						class="flex-1 flex flex-col items-center">
						<div
							:class="[
								'w-8 h-8 flex items-center justify-center rounded-full mb-1 text-sm font-semibold',
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

				<div class="flex-grow overflow-y-auto pr-2 mb-4">
					<DualStepPersonal
						v-if="currentStep === 0"
						v-model="formData.personal"
						v-model:reportaModeloDual="reportaModeloDual" />

					<DualStepAcademico
						v-else-if="currentStep === 1"
						v-model="formData.academico" />

					<DualStepUnidad
						v-else-if="currentStep === 2 && reportaModeloDual"
						v-model="formData.unidadDual" />

					<div v-else-if="currentStep === 2 && reportaModeloDual === false" class="text-center py-8">
						<p class="text-gray-600 mb-4">No se requieren datos de Unidad Dual</p>
						<button
							class="bg-brand-800 text-white px-6 py-2 rounded-lg hover:bg-brand-900"
							@click="submitForm">
							Enviar Formulario
						</button>
					</div>
				</div>

				<div class="flex justify-between pt-4 border-t">
					<button
						:disabled="currentStep === 0"
						class="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50"
						@click="prevStep">
						Anterior
					</button>
					<button
						class="px-5 py-2 rounded-lg bg-brand-800 text-white font-medium hover:bg-brand-900"
						:disabled="currentStep === 0 && reportaModeloDual === null"
						@click="nextStep">
						{{ currentStep === steps.length - 1 || (currentStep === 0 && reportaModeloDual === false) ? 'Enviar' : 'Siguiente' }}
					</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<style scoped>
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
