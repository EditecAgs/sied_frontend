<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PersonalStep from '../../components/forms/DualStepPersonal.vue';
import AcademicoStep from '../../components/forms/DualStepAcademico.vue';
import UnidadDualStep from '../../components/forms/DualStepUnidad.vue';


const router = useRouter();
const currentStep = ref(0);
const reportaModeloDual = ref(null);

const formData = reactive({
	personal: {
		nombre: '',
		tipoInstitucion: '',
		institucion: '',
		direccion: ''
	},
	academico: {
		matricula: '',
		nivel: ''
	},
	unidadDual: {
		nombreEmpresa: '',
		fechaInicio: '',
		fechaTermino: ''
	}
});

const steps = [
	{ title: 'Información Personal', icon: 'user' },
	{ title: 'Datos Académicos', icon: 'academic-cap' },
	{ title: 'Datos de Unidad Dual', icon: 'building' }
];

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

const submitForm = () => {
	console.log('Formulario enviado:', {
		...formData,
		reportaModeloDual: reportaModeloDual.value
	});
	router.push('/formulario/exito');
};
</script>

<template>
	<div class="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow">
		<h1 class="text-2xl font-bold text-center mb-6">Formulario Multi-Sección</h1>

		<!-- Stepper -->
		<div class="flex justify-between mb-8">
			<div
				v-for="(step, index) in steps" :key="index"
				class="flex flex-col items-center flex-1">
				<div
					:class="[
						'w-10 h-10 rounded-full flex items-center justify-center mb-2',
						currentStep === index ? 'bg-blue-600 text-white' : 
						currentStep > index ? 'bg-green-500 text-white' : 'bg-gray-200'
					]">
					{{ currentStep > index ? '✓' : index + 1 }}
				</div>
				<span
					:class="[
						'text-sm',
						currentStep === index ? 'font-bold text-blue-600' : 'text-gray-600'
					]">
					{{ step.title }}
				</span>
			</div>
		</div>

		<!-- Contenido del paso actual -->
		<div class="mb-6">
			<PersonalStep
				v-if="currentStep === 0"
				v-model="formData.personal"
				v-model:reportaModeloDual="reportaModeloDual" />

			<AcademicoStep
				v-else-if="currentStep === 1"
				v-model="formData.academico" />

			<UnidadDualStep
				v-else-if="currentStep === 2 && reportaModeloDual"
				v-model="formData.unidadDual" />

			<div v-else-if="currentStep === 2 && !reportaModeloDual" class="text-center py-8">
				<p class="text-gray-600 mb-4">No se requieren datos de Unidad Dual para este seguimiento</p>
				<button
					class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					@click="submitForm">
					Enviar Formulario
				</button>
			</div>
		</div>

		<!-- Navegación -->
		<div class="flex justify-between border-t pt-4">
			<button
				:disabled="currentStep === 0"
				:class="[
					'px-4 py-2 rounded',
					currentStep === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 
					'bg-gray-200 hover:bg-gray-300'
				]"
				@click="prevStep">
				Anterior
			</button>

			<button
				:class="[
					'px-4 py-2 rounded text-white',
					(currentStep === 0 && reportaModeloDual === null) ? 
						'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
				]"
				:disabled="currentStep === 0 && reportaModeloDual === null"
				@click="nextStep">
				{{ currentStep === steps.length - 1 ||
					(currentStep === 0 && reportaModeloDual === false) ? 'Enviar' : 'Siguiente' }}
			</button>
		</div>
	</div>
</template>