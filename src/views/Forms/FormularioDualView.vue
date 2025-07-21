<template>
	<AdminLayout>
		<PageBreadcrumb :pageTitle="currentPageTitle" />
		<div class="space-y-5 sm:space-y-6">
			<ComponentCard title="Registro de Modelo Dual">
				<!-- Botón para abrir formulario multi-paso -->
				<button
					class="flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-white bg-brand-800 hover:bg-brand-900 rounded-lg transition-colors"
					@click="openMultiStepForm">
					<span>➕</span>
					<span>Nuevo Registro Dual</span>
				</button>

				<div v-if="showMultiStepModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div class="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative">
						<button
							class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
							@click="closeModal"
							aria-label="Cerrar modal">
							&times;
						</button>

						<div class="flex justify-between mb-8">
							<div
								v-for="(step, index) in steps" :key="index"
								class="flex flex-col items-center flex-1">
								<div
									:class="[
										'w-10 h-10 rounded-full flex items-center justify-center mb-2',
										currentStep === index ? 'bg-brand-800 text-white' :
										currentStep > index ? 'bg-brand-900 text-white' : 'bg-gray-200'
									]">
									{{ currentStep > index ? '✓' : index + 1 }}
								</div>
								<span
									:class="[
										'text-sm',
										currentStep === index ? 'font-bold text-brand-800' : 'text-gray-600'
									]">
									{{ step.title }}
								</span>
							</div>
						</div>


						<div class="mb-6">
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

							<div v-else-if="currentStep === 2 && !reportaModeloDual" class="text-center py-8">
								<p class="text-gray-600 mb-6">No se requieren datos de Unidad Dual para este seguimiento</p>
								<button
									class="px-6 py-3 bg-brand-800 text-white rounded-lg hover:bg-brand-900 transition-colors"
									@click="submitForm">
									Enviar Formulario
								</button>
							</div>
						</div>


						<div class="flex justify-between border-t pt-6">
							<button
								:disabled="currentStep === 0"
								:class="[
									'px-6 py-2 rounded-lg',
									currentStep === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
									'bg-gray-200 hover:bg-gray-300'
								]"
								@click="prevStep">
								Anterior
							</button>

							<button
								:class="[
									'px-6 py-2 rounded-lg text-white',
									(currentStep === 0 && reportaModeloDual === null) ?
										'bg-gray-400 cursor-not-allowed' : 'bg-brand-800 hover:bg-brand-900'
								]"
								:disabled="currentStep === 0 && reportaModeloDual === null"
								@click="nextStep">
								{{ currentStep === steps.length - 1 ||
									(currentStep === 0 && reportaModeloDual === false) ? 'Enviar' : 'Siguiente' }}
							</button>
						</div>
					</div>
				</div>

				<TableModeloDual
					ref="tableRef"
					@edit="handleEditDualProject" />
			</ComponentCard>
		</div>
	</AdminLayout>
</template>

<script setup>
import { ref, reactive } from "vue";
import AdminLayout from "../../components/layouts/AdminLayout.vue";
import PageBreadcrumb from "../../components/common/PageBreadcrumb.vue";
import ComponentCard from "../../components/common/componentCard.vue";
import TableModeloDual from "../../components/tables/basic-tables/TableModeloDual.vue";
import DualStepPersonal from "../../components/forms/DualStepPersonal.vue";
import DualStepAcademico from "../../components/forms/DualStepAcademico.vue";
import DualStepUnidad from "../../components/forms/DualStepUnidad.vue";

const currentPageTitle = ref("Modelo Dual");
const showMultiStepModal = ref(false);
const currentStep = ref(0);
const reportaModeloDual = ref(null);
const tableRef = ref(null);

const steps = [
	{ title: 'Información Personal', icon: 'user' },
	{ title: 'Datos Académicos', icon: 'academic-cap' },
	{ title: 'Datos de Unidad Dual', icon: 'building' }
];

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

const openMultiStepForm = () => {
	resetForm();
	showMultiStepModal.value = true;
	currentStep.value = 0;
	reportaModeloDual.value = null;
};

const handleEditDualProject = (project) => {
	// Llenar formData con los datos del proyecto a editar
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

	showMultiStepModal.value = true;
};

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
};

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
	try {
		const payload = {
			student_data: formData.personal,
			academic_data: formData.academico,
			dual_unit_data: reportaModeloDual.value ? formData.unidadDual : null
		};

		// Aquí iría la llamada a tu API
		// const response = await axios.post('/dual-projects', payload);

		console.log('Datos enviados:', payload);
		showMultiStepModal.value = false;
		tableRef.value?.fetchData();
	} catch (error) {
		console.error('Error al enviar el formulario:', error);
	}
};

const closeModal = () => {
	showMultiStepModal.value = false;
};
</script>