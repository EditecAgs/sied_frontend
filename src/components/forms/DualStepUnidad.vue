<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted, nextTick } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'floating-vue/dist/style.css';
import btnCreate from '../../components/buttons/btnCreate.vue';
import mdlOrganization from '../modals/modals-forms/mdlOrganization.vue';
import mdlCertification from '../modals/modals-forms/mdlCertification.vue';
import mdlDiploma from '../modals/modals-forms/mdlDiploma.vue';
import mdlMicroCredential from '../modals/modals-forms/mdlMicroCredential.vue';
import mdlDualType from "../../components/modals/modals-forms/mdlDualType.vue";
import mdlDualArea from '../../components/modals/modals-forms/mdlDualArea.vue';
import { useModal } from '../../composables/UseModal';
import { getOrganizations } from '../../services/organizations/organizations.js';
import { getMicroCredentials } from '../../services/dual_projects/micro-credentials';
import { getCertifications } from '../../services/dual_projects/certifications.js';
import { getDiplomas } from '../../services/dual_projects/diplomas';
import { getDualTypes } from '../../services/dual_projects/dual-types';
import { getDualAreas } from '../../services/dual_projects/dual-areas';

const emit = defineEmits(['update:modelValue', 'update:organizations', 'update:microCredentials', 'update:dualTypes', 'update:certifications', 'update:diplomas', 'update:dualAreas']);
const props = defineProps({
	modelValue: { type: Object, required: true },
	areas: Array,
	organizations: Array,
	agreementStatuses: Array,
	supportTypes: Array,
	dualTypes: Array,
	microCredentials: Array,
	certifications: Array,
	diplomas: Array
});

const { showModal, modalData, openModal, closeModal } = useModal();
const { showModal: showAreaModal, modalData: areaModalData, openModal: openAreaModal, closeModal: closeAreaModal } = useModal();
const { showModal: showMicroModal, modalData: microModalData, openModal: openMicroModal, closeModal: closeMicroModal } = useModal();
const { showModal: showCertificationModal, modalData: certificationModalData, openModal: openCertificationModal, closeModal: closeCertificationModal } = useModal();
const { showModal: showDiplomaModal, modalData: diplomaModalData, openModal: openDiplomaModal, closeModal: closeDiplomaModal } = useModal();
const { showModal: showDualTypeModal, modalData: dualTypeModalData, openModal: openDualTypeModal, closeModal: closeDualTypeModal } = useModal();

const maxQualification = ref(props.modelValue.max_qualification || '');
const errors = ref({});

const showValidationErrors = ref(false);
const hasAttemptedSubmit = ref(false);

const searchArea = ref('');
const showAreaDropdown = ref(false);
const areaDropdownRef = ref(null);

const searchOrganization = ref('');
const showOrganizationDropdown = ref(false);
const organizationDropdownRef = ref(null);

const searchStatus = ref('');
const showStatusDropdown = ref(false);
const statusDropdownRef = ref(null);

const searchSupport = ref('');
const showSupportDropdown = ref(false);
const supportDropdownRef = ref(null);

const searchDualType = ref('');
const showDualTypeDropdown = ref(false);
const dualTypeDropdownRef = ref(null);

const period_start = ref(props.modelValue.period_start ? new Date(props.modelValue.period_start) : null);
const period_end = ref(props.modelValue.period_end ? new Date(props.modelValue.period_end) : null);

const allMicroCredentials = ref(props.microCredentials || []);
const selectedMicroCredentials = ref([]);
const searchMicro = ref('');
const showMicroDropdown = ref(false);
const microDropdownRef = ref(null);

const allCertifications = ref(props.certifications || []);
const selectedCertifications = ref([]);
const searchCertification = ref('');
const showCertificationDropdown = ref(false);
const certificationDropdownRef = ref(null);

const allDiplomas = ref(props.diplomas || []);
const selectedDiplomas = ref([]);
const searchDiploma = ref('');
const showDiplomaDropdown = ref(false);
const diplomaDropdownRef = ref(null);

const internalAdvisorName = ref(props.modelValue.internal_advisor_name || '');
const externalAdvisorName = ref(props.modelValue.external_advisor_name || '');
const economic_benefit = ref(props.modelValue.economic_benefit || 0);
const time_benefit = ref(props.modelValue.time_benefit || 0);
const economic_benefit_note = ref(props.modelValue.economic_benefit_note || '');
const time_benefit_note = ref(props.modelValue.time_benefit_note || '');

const internalAdvisorQualification = ref(props.modelValue.internal_advisor_qualification || null);
const externalAdvisorQualification = ref(props.modelValue.external_advisor_qualification || null);

const isAmountDisabled = ref(false);
const amountField = ref(null);

const showCredentialsSection = computed(() => {
	return props.modelValue.is_concluded === 1;
});

const areQualificationsEnabled = computed(() => {
	return props.modelValue.is_concluded === 1;
});

const averageQualification = computed(() => {
	const intQ = Number(internalAdvisorQualification.value) || 0;
	const extQ = Number(externalAdvisorQualification.value) || 0;

	if (internalAdvisorQualification.value != null &&
		externalAdvisorQualification.value != null &&
		internalAdvisorQualification.value !== '' &&
		externalAdvisorQualification.value !== '') {
		return ((intQ + extQ) / 2).toFixed(2);
	}
	if (bothQualificationsPresent.value) {
		return ((intQ + extQ) / 2).toFixed(2);
	}
	return '';
});

const filteredAreas = computed(() =>
	!searchArea.value ? props.areas || [] : (props.areas || []).filter(a => a.name.toLowerCase().includes(searchArea.value.toLowerCase()))
);

const filteredOrganizations = computed(() =>
	!searchOrganization.value ? props.organizations || [] : (props.organizations || []).filter(o => o.name.toLowerCase().includes(searchOrganization.value.toLowerCase()))
);

const filteredStatuses = computed(() =>
	!searchStatus.value ? props.agreementStatuses || [] : (props.agreementStatuses || []).filter(s => s.name.toLowerCase().includes(searchStatus.value.toLowerCase()))
);

const filteredSupports = computed(() =>
	!searchSupport.value ? props.supportTypes || [] : (props.supportTypes || []).filter(s => s.name.toLowerCase().includes(searchSupport.value.toLowerCase()))
);

const filteredDualTypes = computed(() =>
	!searchDualType.value ? props.dualTypes || [] : (props.dualTypes || []).filter(d => d.name.toLowerCase().includes(searchDualType.value.toLowerCase()))
);

const firstThreeDualTypes = computed(() => filteredDualTypes.value.slice(0, 3));
const remainingDualTypes = computed(() => filteredDualTypes.value.slice(3));

const isHiredDisabled = computed(() => {
	return props.modelValue.is_concluded !== 1;
});

const bothQualificationsPresent = computed(() => {
	return internalAdvisorQualification.value !== null &&
		internalAdvisorQualification.value !== '' &&
		externalAdvisorQualification.value !== null &&
		externalAdvisorQualification.value !== '';
});

const filteredMicro = computed(() =>
	!searchMicro.value
		? allMicroCredentials.value.filter(m => !selectedMicroCredentials.value.some(s => s.id === m.id))
		: allMicroCredentials.value.filter(
			m =>
				m.name.toLowerCase().includes(searchMicro.value.toLowerCase()) &&
				!selectedMicroCredentials.value.some(s => s.id === m.id)
		)
);

const filteredCertifications = computed(() =>
	!searchCertification.value
		? allCertifications.value.filter(c => !selectedCertifications.value.some(s => s.id === c.id))
		: allCertifications.value.filter(
			c =>
				c.name.toLowerCase().includes(searchCertification.value.toLowerCase()) &&
				!selectedCertifications.value.some(s => s.id === c.id)
		)
);

const filteredDiplomas = computed(() =>
	!searchDiploma.value
		? allDiplomas.value.filter(d => !selectedDiplomas.value.some(s => s.id === d.id))
		: allDiplomas.value.filter(
			d =>
				d.name.toLowerCase().includes(searchDiploma.value.toLowerCase()) &&
				!selectedDiplomas.value.some(s => s.id === d.id)
		)
);

const fieldHelpTexts = {
	name_report: "Escribe el nombre específico del proyecto o actividad dual que se está registrando (ejemplo: 'Laboratorio web de seguridad y privacidad').",
	id_dual_area: "Clasificación general del proyecto dual. Sirve para agrupar los proyectos según su naturaleza académica, profesional o técnica.",
	dual_type_id: "Selecciona el tipo de modalidad que tendrá la actividad dual: Desarrollo de proyecto, Rotación de puestos, Práctica en área, Residencias Profesionales, Servicio Social, etc.",
	id_organization: "Selecciona la empresa, institución u organismo donde se desarrollará el proyecto dual. Cada organización incluye datos como tipo, sector, tamaño y ubicación.",
	period_start: "Día en que comenzará formalmente la actividad dual.",
	period_end: "Día en que se dará por concluido la actividad. Solo es obligatorio si el proyecto ya ha concluido.",
	status_document: "Situación actual del convenio relacionado al proyecto (firmado o en trámite).",
	economic_support: "Forma en la que la organización brinda apoyo (ejemplo: beca, transporte, alimentación, honorarios).",
	amount: "Cantidad monetaria o equivalente proporcionada como apoyo.",
	max_qualification: "La escala más alta de calificación (ejemplo: 10 o 100).",
	qualification: "Evaluación obtenida en el proyecto de acuerdo con la escala.",
	is_concluded: "Marca si el proyecto ya finalizó.",
	is_hired: "Indica si el estudiante fue contratado después de concluir el proyecto.",
	micro_credentials: "Microcredenciales  obtenidas al finalizar el proyecto; puedes agregar cuantas necesites.",
	certifications: "Certificaciones obtenidas al finalizar el proyecto; puedes agregar cuantas necesites.",
	diplomas: "Diplomados obtenidas al finalizar el proyecto; puedes agregar cuantos necesites.",
	description: "Proporcione una breve descripción de la modalidad seleccionada, indicando sus características o propósito.",
	economic_benefit: "Monto del beneficio económico adicional recibido (en la moneda local). Use 0 si no hubo beneficio económico.",
	time_benefit: "Cantidad de tiempo beneficiado (en horas o días). Use 0 si no hubo beneficio de tiempo.",
	economic_benefit_note: "Detalles del beneficio económico. Obligatorio cuando el monto es 0, opcional cuando hay monto positivo.",
	time_benefit_note: "Detalles del beneficio de tiempo. Obligatorio cuando el tiempo es 0, opcional cuando hay tiempo positivo.",
};

const getValidationClass = (fieldName) => {
  if (!showValidationErrors.value) return '';

  if (errors.value[fieldName]) {
    return 'input-error';
  }

  const requiredFields = [
    'name_report', 'id_organization', 'id_dual_area', 'period_start',
    'status_document', 'economic_support', 'amount', 'is_concluded',
    'is_hired', 'dual_type_id'
  ];

  // Agregar validación para beneficios cuando el proyecto está concluido
  if (props.modelValue.is_concluded === 1) {
    if (fieldName === 'economic_benefit' && economic_benefit.value !== null && economic_benefit.value !== '') {
      return 'input-success';
    }
    if (fieldName === 'time_benefit' && time_benefit.value !== null && time_benefit.value !== '') {
      return 'input-success';
    }
    
    // Validar notas cuando los beneficios son 0
    if (fieldName === 'economic_benefit_note' && economic_benefit.value === 0 && economic_benefit_note.value) {
      return 'input-success';
    }
    if (fieldName === 'time_benefit_note' && time_benefit.value === 0 && time_benefit_note.value) {
      return 'input-success';
    }
  }

  if (fieldName === 'period_end' && props.modelValue.is_concluded === 1 && props.modelValue.period_end) {
    return 'input-success';
  }

  if (requiredFields.includes(fieldName) && props.modelValue[fieldName]) {
    return 'input-success';
  }

  return '';
};

const getValidationSummary = () => {
	const errorCount = Object.keys(errors.value).length;
	if (errorCount === 0) return null;

	const errorFields = Object.keys(errors.value);
	const fieldNames = {
		'name_report': 'Nombre del Proyecto',
		'id_organization': 'Organización',
		'id_dual_area': 'Clasificación General del Proyecto',
		'period_start': 'Fecha de Inicio',
		'period_end': 'Fecha de Fin',
		'status_document': 'Estado del Convenio',
		'economic_support': 'Tipo de Apoyo Económico',
		'amount': 'Monto',
		'is_concluded': 'Proyecto Concluido',
		'is_hired': 'Contratado',
		'dual_type_id': 'Tipo de Modelo Dual',
		'internal_advisor_qualification': 'Calificación Asesor Interno',
		'external_advisor_qualification': 'Calificación Asesor Externo',
		'economic_benefit_note': 'Detalles del Beneficio Económico',
        'time_benefit_note': 'Detalles del Beneficio de Tiempo',
		'economic_benefit': 'Beneficio Económico',
		'time_benefit': 'Beneficio de Tiempo'
	};

	return {
		count: errorCount,
		fields: errorFields.map(field => ({
			name: fieldNames[field] || field,
			message: errors.value[field]
		}))
	};
};

const resetValidation = () => {
	showValidationErrors.value = false;
	hasAttemptedSubmit.value = false;
	errors.value = {};
};

// Watchers
watch(() => props.modelValue.max_qualification, (newScale, oldScale) => {
	if (newScale !== oldScale) {
		internalAdvisorQualification.value = null;
		externalAdvisorQualification.value = null;
		update('internal_advisor_qualification', null);
		update('external_advisor_qualification', null);
		update('qualification', null);
	}
});

watch(internalAdvisorQualification, (newValue) => {
	if (newValue !== null && newValue !== '') {
		validateQualification(newValue, 'internal_advisor_qualification');
	} else {
		delete errors.value.internal_advisor_qualification;
	}
});

watch(externalAdvisorQualification, (newValue) => {
	if (newValue !== null && newValue !== '') {
		validateQualification(newValue, 'external_advisor_qualification');
	} else {
		delete errors.value.external_advisor_qualification;
	}
});

watch(internalAdvisorName, (newName) => {
	update('internal_advisor_name', newName);
});

watch(externalAdvisorName, (newName) => {
	update('external_advisor_name', newName);
});

watch(economic_benefit, (newBenefit) => {
	update('economic_benefit', newBenefit);
});

watch(time_benefit, (newBenefit) => {
	update('time_benefit', newBenefit);
});

watch(internalAdvisorQualification, (newQual) => {
	if (areQualificationsEnabled.value && validateQualification(newQual, 'internal_advisor_qualification')) {
		update('internal_advisor_qualification', newQual);
		updateQualificationAverage();
	} else if (!areQualificationsEnabled.value && newQual !== null && newQual !== '') {
		internalAdvisorQualification.value = null;
		update('internal_advisor_qualification', null);
	}
});

watch(externalAdvisorQualification, (newQual) => {
	if (areQualificationsEnabled.value && validateQualification(newQual, 'external_advisor_qualification')) {
		update('external_advisor_qualification', newQual);
		updateQualificationAverage();
	} else if (!areQualificationsEnabled.value && newQual !== null && newQual !== '') {
		externalAdvisorQualification.value = null;
		update('external_advisor_qualification', null);
	}
});

watch(() => props.modelValue.economic_support, (newSupportId, oldSupportId) => {
	if (newSupportId === 1) {
		isAmountDisabled.value = true;
		update('amount', 0);

		const sinApoyoOption = props.supportTypes?.find(s => s.id === 1);
		if (sinApoyoOption) {
			searchSupport.value = sinApoyoOption.name;
		}
	}
	else if (oldSupportId === 1 && newSupportId !== 1) {
		isAmountDisabled.value = false;
	}
});

watch(() => props.supportTypes, (newTypes) => {
	if (props.modelValue.economic_support === 1) {
		isAmountDisabled.value = true;
	}
});

watch(period_start, (val) => {
	if (val) update('period_start', new Date(val).toISOString().slice(0, 10));
});

watch(period_end, (val) => {
	if (val) {
		update('period_end', new Date(val).toISOString().slice(0, 10));
	} else {
		update('period_end', null);
	}
});

watch(searchDualType, (val) => {
	if (!val) update('dual_type_id', '');
});

watch(() => props.modelValue.max_qualification, (newVal) => {
	maxQualification.value = newVal != null ? newVal.toString() : '';
});

watch(maxQualification, (newVal) => {
	update('max_qualification', newVal ? Number(newVal) : '');
});

watch(() => props.modelValue.is_concluded, (newVal) => {
	if (newVal === 0 && props.modelValue.is_hired === 1) {
		update('is_hired', 0);
	}
});

// Funciones
const validateQualification = (value, fieldName) => {
	if (value === null || value === '' || value === undefined) return true;

	const maxScale = props.modelValue.max_qualification;
	if (!maxScale) {
		errors.value[fieldName] = 'Primero seleccione la escala de calificación';
		return false;
	}

	const numValue = Number(value);
	if (numValue < 0 || numValue > maxScale) {
		errors.value[fieldName] = `La calificación debe estar entre 0 y ${maxScale}`;
		return false;
	}

	delete errors.value[fieldName];
	return true;
};

const updateQualificationAverage = () => {
	const intQ = Number(internalAdvisorQualification.value) || 0;
	const extQ = Number(externalAdvisorQualification.value) || 0;

	if (internalAdvisorQualification.value != null &&
		externalAdvisorQualification.value != null &&
		internalAdvisorQualification.value !== '' &&
		externalAdvisorQualification.value !== '') {
		const avg = ((intQ + extQ) / 2).toFixed(2);
		update('qualification', Number(avg));
	} else {
		update('qualification', null);
	}
};

const initializeMicroCredentials = () => {
	selectedMicroCredentials.value = (props.modelValue.micro_credentials || [])
		.map(id => allMicroCredentials.value.find(m => Number(m.id) === Number(id)))
		.filter(Boolean);
};

const initializeCertifications = () => {
	selectedCertifications.value = (props.modelValue.certifications || [])
		.map(id => allCertifications.value.find(c => Number(c.id) === Number(id)))
		.filter(Boolean);
};

const initializeDiplomas = () => {
	selectedDiplomas.value = (props.modelValue.diplomas || [])
		.map(id => allDiplomas.value.find(d => Number(d.id) === Number(id)))
		.filter(Boolean);
};

const update = (field, value) => {
	if ((field === 'internal_advisor_qualification' || field === 'external_advisor_qualification') &&
		!areQualificationsEnabled.value) {
		return;
	}

	if (field === 'internal_advisor_qualification' || field === 'external_advisor_qualification') {
		if (!validateQualification(value, field)) {
			return;
		}
	}

	emit('update:modelValue', { ...props.modelValue, [field]: value });
	if (errors.value[field]) errors.value[field] = '';

	if (field === 'id_dual_area') {
		const selected = props.areas?.find(a => a.id === value);
		searchArea.value = selected?.name || '';
		showAreaDropdown.value = false;
	}

	if (field === 'id_organization') {
		const selected = props.organizations?.find(o => o.id === value);
		searchOrganization.value = selected?.name || '';
		showOrganizationDropdown.value = false;
	}

	if (field === 'status_document') {
		const selected = props.agreementStatuses?.find(s => s.id === value);
		searchStatus.value = selected?.name || '';
		showStatusDropdown.value = false;
	}

	if (field === 'economic_support') {
		const selected = props.supportTypes?.find(s => s.id === value);
		searchSupport.value = selected?.name || '';
		showSupportDropdown.value = false;

		if (value === 1) {
			isAmountDisabled.value = true;
			emit('update:modelValue', { ...props.modelValue, economic_support: value, amount: 0 });
		} else {
			isAmountDisabled.value = false;
		}
	}

	if (field === 'dual_type_id') {
		const selected = props.dualTypes?.find(d => d.id === value);
		searchDualType.value = selected?.name || '';
		showDualTypeDropdown.value = false;
	}
};

const handleSavedOrganization = async (newOrganization) => {
	try {
		const res = await getOrganizations();
		emit('update:organizations', res.data);

		if (newOrganization) {
			const justCreatedOrg = res.data.find(
				org => org.id === newOrganization.id || org.name === newOrganization.name
			);

			if (justCreatedOrg) {
				await nextTick();

				update('id_organization', justCreatedOrg.id);
				searchOrganization.value = justCreatedOrg.name;

				showOrganizationDropdown.value = true;

				setTimeout(() => {
					showOrganizationDropdown.value = false;
				}, 1500);
			}
		}

		closeModal();

	} catch (error) {
		console.error('Error al recargar organizaciones:', error);
		closeModal();
	}
};
const handleSavedArea = async (newArea) => {
	try {
		console.log('DEBUG - newArea recibido:', newArea);

		const res = await getDualAreas();
		emit('update:dualAreas', res.data);

		let justCreatedArea = null;

		if (newArea && newArea.id) {
			justCreatedArea = res.data.find(area => Number(area.id) === Number(newArea.id));
		}

		if (!justCreatedArea && newArea && newArea.name) {
			const matchingAreas = res.data
				.filter(area => area.name === newArea.name)
				.sort((a, b) => b.id - a.id);

			if (matchingAreas.length > 0) {
				justCreatedArea = matchingAreas[0];
			}
		}

		console.log('DEBUG - Área encontrada:', justCreatedArea);

		if (justCreatedArea) {
			await nextTick();
			update('id_dual_area', justCreatedArea.id);
			searchArea.value = justCreatedArea.name;
			showAreaDropdown.value = true;
			setTimeout(() => { showAreaDropdown.value = false; }, 1500);
		} else {
			console.log('DEBUG - No se encontró el área recién creada');
		}

		closeAreaModal();
	} catch (error) {
		console.error('Error al recargar áreas duales:', error);
		closeAreaModal();
	}
};

const handleSavedMicroCredential = async (newMicroCredential) => {
	try {
		const res = await getMicroCredentials();
		emit('update:microCredentials', res.data);
		allMicroCredentials.value = res.data;

		if (newMicroCredential) {
			const justCreatedMicro = res.data.find(
				micro => micro.id === newMicroCredential.id || micro.name === newMicroCredential.name
			);

			if (justCreatedMicro) {
				await nextTick();

				if (!selectedMicroCredentials.value.some(m => m.id === justCreatedMicro.id)) {
					selectedMicroCredentials.value.push(justCreatedMicro);
					emit('update:modelValue', {
						...props.modelValue,
						micro_credentials: selectedMicroCredentials.value.map(m => Number(m.id))
					});
				}

				showMicroDropdown.value = true;

				setTimeout(() => {
					showMicroDropdown.value = false;
				}, 1500);
			}
		}

		closeMicroModal();

	} catch (error) {
		console.error('Error al recargar microcredenciales:', error);
		closeMicroModal();
	}
};

const handleSavedCertification = async (newCertification) => {
	try {
		const res = await getCertifications();
		emit('update:certifications', res.data);
		allCertifications.value = res.data;

		if (newCertification) {
			const justCreatedCert = res.data.find(
				cert => cert.id === newCertification.id || cert.name === newCertification.name
			);

			if (justCreatedCert) {
				await nextTick();

				if (!selectedCertifications.value.some(c => c.id === justCreatedCert.id)) {
					selectedCertifications.value.push(justCreatedCert);
					emit('update:modelValue', {
						...props.modelValue,
						certifications: selectedCertifications.value.map(c => Number(c.id))
					});
				}

				showCertificationDropdown.value = true;

				setTimeout(() => {
					showCertificationDropdown.value = false;
				}, 1500);
			}
		}

		closeCertificationModal();

	} catch (error) {
		console.error('Error al recargar certificaciones:', error);
		closeCertificationModal();
	}
};

const handleSavedDiploma = async (newDiploma) => {
	try {
		const res = await getDiplomas();
		emit('update:diplomas', res.data);
		allDiplomas.value = res.data;

		if (newDiploma) {
			const justCreatedDiploma = res.data.find(
				diploma => diploma.id === newDiploma.id || diploma.name === newDiploma.name
			);

			if (justCreatedDiploma) {
				await nextTick();

				if (!selectedDiplomas.value.some(d => d.id === justCreatedDiploma.id)) {
					selectedDiplomas.value.push(justCreatedDiploma);
					emit('update:modelValue', {
						...props.modelValue,
						diplomas: selectedDiplomas.value.map(d => Number(d.id))
					});
				}

				showDiplomaDropdown.value = true;

				setTimeout(() => {
					showDiplomaDropdown.value = false;
				}, 1500);
			}
		}

		closeDiplomaModal();

	} catch (error) {
		console.error('Error al recargar diplomados:', error);
		closeDiplomaModal();
	}
};

const handleSavedDualType = async (newDualType) => {
	try {
		const res = await getDualTypes();
		emit('update:dualTypes', res.data);

		if (newDualType) {
			const justCreatedDualType = res.data.find(
				type => type.id === newDualType.id || type.name === newDualType.name
			);

			if (justCreatedDualType) {
				await nextTick();

				update('dual_type_id', justCreatedDualType.id);
				searchDualType.value = justCreatedDualType.name;

				showDualTypeDropdown.value = true;

				setTimeout(() => {
					showDualTypeDropdown.value = false;
				}, 1500);
			}
		}

		closeDualTypeModal();

	} catch (error) {
		console.error('Error al recargar tipos duales:', error);
		closeDualTypeModal();
	}
};

const initializeSearchValues = () => {

	if (props.modelValue.id_dual_area) {
		const area = props.areas?.find(a => a.id === props.modelValue.id_dual_area);
		searchArea.value = area?.name || '';
	}


	if (props.modelValue.id_organization) {
		const org = props.organizations?.find(o => o.id === props.modelValue.id_organization);
		searchOrganization.value = org?.name || '';
	}

	if (props.modelValue.status_document) {
		const status = props.agreementStatuses?.find(s => s.id === props.modelValue.status_document);
		searchStatus.value = status?.name || '';
	}

	if (props.modelValue.economic_support) {
		const support = props.supportTypes?.find(s => s.id === props.modelValue.economic_support);
		searchSupport.value = support?.name || '';

		if (props.modelValue.economic_support === 1) {
			isAmountDisabled.value = true;
			if (props.modelValue.amount !== 0) {
				update('amount', 0);
			}
		} else {
			isAmountDisabled.value = false;
		}
	}

	if (props.modelValue.dual_type_id) {
		const dualType = props.dualTypes?.find(d => d.id === props.modelValue.dual_type_id);
		searchDualType.value = dualType?.name || '';
	}

	if (props.modelValue.max_qualification) {
		maxQualification.value = props.modelValue.max_qualification.toString();
	}

	initializeMicroCredentials();
	initializeCertifications();
	initializeDiplomas();
};

const addMicroCredential = (micro) => {
	if (!selectedMicroCredentials.value.some(m => m.id === micro.id)) {
		selectedMicroCredentials.value.push(micro);
	}
	emit('update:modelValue', {
		...props.modelValue,
		micro_credentials: selectedMicroCredentials.value.map(m => Number(m.id))
	});
	searchMicro.value = '';
	showMicroDropdown.value = false;
};

const addCertification = (certification) => {
	if (!selectedCertifications.value.some(c => c.id === certification.id)) {
		selectedCertifications.value.push(certification);
	}
	emit('update:modelValue', {
		...props.modelValue,
		certifications: selectedCertifications.value.map(c => Number(c.id))
	});
	searchCertification.value = '';
	showCertificationDropdown.value = false;
};

const addDiploma = (diploma) => {
	if (!selectedDiplomas.value.some(d => d.id === diploma.id)) {
		selectedDiplomas.value.push(diploma);
	}
	emit('update:modelValue', {
		...props.modelValue,
		diplomas: selectedDiplomas.value.map(d => Number(d.id))
	});
	searchDiploma.value = '';
	showDiplomaDropdown.value = false;
};

const removeMicroCredential = (micro) => {
	selectedMicroCredentials.value = selectedMicroCredentials.value.filter(m => m.id !== micro.id);
	emit('update:modelValue', {
		...props.modelValue,
		micro_credentials: selectedMicroCredentials.value.map(m => Number(m.id))
	});
};

const removeCertification = (certification) => {
	selectedCertifications.value = selectedCertifications.value.filter(c => c.id !== certification.id);
	emit('update:modelValue', {
		...props.modelValue,
		certifications: selectedCertifications.value.map(c => Number(c.id))
	});
};

const removeDiploma = (diploma) => {
	selectedDiplomas.value = selectedDiplomas.value.filter(d => d.id !== diploma.id);
	emit('update:modelValue', {
		...props.modelValue,
		diplomas: selectedDiplomas.value.map(d => Number(d.id))
	});
};

const handleClickOutside = (event) => {
	if (areaDropdownRef.value && !areaDropdownRef.value.contains(event.target)) showAreaDropdown.value = false;
	if (organizationDropdownRef.value && !organizationDropdownRef.value.contains(event.target)) showOrganizationDropdown.value = false;
	if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target)) showStatusDropdown.value = false;
	if (supportDropdownRef.value && !supportDropdownRef.value.contains(event.target)) showSupportDropdown.value = false;
	if (dualTypeDropdownRef.value && !dualTypeDropdownRef.value.contains(event.target)) showDualTypeDropdown.value = false;
	if (microDropdownRef.value && !microDropdownRef.value.contains(event.target)) showMicroDropdown.value = false;
	if (certificationDropdownRef.value && !certificationDropdownRef.value.contains(event.target)) showCertificationDropdown.value = false;
	if (diplomaDropdownRef.value && !diplomaDropdownRef.value.contains(event.target)) showDiplomaDropdown.value = false;
};

const validate = () => {
  console.log('=== INICIANDO VALIDACIÓN UNIDAD DUAL ===');
  hasAttemptedSubmit.value = true;
  showValidationErrors.value = true;

  const requiredFields = [
    'name_report', 'id_organization', 'id_dual_area', 'period_start',
    'status_document', 'economic_support', 'amount', 'is_concluded',
    'is_hired', 'dual_type_id'
  ];

  let isValid = true;
  errors.value = {};

  for (const field of requiredFields) {
    const value = props.modelValue[field];
    console.log(`Campo ${field}:`, value, typeof value);

    if (value === null || value === undefined || value === '') {
      errors.value[field] = 'Este campo es obligatorio';
      isValid = false;
    }
  }

  if (props.modelValue.is_concluded === 1) {
    if (!props.modelValue.period_end) {
      errors.value.period_end = 'La fecha de fin es obligatoria cuando el proyecto está concluido';
      isValid = false;
      console.log('Fecha de fin requerida para proyecto concluido');
    }
  }

  if (props.modelValue.amount < 0) {
    errors.value.amount = 'El monto debe ser mayor o igual a 0';
    isValid = false;
    console.log('Monto negativo');
  }

  const start = props.modelValue.period_start ? new Date(props.modelValue.period_start) : null;
  const end = props.modelValue.period_end ? new Date(props.modelValue.period_end) : null;

  if (start && end && start > end) {
    errors.value.period_end = 'La fecha de fin debe ser posterior a la fecha de inicio';
    isValid = false;
    console.log('Fechas inválidas');
  }

  if (internalAdvisorQualification.value !== null && internalAdvisorQualification.value !== '') {
    if (!validateQualification(internalAdvisorQualification.value, 'internal_advisor_qualification')) {
      isValid = false;
      console.log('Calificación interna inválida');
    }
  }

  if (externalAdvisorQualification.value !== null && externalAdvisorQualification.value !== '') {
    if (!validateQualification(externalAdvisorQualification.value, 'external_advisor_qualification')) {
      isValid = false;
      console.log('Calificación externa inválida');
    }
  }

  // Validación para los nuevos campos de beneficios (SOLO cuando el proyecto está concluido)
  if (props.modelValue.is_concluded === 1) {
    // Validar que los beneficios sean números
    if (economic_benefit.value === null || economic_benefit.value === '') {
      errors.value.economic_benefit = 'El beneficio económico es obligatorio';
      isValid = false;
      console.log('Beneficio económico requerido');
    } else if (economic_benefit.value < 0) {
      errors.value.economic_benefit = 'El beneficio económico no puede ser negativo';
      isValid = false;
      console.log('Beneficio económico negativo');
    }
    
    if (time_benefit.value === null || time_benefit.value === '') {
      errors.value.time_benefit = 'El beneficio de tiempo es obligatorio';
      isValid = false;
      console.log('Beneficio de tiempo requerido');
    } else if (time_benefit.value < 0) {
      errors.value.time_benefit = 'El beneficio de tiempo no puede ser negativo';
      isValid = false;
      console.log('Beneficio de tiempo negativo');
    }

    // Validar las notas (obligatorias solo cuando los beneficios son 0)
    if (economic_benefit.value === 0 && !economic_benefit_note.value) {
      errors.value.economic_benefit_note = 'Debe explicar por qué no hubo beneficio económico cuando el monto es 0';
      isValid = false;
      console.log('Nota de beneficio económico requerida para monto 0');
    }
    
    if (time_benefit.value === 0 && !time_benefit_note.value) {
      errors.value.time_benefit_note = 'Debe explicar por qué no hubo beneficio de tiempo cuando el tiempo es 0';
      isValid = false;
      console.log('Nota de beneficio de tiempo requerida para tiempo 0');
    }
  }

  return isValid;
};

defineExpose({ validate, resetValidation, getValidationSummary });

onMounted(() => {
	console.log('modelValue:', JSON.parse(JSON.stringify(props.modelValue)));
	document.addEventListener('click', handleClickOutside);
	initializeSearchValues();
	if (props.modelValue.economic_support === 1) {
		isAmountDisabled.value = true;
		if (props.modelValue.amount !== 0) {
			update('amount', 0);
		}
	}
});
</script>

<template>
	<div class="space-y-8">
		<div v-if="showValidationErrors && getValidationSummary()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
				<div class="bg-red-500 text-white p-4">
					<h3 class="text-lg font-semibold flex items-center gap-2">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
						Campos Requeridos
					</h3>
				</div>

				<div class="p-6">
					<p class="text-gray-700 mb-4">
						Por favor, completa los siguientes campos obligatorios:
					</p>

					<div class="space-y-3 max-h-60 overflow-y-auto">
						<div v-for="field in getValidationSummary().fields" :key="field.name" class="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
							<svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
							</svg>
							<div>
								<p class="font-medium text-red-800">{{ field.name }}</p>
								<p class="text-sm text-red-600">{{ field.message }}</p>
							</div>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
						<button
							class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
							@click="showValidationErrors = false">
							Cerrar
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-if="hasAttemptedSubmit" class="bg-white border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div v-if="Object.keys(errors).length === 0" class="flex items-center gap-2 text-green-600">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
						<span class="font-medium">Todos los campos requeridos están completos</span>
					</div>
					<div v-else class="flex items-center gap-2 text-red-600">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
						<span class="font-medium">{{ Object.keys(errors).length }} campo(s) requieren atención</span>
					</div>
				</div>
				<button
					v-if="Object.keys(errors).length > 0"
					class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
					@click="showValidationErrors = true">
					Ver detalles
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
					</svg>
				</button>
			</div>
		</div>

		<div class="space-y-8">
			<div class="text-center">
				<h2 class="text-2xl font-bold text-brand-900 mb-2">Proyecto Dual</h2>
				<p class="text-gray-600 text-sm">Complete la información del proyecto dual</p>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">1</span>
					Proyecto Dual
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="label flex items-center gap-1">
							Nombre del Proyecto Dual
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.name_report"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<input
							type="text"
							class="input"
							:class="getValidationClass('name_report')"
							:value="modelValue.name_report"
							@input="update('name_report', $event.target.value)" />
						<p v-if="errors.name_report" class="error-msg">{{ errors.name_report }}</p>
					</div>

					<div ref="areaDropdownRef">
						<label class="label flex items-center gap-1">
							Clasificación General del Proyecto Dual
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.id_dual_area"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<div class="flex gap-2">
							<div class="flex-1 relative">
								<input
									v-model="searchArea"
									class="input"
									:class="getValidationClass('id_dual_area')"
									placeholder="Buscar Clasificación..."
									@focus="showAreaDropdown = true"
									@input="showAreaDropdown = true" />
								<ul
									v-if="showAreaDropdown && filteredAreas.length"
									class="dropdown">
									<li
										v-for="area in filteredAreas"
										:key="area.id"
										class="dropdown-item"
										@click="update('id_dual_area', area.id)">
										{{ area.name }}
									</li>
								</ul>
							</div>
							<btn-create
								:table="'Clasificación General del Proyecto Dual'"
								@open="({ mode, pk, table}) => openAreaModal(mode, pk, table)" />
						</div>
						<p v-if="errors.id_dual_area" class="error-msg">{{ errors.id_dual_area }}</p>
					</div>

					<div ref="dualTypeDropdownRef" class="pt-3">
						<label class="label flex items-center gap-1">
							Tipo de Educación Dual
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.dual_type_id"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<div class="relative">
							<input
								v-model="searchDualType"
								class="input"
								:class="getValidationClass('dual_type_id')"
								placeholder="Buscar tipo..."
								@focus="showDualTypeDropdown = true"
								@input="showDualTypeDropdown = true" />

							<ul
								v-if="showDualTypeDropdown"
								class="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 divide-y divide-gray-200">
								<li
									v-for="dual in firstThreeDualTypes"
									:key="dual.id"
									class="px-4 py-2 hover:bg-brand-50 cursor-pointer transition-colors"
									@click="update('dual_type_id', dual.id)">
									{{ dual.name }}
								</li>

								<li class="relative group">
									<div
										class="px-4 py-2 hover:bg-brand-50 cursor-pointer flex justify-between items-center transition-colors">
										<span>Otras Alternativas Duales</span>
										<span class="text-gray-400">▸</span>
									</div>
									<ul
										class="absolute left-full top-0 ml-1 w-56 bg-white border border-gray-300 rounded-lg shadow-lg hidden group-hover:block z-20 divide-y divide-gray-200">
										<li
											v-for="dual in remainingDualTypes"
											:key="dual.id"
											class="px-4 py-2 hover:bg-brand-50 cursor-pointer transition-colors"
											@click="update('dual_type_id', dual.id)">
											{{ dual.name }}
										</li>
									</ul>
								</li>


								<li
									class="px-4 py-2 hover:bg-brand-50 cursor-pointer transition-colors border-t border-gray-200 font-medium text-brand-600"
									@click="openDualTypeModal('create', null, 'Tipo de actividad dual')">
									+ Crear Nueva Alternativa
								</li>
							</ul>
						</div>

						<div v-if="modelValue.dual_type_id" class="col-span-2">
							<label class="label flex items-center gap-1">
								Descripción de tipo de educación dual
								<button
									v-tooltip="fieldHelpTexts.description"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
									?
								</button>
							</label>
							<textarea
								class="input min-h-[100px]"
								placeholder="Agregue una descripción del modelo dual seleccionado..."
								:value="modelValue.description || ''"
								@input="update('description', $event.target.value)" />
							<p v-if="errors.description" class="error-msg">{{ errors.description }}</p>
						</div>

						<p v-if="errors.dual_type_id" class="error-msg">{{ errors.dual_type_id }}</p>
					</div>
				</div>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">2</span>
					Organización
				</h3>
				<div ref="organizationDropdownRef" class="flex items-end gap-2">
					<div class="flex-1 relative">
						<label class="label flex items-center gap-1">
							Datos de la organización
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.id_organization"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<input
							v-model="searchOrganization" class="input" :class="getValidationClass('id_organization')"
							placeholder="Buscar organización..."
							@focus="showOrganizationDropdown = true" @input="showOrganizationDropdown = true" />
						<ul
							v-if="showOrganizationDropdown && filteredOrganizations.length"
							class="dropdown">
							<li
								v-for="org in filteredOrganizations" :key="org.id"
								class="dropdown-item"
								@click="update('id_organization', org.id)">
								{{ org.name }}
							</li>
						</ul>
						<p v-if="errors.id_organization" class="error-msg">{{ errors.id_organization }}</p>
					</div>
					<btn-create
						:table="'organizacion'" class="h-12 px-4 flex-shrink-0"
						tooltip="Crear nueva organización"
						@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
				</div>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">3</span>
					Periodo
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="label flex items-center gap-1">
							Fecha de Inicio
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.period_start"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<Datepicker
							v-model="period_start" placeholder="Seleccione la fecha" :enable-time-picker="false"
							class="input" :class="getValidationClass('period_start')" />
						<p v-if="errors.period_start" class="error-msg">{{ errors.period_start }}</p>
					</div>
					<div>
						<label class="label flex items-center gap-1">
							Fecha de Fin
							<span v-if="modelValue.is_concluded === 1" class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.period_end"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<Datepicker
							v-model="period_end"
							placeholder="Seleccione la fecha"
							:enable-time-picker="false"
							class="input"
							:class="getValidationClass('period_end')" />
						<p v-if="errors.period_end" class="error-msg">{{ errors.period_end }}</p>
						<p v-if="modelValue.is_concluded !== 1" class="text-xs text-gray-500 mt-1">
							Opcional para proyectos en curso
						</p>
					</div>
				</div>

				<div class="mt-4">
					<label class="label flex items-center gap-1">
						Observaciones del Período

					</label>
					<textarea
						class="input min-h-[80px]"
						placeholder="Observaciones adicionales sobre el período (opcional)"
						:value="modelValue.period_observation || ''"
						@input="update('period_observation', $event.target.value)" />
					<p class="text-xs text-gray-500 mt-1">Campo opcional para notas sobre el período del proyecto</p>
				</div>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">4</span>
					Convenio y Apoyo
				</h3>

				<div ref="statusDropdownRef">
					<label class="label flex items-center gap-1">
						Estado del Convenio Dual
						<span class="text-red-500">*</span>
						<button
							v-tooltip="fieldHelpTexts.status_document"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
							?
						</button>
					</label>
					<div class="relative">
						<input
							v-model="searchStatus" class="input" :class="getValidationClass('status_document')"
							placeholder="Buscar estado..."
							@focus="showStatusDropdown = true" @input="showStatusDropdown = true" />
						<ul v-if="showStatusDropdown && filteredStatuses.length" class="dropdown">
							<li
								v-for="estado in filteredStatuses" :key="estado.id"
								class="dropdown-item"
								@click="update('status_document', estado.id)">
								{{ estado.name }}
							</li>
						</ul>
					</div>
					<p v-if="errors.status_document" class="error-msg">{{ errors.status_document }}</p>
				</div>

				<div ref="supportDropdownRef" class="flex gap-4 items-end">
					<div class="flex-1">
						<label class="label flex items-center gap-1">
							Tipo de Apoyo Económico
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.economic_support"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<div class="relative">
							<input
								v-model="searchSupport"
								class="input"
								:class="getValidationClass('economic_support')"
								placeholder="Buscar apoyo..."
								@focus="showSupportDropdown = true"
								@input="showSupportDropdown = true" />
							<ul v-if="showSupportDropdown && filteredSupports.length" class="dropdown">
								<li
									v-for="apoyo in filteredSupports"
									:key="apoyo.id"
									class="dropdown-item"
									@click="update('economic_support', apoyo.id)">
									{{ apoyo.name }}
								</li>
							</ul>
						</div>
						<p v-if="errors.economic_support" class="error-msg">{{ errors.economic_support }}</p>
					</div>

					<div class="w-40 flex-shrink-0">
						<label class="label flex items-center gap-1">
							Monto
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.amount"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<input
							ref="amountField"
							type="number"
							min="0"
							step="0.01"
							class="input"
							:class="[getValidationClass('amount'), { 'bg-gray-100 cursor-not-allowed': isAmountDisabled }]"
							:disabled="isAmountDisabled"
							:value="modelValue.amount"
							@input="update('amount', parseFloat($event.target.value))" />
						<p v-if="errors.amount" class="error-msg">{{ errors.amount }}</p>
					</div>
				</div>
			</div>

			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-6 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">5</span>
					Estado del Proyecto Dual
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="label flex items-center gap-1">
							Proyecto Dual Concluido
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.is_concluded" type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">?</button>
						</label>

						<select
							class="input"
							:class="getValidationClass('is_concluded')"
							:value="modelValue.is_concluded"
							@change="update('is_concluded', parseInt($event.target.value))">
							<option :value="0">No</option>
							<option :value="1">Sí</option>
						</select>
						<p v-if="errors.is_concluded" class="error-msg">{{ errors.is_concluded }}</p>
					</div>

					<div>
						<label class="label flex items-center gap-1">
							Contratado
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.is_hired" type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">?</button>
						</label>

						<div class="relative">
							<select
								class="input w-full"
								:class="[getValidationClass('is_hired'), {
									'opacity-50 cursor-not-allowed bg-gray-100': isHiredDisabled,
									'cursor-pointer': !isHiredDisabled
								}]"
								:disabled="isHiredDisabled"
								:value="modelValue.is_hired"
								@change="update('is_hired', parseInt($event.target.value))">
								<option :value="0">No</option>
								<option :value="1">Sí</option>
							</select>

							<div
								v-if="isHiredDisabled"
								v-tooltip="'Primero debe marcar Sí en Proyecto Concluido'"
								class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 rounded-lg cursor-not-allowed">
								<span class="text-gray-500 text-sm font-medium">No disponible</span>
							</div>
						</div>
						<p v-if="errors.is_hired" class="error-msg">{{ errors.is_hired }}</p>

						<p v-if="isHiredDisabled" class="text-xs text-gray-500 mt-1 flex items-center">
							<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd" />
							</svg>
							Disponible cuando el proyecto esté concluido
						</p>
					</div>
				</div>

				<div v-if="modelValue.is_hired === 1" class="mt-4">
					<label class="label flex items-center gap-1">
						Observaciones de Contratación
						<button
							v-tooltip="fieldHelpTexts.hired_observation" type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">?</button>
					</label>

					<textarea
						class="input min-h-[80px]"
						placeholder="Detalles sobre la contratación (opcional)"
						:value="modelValue.hired_observation || ''"
						@input="update('hired_observation', $event.target.value)" />

					<p class="text-xs text-gray-500 mt-1">Campo opcional para notas sobre la contratación</p>
				</div>

				<div class="mt-8">
					<label class="label flex items-center gap-1">
						Escala de evaluación
						<button
							v-tooltip="fieldHelpTexts.max_qualification" type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">?</button>
					</label>

					<select
						v-model="modelValue.max_qualification"
						class="input w-full md:w-64"
						:class="{
							'opacity-50 cursor-not-allowed bg-gray-100': !areQualificationsEnabled,
							'cursor-pointer': areQualificationsEnabled
						}"
						:disabled="!areQualificationsEnabled"
						@change="update('max_qualification', Number($event.target.value))">
						<option value="">Seleccione...</option>
						<option value="10">10</option>
						<option value="100">100</option>
					</select>

					<p v-if="errors.max_qualification" class="error-msg">{{ errors.max_qualification }}</p>

					<p v-if="!areQualificationsEnabled" class="text-xs text-gray-500 mt-1 flex items-center">
						<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clip-rule="evenodd" />
						</svg>
						Disponible cuando el proyecto esté concluido
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
					<div>
						<label class="label flex items-center gap-1">Asesor Interno</label>
						<input
							v-model="internalAdvisorName"
							type="text"
							class="input"
							placeholder="Nombre del asesor interno" />

						<div v-if="internalAdvisorName && areQualificationsEnabled" class="mt-3">
							<label class="label flex items-center gap-1">Calificación Asesor Interno</label>
							<input
								v-model.number="internalAdvisorQualification"
								type="number"
								min="0"
								:max="modelValue.max_qualification || 100"
								class="input"
								:class="{ 'border-red-500': errors.internal_advisor_qualification }"
								:disabled="!modelValue.max_qualification"
								placeholder="0"
								@blur="update('internal_advisor_qualification', internalAdvisorQualification)" />
							<p v-if="errors.internal_advisor_qualification" class="error-msg">{{ errors.internal_advisor_qualification }}</p>
							<p v-else class="text-xs text-gray-500 mt-1">
								Máximo permitido: {{ modelValue.max_qualification || 'Seleccione escala primero' }}
							</p>
						</div>

						<p v-if="internalAdvisorName && !areQualificationsEnabled" class="text-xs text-brand-200 mt-1 flex items-center">
							<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd" />
							</svg>
							La calificación estará disponible cuando el proyecto esté concluido
						</p>
					</div>

					<div>
						<label class="label flex items-center gap-1">Asesor Externo</label>
						<input
							v-model="externalAdvisorName"
							type="text"
							class="input"
							placeholder="Nombre del asesor externo" />

						<div v-if="externalAdvisorName && areQualificationsEnabled" class="mt-3">
							<label class="label flex items-center gap-1">Calificación Asesor Externo</label>
							<input
								v-model.number="externalAdvisorQualification"
								type="number"
								min="0"
								:max="modelValue.max_qualification || 100"
								class="input"
								:class="{ 'border-red-500': errors.external_advisor_qualification }"
								:disabled="!modelValue.max_qualification"
								placeholder="0"
								@blur="update('external_advisor_qualification', externalAdvisorQualification)" />
							<p v-if="errors.external_advisor_qualification" class="error-msg">{{ errors.external_advisor_qualification }}</p>
							<p v-else class="text-xs text-gray-500 mt-1">
								Máximo permitido: {{ modelValue.max_qualification || 'Seleccione escala primero' }}
							</p>
						</div>

						<p v-if="externalAdvisorName && !areQualificationsEnabled" class="text-xs text-brand-200 mt-1 flex items-center">
							<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd" />
							</svg>
							La calificación estará disponible cuando el proyecto esté concluido
						</p>
					</div>

					<div v-if="bothQualificationsPresent && areQualificationsEnabled" class="md:col-span-2 mt-4">
						<label class="label flex items-center gap-1">Calificación Final</label>
						<input
							type="number"
							class="input bg-gray-100 cursor-not-allowed"
							:value="averageQualification"
							disabled />
					</div>
				</div>
			</div>
							<!-- vamos a agregar los cambpos de economic_benefit y time_benefit los
				  cuales se avilitaran si esta concuido el proyecto si no que
				  salga el mismo mensaje de Los beneficios economicos y los tiempos estaran disponibles cuando el proyecto este concluido
				  y cuando estos esten disponibles se habiliten los campos economic_benefit_note,time_benefit_note seran obligatorios si
				  economic_benefit  time_benefit estan en cero si no opcionales -->
<div v-if="showCredentialsSection" class="bg-gray-50 rounded-xl p-6 border border-gray-200">
  <h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
    <span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">6</span>
    Beneficios del Proyecto
  </h3>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Beneficio Económico -->
    <div>
      <label class="label flex items-center gap-1">
        Beneficio Económico (Monto)
        <span class="text-red-500">*</span>
        <button
          v-tooltip="'Ingrese el monto del beneficio económico adicional recibido. Use 0 si no hubo beneficio económico.'"
          type="button"
          class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
          ?
        </button>
      </label>
      
      <div class="space-y-3">
        <input
          v-model.number="economic_benefit"
          type="number"
          min="0"
          step="0.01"
          class="input w-full"
          :class="getValidationClass('economic_benefit')"
          :disabled="!areQualificationsEnabled"
          placeholder="0.00"
          @blur="update('economic_benefit', economic_benefit)" />
        
        <!-- Detalles del Beneficio Económico - SIEMPRE VISIBLE -->
        <div>
          <label class="label flex items-center gap-1">
            Detalles del Beneficio Económico
            <span v-if="economic_benefit === 0" class="text-red-500">*</span>
            <button
              v-tooltip="economic_benefit === 0 ? 
                'Explique por qué no hubo beneficio económico (obligatorio cuando el monto es 0)' : 
                'Describa el beneficio económico recibido (opcional cuando hay monto positivo)'"
              type="button"
              class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
              ?
            </button>
          </label>
          <textarea
            v-model="economic_benefit_note"
            class="input min-h-[80px]"
            :class="{ 'border-red-500': economic_benefit === 0 && !economic_benefit_note }"
            :placeholder="economic_benefit === 0 ? 
              'Explique por qué no hubo beneficio económico... (obligatorio)' : 
              'Describa el beneficio económico recibido... (opcional)'"
            :required="economic_benefit === 0"
            @input="update('economic_benefit_note', $event.target.value)" />
          
          <p v-if="economic_benefit === 0 && !economic_benefit_note" class="text-red-500 text-sm mt-1">
            Este campo es obligatorio cuando el beneficio económico es 0
          </p>
          <p v-else class="text-gray-500 text-sm mt-1">
            {{ economic_benefit > 0 ? 'Campo opcional para detalles adicionales' : 'Campo obligatorio para explicar por qué no hubo beneficio' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Beneficio de Tiempo -->
    <div>
      <label class="label flex items-center gap-1">
        Beneficio de Tiempo (Horas/Días)
        <span class="text-red-500">*</span>
        <button
          v-tooltip="'Ingrese la cantidad de tiempo beneficiado (en horas o días). Use 0 si no hubo beneficio de tiempo.'"
          type="button"
          class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
          ?
        </button>
      </label>
      
      <div class="space-y-3">
        <input
          v-model.number="time_benefit"
          type="number"
          min="0"
          step="0.5"
          class="input w-full"
          :class="getValidationClass('time_benefit')"
          :disabled="!areQualificationsEnabled"
          placeholder="0"
          @blur="update('time_benefit', time_benefit)" />
        
        <!-- Detalles del Beneficio de Tiempo - SIEMPRE VISIBLE -->
        <div>
          <label class="label flex items-center gap-1">
            Detalles del Beneficio de Tiempo
            <span v-if="time_benefit === 0" class="text-red-500">*</span>
            <button
              v-tooltip="time_benefit === 0 ? 
                'Explique por qué no hubo beneficio de tiempo (obligatorio cuando el tiempo es 0)' : 
                'Describa el beneficio de tiempo recibido (opcional cuando hay tiempo positivo)'"
              type="button"
              class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
              ?
            </button>
          </label>
          <textarea
            v-model="time_benefit_note"
            class="input min-h-[80px]"
            :class="{ 'border-red-500': time_benefit === 0 && !time_benefit_note }"
            :placeholder="time_benefit === 0 ? 
              'Explique por qué no hubo beneficio de tiempo... (obligatorio)' : 
              'Describa el beneficio de tiempo recibido... (opcional)'"
            :required="time_benefit === 0"
            @input="update('time_benefit_note', $event.target.value)" />
          
          <p v-if="time_benefit === 0 && !time_benefit_note" class="text-red-500 text-sm mt-1">
            Este campo es obligatorio cuando el beneficio de tiempo es 0
          </p>
          <p v-else class="text-gray-500 text-sm mt-1">
            {{ time_benefit > 0 ? 'Campo opcional para detalles adicionales' : 'Campo obligatorio para explicar por qué no hubo beneficio' }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mensaje cuando el proyecto no está concluido -->
  <div v-if="!areQualificationsEnabled" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div class="flex items-center gap-2 text-yellow-800">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd" />
      </svg>
      <span class="font-medium">Los beneficios económicos y de tiempo estarán disponibles cuando el proyecto esté concluido</span>
    </div>
  </div>
</div>
			<div v-if="showCredentialsSection" class="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">7</span>
					Microcredenciales
				</h3>

				<div ref="microDropdownRef" class="relative">
					<label class="label flex items-center gap-1">
						Microcredenciales
						<button
							v-tooltip="fieldHelpTexts.micro_credentials"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
							?
						</button>
					</label>
					<div class="flex items-center gap-2">
						<input
							v-model="searchMicro"
							class="input flex-1"
							placeholder="Buscar microcredencial"
							@focus="showMicroDropdown = true"
							@input="showMicroDropdown = true" />

						<btn-create
							:table="'Certificado'"
							@open="({ mode, pk, table}) => openMicroModal(mode, pk, table)" />
					</div>

					<ul v-if="showMicroDropdown && filteredMicro.length" class="absolute top-full left-0 w-full mt-1 dropdown z-10">
						<li
							v-for="micro in filteredMicro" :key="micro.id"
							class="dropdown-item"
							@click="addMicroCredential(micro)">
							{{ micro.name }}-{{ micro.organization }}
						</li>
					</ul>
				</div>

				<div class="flex flex-wrap gap-2 mt-2">
					<span v-for="micro in selectedMicroCredentials" :key="micro.id" class="bg-brand-100 text-brand-800 px-3 py-1 rounded-full flex items-center gap-2">
						{{ micro.name }}
						<button type="button" class="text-red-500 hover:text-red-700 font-bold" @click="removeMicroCredential(micro)">×</button>
					</span>
				</div>
			</div>

			<div v-if="showCredentialsSection" class="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">8</span>
					Certificaciones
				</h3>

				<div ref="certificationDropdownRef" class="relative">
					<label class="label flex items-center gap-1">
						Certificaciones
						<button
							v-tooltip="fieldHelpTexts.certifications"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
							?
						</button>
					</label>
					<div class="flex items-center gap-2">
						<input
							v-model="searchCertification"
							class="input flex-1"
							placeholder="Buscar certificado..."
							@focus="showCertificationDropdown = true"
							@input="showCertificationDropdown = true" />

						<btn-create
							:table="'Certificado'"
							@open="({ mode, pk, table}) => openCertificationModal(mode, pk, table)" />
					</div>

					<ul v-if="showCertificationDropdown && filteredCertifications.length" class="absolute top-full left-0 w-full mt-1 dropdown z-10">
						<li
							v-for="certification in filteredCertifications" :key="certification.id"
							class="dropdown-item"
							@click="addCertification(certification)">
							{{ certification.name }}-{{ certification.organization }}
						</li>
					</ul>
				</div>

				<div class="flex flex-wrap gap-2 mt-2">
					<span v-for="certification in selectedCertifications" :key="certification.id" class="bg-brand-100 text-brand-800 px-3 py-1 rounded-full flex items-center gap-2">
						{{ certification.name }}
						<button type="button" class="text-red-500 hover:text-red-700 font-bold" @click="removeCertification(certification)">×</button>
					</span>
				</div>
			</div>

			<div v-if="showCredentialsSection" class="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">9</span>
					Diplomados
				</h3>

				<div ref="diplomaDropdownRef" class="relative">
					<label class="label flex items-center gap-1">
						Diplomados
						<button
							v-tooltip="fieldHelpTexts.diplomas"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
							?
						</button>
					</label>
					<div class="flex items-center gap-2">
						<input
							v-model="searchDiploma"
							class="input flex-1"
							placeholder="Buscar diploma..."
							@focus="showDiplomaDropdown = true"
							@input="showDiplomaDropdown = true" />

						<btn-create
							:table="'Diploma'"
							@open="({ mode, pk, table}) => openDiplomaModal(mode, pk, table)" />
					</div>

					<ul v-if="showDiplomaDropdown && filteredDiplomas.length" class="absolute top-full left-0 w-full mt-1 dropdown z-10">
						<li
							v-for="diploma in filteredDiplomas" :key="diploma.id"
							class="dropdown-item"
							@click="addDiploma(diploma)">
							{{ diploma.name }}-{{ diploma.organization }}
						</li>
					</ul>
				</div>

				<div class="flex flex-wrap gap-2 mt-2">
					<span v-for="diploma in selectedDiplomas" :key="diploma.id" class="bg-brand-100 text-brand-800 px-3 py-1 rounded-full flex items-center gap-2">
						{{ diploma.name }}
						<button type="button" class="text-red-500 hover:text-red-700 font-bold" @click="removeDiploma(diploma)">×</button>
					</span>
				</div>
			</div>

			<!-- Modals -->
			<mdl-organization
				:show="showModal" :data="modalData"
				@close="closeModal" @saved="handleSavedOrganization" />

			<mdlMicroCredential
				:show="showMicroModal" :data="microModalData"
				@close="closeMicroModal" @saved="handleSavedMicroCredential" />
			<mdlCertification
				:show="showCertificationModal" :data="certificationModalData"
				@close="closeCertificationModal" @saved="handleSavedCertification" />
			<mdlDiploma
				:show="showDiplomaModal" :data="diplomaModalData"
				@close="closeDiplomaModal" @saved="handleSavedDiploma" />

			<mdlDualType
				:show="showDualTypeModal"
				:data="dualTypeModalData"
				@close="closeDualTypeModal"
				@saved="handleSavedDualType" />
			<mdlDualArea
				:show="showAreaModal"
				:data="areaModalData"
				@close="closeAreaModal"
				@saved="handleSavedArea" />
		</div>
	</div>
</template>

<style scoped>
.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors;
}
.input-error {
	@apply border-red-500 bg-red-50 focus:ring-red-500 focus:border-transparent;
}
.input-success {
	@apply border-green-500 bg-green-50 focus:ring-green-500 focus:border-transparent;
}
.dropdown {
	@apply absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg;
}
.dropdown-item {
	@apply px-4 py-3 hover:bg-brand-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0;
}
.error-msg {
	@apply text-red-500 text-sm mt-2 flex items-center gap-1;
}
.help-icon {
	@apply w-4 h-4 flex items-center justify-center rounded-full border border-current text-xs font-bold;
}

.text-red-500 {
	@apply text-sm;
}

.text-blue-500 {
	@apply text-sm;
}

.fixed {
	animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: scale(0.95);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}
</style>