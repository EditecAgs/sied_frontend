<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import { getTypes } from '../../services/organizations/types';
import { getSectors } from '../../services/organizations/sectors';
import { getDualAreas } from '../../services/dual_projects/dual-areas';
import { getClusters } from '../../services/organizations/clusters';
import { getDocumentStatuses } from '../../services/dual_projects/documents-statuses';
import { getEconomicSupports } from '../../services/dual_projects/economic-supports';
import { getStates } from '../../services/location/states';
import { getMunicipalities } from '../../services/location/municipalities';

const props = defineProps({
	modelValue: Object
});
const emit = defineEmits(['update:modelValue']);

const update = (field, value) => {
	emit('update:modelValue', { ...props.modelValue, [field]: value });
	if (errors.value[field]) {
		errors.value[field] = '';
	}
};

const errors = ref({});
const validate = () => {
	const requiredFields = [
		'nombreProyecto', 'area', 'tipoUnidad', 'sector', 'tamano', 'cluster',
		'calle', 'numeroExterior', 'colonia', 'estado', 'municipio', 'cp',
		'fechaInicio', 'fechaFin', 'estadoConvenio', 'apoyoEconomico'
	];

	let isValid = true;
	errors.value = {};
	for (const field of requiredFields) {
		if (!props.modelValue?.[field]) {
			errors.value[field] = 'Este campo es obligatorio';
			isValid = false;
		}
	}
	return isValid;
};
defineExpose({ validate });

const tiposUnidad = ref([]);
const sectores = ref([]);
const tamanos = [
	'Micro (1 a 10 trabajadores)',
	'Pequeña (11 a 50 trabajadores)',
	'Mediana (51 a 100 trabajadores)',
	'Grande (Más de 100 trabajadores)'
];
const clusters = ref([]);
const areas = ref([]);
const estadosConvenio = ref([]);
const tiposApoyo = ref([]);

const states = ref([]);
const municipalities = ref([]);
const allMunicipalities = ref([]);

const isLoading = ref(false);

onMounted(async () => {
	try {
		isLoading.value = true;
		tiposUnidad.value = (await getTypes()).data;
		sectores.value = (await getSectors()).data;
		clusters.value = (await getClusters()).data;
		areas.value = (await getDualAreas()).data;
		estadosConvenio.value = (await getDocumentStatuses()).data;
		tiposApoyo.value = (await getEconomicSupports()).data;

		states.value = (await getStates()).data;
		allMunicipalities.value = (await getMunicipalities()).data;

		if (props.modelValue?.estado) {
			municipalities.value = allMunicipalities.value.filter(
				(m) => m.id_state === props.modelValue.estado
			);
		}
	} catch (err) {
		console.error('Error al cargar datos:', err);
	} finally {
		isLoading.value = false;
	}
});

const fechaInicio = ref(props.modelValue.fechaInicio || null);
const fechaFin = ref(props.modelValue.fechaFin || null);

watch(fechaInicio, (val) => update('fechaInicio', val));
watch(fechaFin, (val) => update('fechaFin', val));

watch(() => props.modelValue.estado, (nuevoEstado) => {
	update('municipio', '');
	municipalities.value = allMunicipalities.value.filter(
		(m) => m.id_state === nuevoEstado
	);
});
</script>

<template>
	<div class="space-y-8">
		<h2 class="text-xl font-semibold text-brand-900">Unidad Dual</h2>

		<!-- Info general -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="label">Nombre del Proyecto</label>
				<input type="text" class="input" :value="modelValue.nombreProyecto" @input="update('nombreProyecto', $event.target.value)" />
				<p v-if="errors.nombreProyecto" class="text-red-500 text-sm mt-1">{{ errors.nombreProyecto }}</p>
			</div>

			<div>
				<label class="label">Área del Proyecto Dual</label>
				<select class="select" :value="modelValue.area" @change="update('area', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="area in areas" :key="area.id" :value="area.id">{{ area.name }}</option>
				</select>
				<p v-if="errors.area" class="text-red-500 text-sm mt-1">{{ errors.area }}</p>
			</div>

			<div>
				<label class="label">Tipo de Unidad Dual</label>
				<select class="select" :value="modelValue.tipoUnidad" @change="update('tipoUnidad', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="tipo in tiposUnidad" :key="tipo.id" :value="tipo.id">{{ tipo.name }}</option>
				</select>
				<p v-if="errors.tipoUnidad" class="text-red-500 text-sm mt-1">{{ errors.tipoUnidad }}</p>
			</div>

			<div>
				<label class="label">Sector</label>
				<select class="select" :value="modelValue.sector" @change="update('sector', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="sector in sectores" :key="sector.id" :value="sector.id">{{ sector.name }}</option>
				</select>
				<p v-if="errors.sector" class="text-red-500 text-sm mt-1">{{ errors.sector }}</p>
			</div>

			<div>
				<label class="label">Tamaño de la Unidad Dual</label>
				<select class="select" :value="modelValue.tamano" @change="update('tamano', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="tam in tamanos" :key="tam" :value="tam">{{ tam }}</option>
				</select>
				<p v-if="errors.tamano" class="text-red-500 text-sm mt-1">{{ errors.tamano }}</p>
			</div>

			<div>
				<label class="label">Cámara, Asociación, Grupo o Clúster</label>
				<select class="select" :value="modelValue.cluster" @change="update('cluster', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="cluster in clusters" :key="cluster.id" :value="cluster.id">{{ cluster.name }}</option>
				</select>
				<p v-if="errors.cluster" class="text-red-500 text-sm mt-1">{{ errors.cluster }}</p>
			</div>
		</div>

		<!-- Dirección -->
		<div class="space-y-4">
			<h3 class="text-lg font-medium text-gray-800">Dirección de la Unidad Dual</h3>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="label">Calle</label>
					<input type="text" class="input" :value="modelValue.calle" @input="update('calle', $event.target.value)" />
					<p v-if="errors.calle" class="text-red-500 text-sm mt-1">{{ errors.calle }}</p>
				</div>
				<div>
					<label class="label">Número Exterior</label>
					<input type="text" class="input" :value="modelValue.numeroExterior" @input="update('numeroExterior', $event.target.value)" />
					<p v-if="errors.numeroExterior" class="text-red-500 text-sm mt-1">{{ errors.numeroExterior }}</p>
				</div>
				<div>
					<label class="label">Número Interior</label>
					<input type="text" class="input" :value="modelValue.numeroInterior" @input="update('numeroInterior', $event.target.value)" />
					<!-- No requerido, sin validación -->
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="label">Colonia</label>
					<input type="text" class="input" :value="modelValue.colonia" @input="update('colonia', $event.target.value)" />
					<p v-if="errors.colonia" class="text-red-500 text-sm mt-1">{{ errors.colonia }}</p>
				</div>

				<div>
					<label class="label">Estado</label>
					<select class="select" :value="modelValue.estado" @change="event => update('estado', Number(event.target.value))" :disabled="isLoading">
						<option value="" disabled>Seleccione un estado</option>
						<option v-for="estado in states" :key="estado.id" :value="estado.id">{{ estado.name }}</option>
					</select>
					<p v-if="errors.estado" class="text-red-500 text-sm mt-1">{{ errors.estado }}</p>
				</div>

				<div>
					<label class="label">Municipio / Delegación</label>
					<select class="select" :value="modelValue.municipio" @change="event => update('municipio', Number(event.target.value))" :disabled="isLoading || municipalities.length === 0">
						<option value="" disabled>Seleccione un municipio</option>
						<option v-for="municipio in municipalities" :key="municipio.id" :value="municipio.id">{{ municipio.name }}</option>
					</select>
					<p v-if="errors.municipio" class="text-red-500 text-sm mt-1">{{ errors.municipio }}</p>
				</div>
			</div>

			<div>
				<label class="label">Código Postal</label>
				<input type="text" class="input" :value="modelValue.cp" @input="update('cp', $event.target.value)" />
				<p v-if="errors.cp" class="text-red-500 text-sm mt-1">{{ errors.cp }}</p>
			</div>
		</div>

		<!-- Periodo del Proyecto Dual -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="label">Fecha de Inicio del Proyecto Dual</label>
				<Datepicker v-model="fechaInicio" placeholder="Seleccione la fecha de inicio" class="input" />
				<p v-if="errors.fechaInicio" class="text-red-500 text-sm mt-1">{{ errors.fechaInicio }}</p>
			</div>
			<div>
				<label class="label">Fecha de Fin del Proyecto Dual</label>
				<Datepicker v-model="fechaFin" placeholder="Seleccione la fecha de fin" class="input" />
				<p v-if="errors.fechaFin" class="text-red-500 text-sm mt-1">{{ errors.fechaFin }}</p>
			</div>
		</div>

		<!-- Convenio y Apoyo -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="label">Estado del Convenio Dual</label>
				<select class="select" :value="modelValue.estadoConvenio" @change="update('estadoConvenio', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="estado in estadosConvenio" :key="estado.id" :value="estado.id">{{ estado.name }}</option>
				</select>
				<p v-if="errors.estadoConvenio" class="text-red-500 text-sm mt-1">{{ errors.estadoConvenio }}</p>
			</div>
			<div>
				<label class="label">Tipo de Apoyo Económico</label>
				<select class="select" :value="modelValue.apoyoEconomico" @change="update('apoyoEconomico', $event.target.value)">
					<option value="">Seleccione una opción</option>
					<option v-for="apoyo in tiposApoyo" :key="apoyo.id" :value="apoyo.id">{{ apoyo.name }}</option>
				</select>
				<p v-if="errors.apoyoEconomico" class="text-red-500 text-sm mt-1">{{ errors.apoyoEconomico }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input,
.select {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-800 focus:border-brand-800;
}
</style>
