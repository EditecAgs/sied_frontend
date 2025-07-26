<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted } from 'vue';
import axios from 'axios';

import DualStepPersonal from '../forms/DualStepPersonal.vue';
import DualStepAcademico from '../forms/DualStepAcademico.vue';
import DualStepUnidad from '../forms/DualStepUnidad.vue';
import MdlInstitution from '../modals/mdlInstitution.vue';
import { useModal } from '../../composables/UseModal';

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
		matricula: '',
		nombre: '',
		apellidos: '',
		genero: '',
		semestre: '',
		carrera: ''
	},
	academico: {
		institucion: ''
	},
	unidadDual: {
		nombreProyecto: '',
		tipoUnidad: '',
		sectorUnidad: '',
		tamanoUnidad: '',
		clusterAfiliado: '',
		domicilio: {
			calle: '',
			numeroExterno: '',
			numeroInterno: '',
			colonia: '',
			codigoPostal: '',
			estado: '',
			municipio: '',
			pais: '',
			ciudad: '',
			googleMaps: ''
		},
		areaProyecto: '',
		fechaInicio: '',
		fechaTermino: '',
		estadoConvenio: '',
		apoyoEconomico: ''
	}
});

const resetForm = () => {
	formData.personal = {
		matricula: '', nombre: '', apellidos: '', genero: '', semestre: '', carrera: ''
	};
	formData.academico = {
		institucion: ''
	};
	formData.unidadDual = {
		nombreProyecto: '', tipoUnidad: '', sectorUnidad: '', tamanoUnidad: '', clusterAfiliado: '',
		domicilio: {
			calle: '', numeroExterno: '', numeroInterno: '', colonia: '', codigoPostal: '', estado: '', municipio: '', pais: '', ciudad: '', googleMaps: ''
		},
		areaProyecto: '', fechaInicio: '', fechaTermino: '', estadoConvenio: '', apoyoEconomico: ''
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
				matricula: project.student_id,
				nombre: project.first_name,
				apellidos: project.last_name,
				genero: project.gender,
				semestre: project.semester,
				carrera: project.career
			};
			formData.academico = {
				institucion: project.institution_id,
			};
			if (project.has_dual_unit) {
				formData.unidadDual = {
					nombreProyecto: project.project_name,
					tipoUnidad: project.unit_type_id,
					sectorUnidad: project.sector_id,
					tamanoUnidad: project.unit_size,
					clusterAfiliado: project.cluster_id,
					domicilio: {
						calle: project.address_street,
						numeroExterno: project.address_ext,
						numeroInterno: project.address_int,
						colonia: project.address_neighborhood,
						codigoPostal: project.address_postal_code,
						estado: project.address_state,
						municipio: project.address_municipality,
						pais: project.address_country,
						ciudad: project.address_city,
						googleMaps: project.address_google_maps
					},
					areaProyecto: project.project_area_id,
					fechaInicio: project.start_date,
					fechaTermino: project.end_date,
					estadoConvenio: project.dual_status_id,
					apoyoEconomico: project.support_type_id
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

const validarDatosAcademicos = () => {
	const { institucion } = formData.academico;
	return institucion;
};

const validarDatosPersonales = () => {
	const { matricula, nombre, apellidos, genero, semestre, carrera } = formData.personal;
	return matricula && nombre && apellidos && genero && semestre && carrera;
};

const validarDatosUnidadDual = () => {
	if (!reportaModeloDual.value) return true;
	const unidad = formData.unidadDual;
	const d = unidad.domicilio;
	return unidad.nombreProyecto && unidad.tipoUnidad && unidad.sectorUnidad && unidad.tamanoUnidad &&
		unidad.clusterAfiliado && d.calle && d.numeroExterno && d.colonia && d.codigoPostal &&
		d.estado && d.municipio && d.pais && d.ciudad && unidad.areaProyecto && unidad.fechaInicio &&
		unidad.fechaTermino && unidad.estadoConvenio && unidad.apoyoEconomico;
};

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

const imprimirYGuardar = () => {
	console.log("Formulario completo:", JSON.stringify(formData, null, 2));
	submitForm();
};

const handleInstitutionSaved = () => {
	closeModal();
};
</script>


<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" style="margin-top: 0px;" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] flex flex-col overflow-hidden">
				<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold" @click="emit('close')">&times;</button>

				<h4 class="text-2xl font-bold text-brand-900 mb-6">
					{{ props.data.mode === 'create' ? 'Crear Proyecto Dual' : 'Editar Proyecto Dual' }}
				</h4>

				<!-- Steps -->
				<div class="flex justify-between mb-6">
					<div v-for="(step, index) in steps" :key="index" class="flex-1 flex flex-col items-center">
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

				<!-- Botón de navegación -->
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
