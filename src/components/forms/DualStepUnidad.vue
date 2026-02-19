<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted, onUnmounted, nextTick } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'floating-vue/dist/style.css';
import btnCreate from '../../components/buttons/btnCreate.vue';
import mdlOrganization from '../modals/modals-forms/mdlOrganization.vue';
import mdlCertification from '../modals/modals-forms/mdlCertification.vue';
import mdlDiploma from '../modals/modals-forms/mdlDiploma.vue';
import mdlMicroCredential from '../modals/modals-forms/mdlMicroCredential.vue';
import mdlDualType from '../../components/modals/modals-forms/mdlDualType.vue';
import mdlDualArea from '../../components/modals/modals-forms/mdlDualArea.vue';
import { useModal } from '../../composables/UseModal';
import { getOrganizations } from '../../services/organizations/organizations.js';
import { getMicroCredentials } from '../../services/dual_projects/micro-credentials';
import { getCertifications } from '../../services/dual_projects/certifications.js';
import { getDiplomas } from '../../services/dual_projects/diplomas';
import { getDualTypes } from '../../services/dual_projects/dual-types';
import { getDualAreas } from '../../services/dual_projects/dual-areas';
import { getBenefitType } from '../../services/dual_projects/BenefitType.js';
import { getEconomicSupports } from '../../services/dual_projects/economic-supports';
import mdlBenefitType from '../../components/modals/modals-forms/mdlBenefitType.vue';

const emit = defineEmits([
	'update:modelValue',
	'update:organizations',
	'update:microCredentials',
	'update:dualTypes',
	'update:certifications',
	'update:diplomas',
	'update:dualAreas',
	'update:benefitTypes',
]);

const props = defineProps({
	modelValue: { type: Object, required: true },
	areas: Array,
	organizations: Array,
	agreementStatuses: Array,
	supportTypes: Array,
	dualTypes: Array,
	microCredentials: Array,
	certifications: Array,
	diplomas: Array,
	benefitTypes: Array,
});

// Modales
const { showModal, modalData, openModal, closeModal } = useModal();
const { showModal: showAreaModal, modalData: areaModalData, openModal: openAreaModal, closeModal: closeAreaModal } = useModal();
const { showModal: showMicroModal, modalData: microModalData, openModal: openMicroModal, closeModal: closeMicroModal } = useModal();
const {
	showModal: showCertificationModal,
	modalData: certificationModalData,
	openModal: openCertificationModal,
	closeModal: closeCertificationModal,
} = useModal();
const { showModal: showDiplomaModal, modalData: diplomaModalData, openModal: openDiplomaModal, closeModal: closeDiplomaModal } = useModal();
const {
	showModal: showBenefitTypeModal,
	modalData: benefitTypeModalData,
	openModal: openBenefitTypeModal,
	closeModal: closeBenefitTypeModal,
} = useModal();
const { showModal: showDualTypeModal, modalData: dualTypeModalData, openModal: openDualTypeModal, closeModal: closeDualTypeModal } = useModal();

// ==================== REFS ====================
const maxQualification = ref(props.modelValue.max_qualification || '');
const errors = ref({});
const showValidationErrors = ref(false);
const hasAttemptedSubmit = ref(false);
const isAmountDisabled = ref(false);
const amountField = ref(null);
const sinApoyoId = ref(null); // ID dinámico de "Sin Apoyo Económico"
const allEconomicSupports = ref([]);

// Search refs
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

const searchMicro = ref('');
const showMicroDropdown = ref(false);
const microDropdownRef = ref(null);

const searchCertification = ref('');
const showCertificationDropdown = ref(false);
const certificationDropdownRef = ref(null);

const searchDiploma = ref('');
const showDiplomaDropdown = ref(false);
const diplomaDropdownRef = ref(null);

const searchBenefitType = ref('');
const showBenefitTypeDropdown = ref(false);
const benefitTypeDropdownRef = ref(null);

// Fechas
const period_start = ref(props.modelValue.period_start ? new Date(props.modelValue.period_start) : null);
const period_end = ref(props.modelValue.period_end ? new Date(props.modelValue.period_end) : null);

// Asesores
const internalAdvisorName = ref(props.modelValue.internal_advisor_name || '');
const externalAdvisorName = ref(props.modelValue.external_advisor_name || '');
const internalAdvisorQualification = ref(props.modelValue.internal_advisor_qualification || null);
const externalAdvisorQualification = ref(props.modelValue.external_advisor_qualification || null);

// Credenciales
const allMicroCredentials = ref(props.microCredentials || []);
const selectedMicroCredentials = ref([]);

const allCertifications = ref(props.certifications || []);
const selectedCertifications = ref([]);

const allDiplomas = ref(props.diplomas || []);
const selectedDiplomas = ref([]);

const allBenefitTypes = ref(props.benefitTypes || []);
const selectedBenefitTypes = ref([]);
const benefitQuantities = ref({});

// ==================== COMPUTED ====================
const showCredentialsSection = computed(() => props.modelValue.is_concluded === 1);
const areQualificationsEnabled = computed(() => props.modelValue.is_concluded === 1);
const isHiredDisabled = computed(() => props.modelValue.is_concluded !== 1);

const averageQualification = computed(() => {
	const intQ = Number(internalAdvisorQualification.value) || 0;
	const extQ = Number(externalAdvisorQualification.value) || 0;

	if (
		internalAdvisorQualification.value != null &&
		externalAdvisorQualification.value != null &&
		internalAdvisorQualification.value !== '' &&
		externalAdvisorQualification.value !== ''
	) {
		return ((intQ + extQ) / 2).toFixed(2);
	}
	return '';
});

const bothQualificationsPresent = computed(() => {
	return (
		internalAdvisorQualification.value !== null &&
		internalAdvisorQualification.value !== '' &&
		externalAdvisorQualification.value !== null &&
		externalAdvisorQualification.value !== ''
	);
});

// Filtros
const filteredAreas = computed(() => {
	if (!searchArea.value) return props.areas || [];
	const searchTerm = searchArea.value.toLowerCase();
	return (props.areas || []).filter((a) => a.name.toLowerCase().includes(searchTerm));
});

const filteredOrganizations = computed(() => {
	if (!searchOrganization.value) return props.organizations || [];
	const searchTerm = searchOrganization.value.toLowerCase();
	return (props.organizations || []).filter((o) => o.name.toLowerCase().includes(searchTerm));
});

const filteredStatuses = computed(() => {
	if (!searchStatus.value) return props.agreementStatuses || [];
	const searchTerm = searchStatus.value.toLowerCase();
	return (props.agreementStatuses || []).filter((s) => s.name.toLowerCase().includes(searchTerm));
});

const filteredSupports = computed(() => {
	if (!searchSupport.value) return props.supportTypes || [];
	const searchTerm = searchSupport.value.toLowerCase();
	return (props.supportTypes || []).filter((s) => s.name.toLowerCase().includes(searchTerm));
});

const filteredDualTypes = computed(() => {
	if (!searchDualType.value) return props.dualTypes || [];
	const searchTerm = searchDualType.value.toLowerCase();
	return (props.dualTypes || []).filter((d) => d.name.toLowerCase().includes(searchTerm));
});

const firstThreeDualTypes = computed(() => filteredDualTypes.value.slice(0, 3));
const remainingDualTypes = computed(() => filteredDualTypes.value.slice(3));

const filteredMicro = computed(() => {
	if (!searchMicro.value) {
		return allMicroCredentials.value.filter((m) =>
			!selectedMicroCredentials.value.some((s) => String(s.id) === String(m.id))
		);
	}
	const searchTerm = searchMicro.value.toLowerCase();
	return allMicroCredentials.value.filter(
		(m) => m.name.toLowerCase().includes(searchTerm) &&
			!selectedMicroCredentials.value.some((s) => String(s.id) === String(m.id))
	);
});

const filteredCertifications = computed(() => {
	if (!searchCertification.value) {
		return allCertifications.value.filter((c) =>
			!selectedCertifications.value.some((s) => String(s.id) === String(c.id))
		);
	}
	const searchTerm = searchCertification.value.toLowerCase();
	return allCertifications.value.filter(
		(c) => c.name.toLowerCase().includes(searchTerm) &&
			!selectedCertifications.value.some((s) => String(s.id) === String(c.id))
	);
});

const filteredDiplomas = computed(() => {
	if (!searchDiploma.value) {
		return allDiplomas.value.filter((d) =>
			!selectedDiplomas.value.some((s) => String(s.id) === String(d.id))
		);
	}
	const searchTerm = searchDiploma.value.toLowerCase();
	return allDiplomas.value.filter(
		(d) => d.name.toLowerCase().includes(searchTerm) &&
			!selectedDiplomas.value.some((s) => String(s.id) === String(d.id))
	);
});

const filteredBenefitTypes = computed(() => {
	if (!searchBenefitType.value) return allBenefitTypes.value || [];
	const searchTerm = searchBenefitType.value.toLowerCase();
	const selectedIds = new Set(selectedBenefitTypes.value.map((b) => String(b.id)));
	return (allBenefitTypes.value || []).filter((b) =>
		b.name.toLowerCase().includes(searchTerm) &&
		!selectedIds.has(String(b.id))
	);
});

// ==================== HELPERS ====================
const fieldHelpTexts = {
	name_report: 'Escribe el nombre específico del proyecto o actividad dual que se está registrando.',
	id_dual_area: 'Clasificación general del proyecto dual.',
	dual_type_id: 'Selecciona el tipo de modalidad que tendrá la actividad dual.',
	id_organization: 'Selecciona la empresa, institución u organismo donde se desarrollará el proyecto dual.',
	period_start: 'Día en que comenzará formalmente la actividad dual.',
	period_end: 'Día en que se dará por concluido la actividad.',
	status_document: 'Situación actual del convenio relacionado al proyecto.',
	economic_support: 'Forma en la que la organización brinda apoyo.',
	amount: 'Cantidad monetaria o equivalente proporcionada como apoyo.',
	max_qualification: 'La escala más alta de calificación.',
	qualification: 'Evaluación obtenida en el proyecto de acuerdo con la escala.',
	is_concluded: 'Marca si el proyecto ya finalizó.',
	is_hired: 'Indica si el estudiante fue contratado después de concluir el proyecto.',
	micro_credentials: 'Microcredenciales obtenidas al finalizar el proyecto.',
	certifications: 'Certificaciones obtenidas al finalizar el proyecto.',
	diplomas: 'Diplomados obtenidos al finalizar el proyecto.',
	benefitTypes: 'Tipos de Beneficios obtenidos al finalizar el proyecto.',
	description: 'Proporcione una breve descripción de la modalidad seleccionada.',
};

// ==================== FUNCIÓN PARA ENCONTRAR SIN APOYO ====================
const findSinApoyoId = async () => {
	try {
		// Si ya tenemos los apoyos en props, buscamos ahí
		if (props.supportTypes && props.supportTypes.length > 0) {
			const sinApoyo = props.supportTypes.find(
				s => s.name.toLowerCase().includes('sin apoyo') ||
					s.name.toLowerCase() === 'sin apoyo económico'
			);
			if (sinApoyo) {
				sinApoyoId.value = String(sinApoyo.id);
				return;
			}
		}

		// Si no está en props, hacemos la petición directamente
		const response = await getEconomicSupports();
		allEconomicSupports.value = response.data;
		const sinApoyo = response.data.find(
			s => s.name.toLowerCase().includes('sin apoyo') ||
				s.name.toLowerCase() === 'sin apoyo económico'
		);
		if (sinApoyo) {
			sinApoyoId.value = String(sinApoyo.id);
		}
	} catch (error) {
		console.error('Error al buscar ID de "Sin Apoyo Económico":', error);
	}
};

// ==================== VALIDACIONES ====================
const getValidationClass = (fieldName) => {
	if (!showValidationErrors.value) return '';

	if (errors.value[fieldName]) {
		return 'input-error';
	}

	const requiredFields = [
		'name_report',
		'id_organization',
		'id_dual_area',
		'period_start',
		'status_document',
		'economic_support',
		'amount',
		'is_concluded',
		'is_hired',
		'dual_type_id',
	];

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
		name_report: 'Nombre del Proyecto',
		id_organization: 'Organización',
		id_dual_area: 'Clasificación General del Proyecto',
		period_start: 'Fecha de Inicio',
		period_end: 'Fecha de Fin',
		status_document: 'Estado del Convenio',
		economic_support: 'Tipo de Apoyo Económico',
		amount: 'Monto',
		is_concluded: 'Proyecto Concluido',
		is_hired: 'Contratado',
		dual_type_id: 'Tipo de Modelo Dual',
		internal_advisor_qualification: 'Calificación Asesor Interno',
		external_advisor_qualification: 'Calificación Asesor Externo',
	};

	return {
		count: errorCount,
		fields: errorFields.map((field) => ({
			name: fieldNames[field] || field,
			message: errors.value[field],
		})),
	};
};

const resetValidation = () => {
	showValidationErrors.value = false;
	hasAttemptedSubmit.value = false;
	errors.value = {};
};

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

// ==================== UPDATE ====================
const update = (field, value) => {
	if ((field === 'internal_advisor_qualification' || field === 'external_advisor_qualification') && !areQualificationsEnabled.value) {
		return;
	}

	if (field === 'internal_advisor_qualification' || field === 'external_advisor_qualification') {
		if (!validateQualification(value, field)) {
			return;
		}
	}

	// Para campos que son UUIDs, asegurar que se pasen como strings
	const fieldsThatAreUUIDs = [
		'id_dual_area',
		'dual_type_id',
		'id_organization',
		'status_document',
		'economic_support'
	];

	let processedValue = value;
	if (fieldsThatAreUUIDs.includes(field) && value !== null && value !== undefined && value !== '') {
		processedValue = String(value);
	}

	emit('update:modelValue', { ...props.modelValue, [field]: processedValue });

	switch (field) {
		case 'id_dual_area':
			const area = props.areas?.find((a) => String(a.id) === String(value));
			searchArea.value = area?.name || '';
			showAreaDropdown.value = false;
			break;

		case 'id_organization':
			const org = props.organizations?.find((o) => String(o.id) === String(value));
			searchOrganization.value = org?.name || '';
			showOrganizationDropdown.value = false;
			break;

		case 'status_document':
			const status = props.agreementStatuses?.find((s) => String(s.id) === String(value));
			searchStatus.value = status?.name || '';
			showStatusDropdown.value = false;
			break;

		case 'economic_support':
			const support = props.supportTypes?.find((s) => String(s.id) === String(value));
			searchSupport.value = support?.name || '';

			// Verificar si es "Sin Apoyo Económico" usando el ID dinámico
			if ((sinApoyoId.value && String(value) === sinApoyoId.value) ||
				value === null || value === undefined || value === '') {
				isAmountDisabled.value = true;
				emit('update:modelValue', {
					...props.modelValue,
					[field]: value,
					amount: 0
				});
			} else {
				isAmountDisabled.value = false;
			}

			showSupportDropdown.value = false;
			break;

		case 'dual_type_id':
			const dualType = props.dualTypes?.find((d) => String(d.id) === String(value));
			searchDualType.value = dualType?.name || '';
			showDualTypeDropdown.value = false;
			break;
	}
};

const updateQualificationAverage = () => {
	const intQ = Number(internalAdvisorQualification.value) || 0;
	const extQ = Number(externalAdvisorQualification.value) || 0;

	if (
		internalAdvisorQualification.value != null &&
		externalAdvisorQualification.value != null &&
		internalAdvisorQualification.value !== '' &&
		externalAdvisorQualification.value !== ''
	) {
		const avg = ((intQ + extQ) / 2).toFixed(2);
		update('qualification', Number(avg));
	} else {
		update('qualification', null);
	}
};

// ==================== INICIALIZACIONES ====================
const initializeMicroCredentials = () => {
	selectedMicroCredentials.value = [];

	if (!props.modelValue.micro_credentials || !Array.isArray(props.modelValue.micro_credentials)) {
		return;
	}

	const microIds = props.modelValue.micro_credentials.filter(id => id !== null && id !== undefined && id !== '');

	selectedMicroCredentials.value = allMicroCredentials.value.filter((m) => {
		return microIds.includes(String(m.id));
	});
};

const initializeCertifications = () => {
	selectedCertifications.value = [];

	if (!props.modelValue.certifications || !Array.isArray(props.modelValue.certifications)) {
		return;
	}

	const certIds = props.modelValue.certifications.filter(id => id !== null && id !== undefined && id !== '');

	selectedCertifications.value = allCertifications.value.filter((c) => {
		return certIds.includes(String(c.id));
	});
};

const initializeDiplomas = () => {
	selectedDiplomas.value = [];

	if (!props.modelValue.diplomas || !Array.isArray(props.modelValue.diplomas)) {
		return;
	}

	const diplomaIds = props.modelValue.diplomas.filter(id => id !== null && id !== undefined && id !== '');

	selectedDiplomas.value = allDiplomas.value.filter((d) => {
		return diplomaIds.includes(String(d.id));
	});
};

const initializeBenefitTypes = () => {
	selectedBenefitTypes.value = [];
	benefitQuantities.value = {};

	const benefitTypesRaw = props.modelValue.benefitTypes || [];

	if (!Array.isArray(benefitTypesRaw) || benefitTypesRaw.length === 0) return;

	benefitTypesRaw.forEach((benefit) => {
		let benefitId = null;
		let quantity = 1;

		if (typeof benefit === 'string' || typeof benefit === 'number') {
			benefitId = String(benefit);
		} else if (benefit && typeof benefit === 'object' && benefit.id !== undefined) {
			benefitId = String(benefit.id);
			quantity = Number(benefit.quantity || benefit.pivot?.quantity || 1);
		}

		if (benefitId !== null && benefitId !== '') {
			const existingBenefitType = allBenefitTypes.value.find((b) => String(b.id) === String(benefitId));

			if (existingBenefitType) {
				if (!selectedBenefitTypes.value.some((b) => String(b.id) === String(benefitId))) {
					selectedBenefitTypes.value.push({
						id: existingBenefitType.id,
						name: existingBenefitType.name,
					});
					benefitQuantities.value[benefitId] = quantity;
				}
			}
		}
	});
};

const initializeSearchValues = () => {
	if (props.modelValue.id_dual_area && props.areas && props.areas.length > 0) {
		const area = props.areas.find((a) => a.id === props.modelValue.id_dual_area);
		searchArea.value = area?.name || '';
	}

	if (props.modelValue.id_organization && props.organizations && props.organizations.length > 0) {
		const org = props.organizations.find((o) => o.id === props.modelValue.id_organization);
		searchOrganization.value = org?.name || '';
	}

	if (props.modelValue.status_document && props.agreementStatuses && props.agreementStatuses.length > 0) {
		const status = props.agreementStatuses.find((s) => s.id === props.modelValue.status_document);
		searchStatus.value = status?.name || '';
	}

	if (props.modelValue.economic_support && props.supportTypes && props.supportTypes.length > 0) {
		const support = props.supportTypes.find((s) => String(s.id) === String(props.modelValue.economic_support));
		searchSupport.value = support?.name || '';

		// Verificar si es "Sin Apoyo Económico" usando el ID dinámico
		if ((sinApoyoId.value && String(props.modelValue.economic_support) === sinApoyoId.value) ||
			!props.modelValue.economic_support ||
			props.modelValue.economic_support === '') {
			isAmountDisabled.value = true;
			if (props.modelValue.amount !== 0) {
				emit('update:modelValue', {
					...props.modelValue,
					amount: 0
				});
			}
		} else {
			isAmountDisabled.value = false;
		}
	}

	if (props.modelValue.dual_type_id && props.dualTypes && props.dualTypes.length > 0) {
		const dualType = props.dualTypes.find((d) => d.id === props.modelValue.dual_type_id);
		searchDualType.value = dualType?.name || '';
	}

	if (props.modelValue.max_qualification) {
		maxQualification.value = props.modelValue.max_qualification.toString();
	}

	internalAdvisorName.value = props.modelValue.internal_advisor_name || '';
	externalAdvisorName.value = props.modelValue.external_advisor_name || '';
	internalAdvisorQualification.value = props.modelValue.internal_advisor_qualification || null;
	externalAdvisorQualification.value = props.modelValue.external_advisor_qualification || null;

	nextTick(() => {
		initializeMicroCredentials();
		initializeCertifications();
		initializeDiplomas();
		initializeBenefitTypes();
	});
};

// ==================== MÉTODOS PARA CREDENCIALES ====================
const addMicroCredential = (micro) => {
	if (!selectedMicroCredentials.value.some((m) => String(m.id) === String(micro.id))) {
		selectedMicroCredentials.value.push(micro);
		emit('update:modelValue', {
			...props.modelValue,
			micro_credentials: selectedMicroCredentials.value.map((m) => String(m.id)),
		});
	}
	searchMicro.value = '';
	showMicroDropdown.value = false;
};

const removeMicroCredential = (micro) => {
	selectedMicroCredentials.value = selectedMicroCredentials.value.filter((m) => String(m.id) !== String(micro.id));
	emit('update:modelValue', {
		...props.modelValue,
		micro_credentials: selectedMicroCredentials.value.map((m) => String(m.id)),
	});
};

const addCertification = (certification) => {
	if (!selectedCertifications.value.some((c) => String(c.id) === String(certification.id))) {
		selectedCertifications.value.push(certification);
		emit('update:modelValue', {
			...props.modelValue,
			certifications: selectedCertifications.value.map((c) => String(c.id)),
		});
	}
	searchCertification.value = '';
	showCertificationDropdown.value = false;
};

const removeCertification = (certification) => {
	selectedCertifications.value = selectedCertifications.value.filter((c) => String(c.id) !== String(certification.id));
	emit('update:modelValue', {
		...props.modelValue,
		certifications: selectedCertifications.value.map((c) => String(c.id)),
	});
};

const addDiploma = (diploma) => {
	if (!selectedDiplomas.value.some((d) => String(d.id) === String(diploma.id))) {
		selectedDiplomas.value.push(diploma);
		emit('update:modelValue', {
			...props.modelValue,
			diplomas: selectedDiplomas.value.map((d) => String(d.id)),
		});
	}
	searchDiploma.value = '';
	showDiplomaDropdown.value = false;
};

const removeDiploma = (diploma) => {
	selectedDiplomas.value = selectedDiplomas.value.filter((d) => String(d.id) !== String(diploma.id));
	emit('update:modelValue', {
		...props.modelValue,
		diplomas: selectedDiplomas.value.map((d) => String(d.id)),
	});
};

const addBenefitType = (benefitType) => {
	if (!selectedBenefitTypes.value.some((b) => String(b.id) === String(benefitType.id))) {
		selectedBenefitTypes.value.push(benefitType);
		benefitQuantities.value[benefitType.id] = 1;
		updateBenefitTypesInModel();
	}
	searchBenefitType.value = '';
	showBenefitTypeDropdown.value = false;
};

const removeBenefitType = (benefitType) => {
	selectedBenefitTypes.value = selectedBenefitTypes.value.filter((b) => String(b.id) !== String(benefitType.id));
	delete benefitQuantities.value[benefitType.id];
	updateBenefitTypesInModel();
};

const updateBenefitTypeQuantity = (benefitTypeId, quantity) => {
	const numQuantity = parseInt(quantity) || 0;
	if (numQuantity >= 0) {
		benefitQuantities.value[benefitTypeId] = numQuantity;
		updateBenefitTypesInModel();
	}
};

const updateBenefitTypesInModel = () => {
	const benefitTypesWithQuantities = selectedBenefitTypes.value.map((benefit) => ({
		id: String(benefit.id),
		quantity: benefitQuantities.value[benefit.id] || 0,
	}));

	emit('update:modelValue', {
		...props.modelValue,
		benefitTypes: benefitTypesWithQuantities,
	});
};

// ==================== HANDLERS DE GUARDADO ====================
const handleSavedOrganization = async (newOrganization) => {
	try {
		const res = await getOrganizations();
		emit('update:organizations', res.data);

		if (newOrganization) {
			const justCreatedOrg = res.data.find((org) => org.id === newOrganization.id || org.name === newOrganization.name);

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
	} catch (error) {
		console.error('Error al recargar organizaciones:', error);
	} finally {
		closeModal();
	}
};

const handleSavedArea = async (newArea) => {
	try {
		const res = await getDualAreas();
		emit('update:dualAreas', res.data);

		let justCreatedArea = null;
		if (newArea && newArea.id) {
			justCreatedArea = res.data.find((area) => Number(area.id) === Number(newArea.id));
		}

		if (!justCreatedArea && newArea && newArea.name) {
			const matchingAreas = res.data.filter((area) => area.name === newArea.name).sort((a, b) => b.id - a.id);
			if (matchingAreas.length > 0) {
				justCreatedArea = matchingAreas[0];
			}
		}

		if (justCreatedArea) {
			await nextTick();
			update('id_dual_area', justCreatedArea.id);
			searchArea.value = justCreatedArea.name;
			showAreaDropdown.value = true;
			setTimeout(() => {
				showAreaDropdown.value = false;
			}, 1500);
		}
	} catch (error) {
		console.error('Error al recargar áreas duales:', error);
	} finally {
		closeAreaModal();
	}
};

const handleSavedMicroCredential = async (newMicroCredential) => {
	try {
		const res = await getMicroCredentials();
		emit('update:microCredentials', res.data);
		allMicroCredentials.value = res.data;

		if (newMicroCredential) {
			const justCreatedMicro = res.data.find((micro) => micro.id === newMicroCredential.id || micro.name === newMicroCredential.name);

			if (justCreatedMicro) {
				await nextTick();
				if (!selectedMicroCredentials.value.some((m) => Number(m.id) === Number(justCreatedMicro.id))) {
					selectedMicroCredentials.value.push(justCreatedMicro);
					emit('update:modelValue', {
						...props.modelValue,
						micro_credentials: selectedMicroCredentials.value.map((m) => Number(m.id)),
					});
				}
				showMicroDropdown.value = true;
				setTimeout(() => {
					showMicroDropdown.value = false;
				}, 1500);
			}
		}
	} catch (error) {
		console.error('Error al recargar microcredenciales:', error);
	} finally {
		closeMicroModal();
	}
};

const handleSavedCertification = async (newCertification) => {
	try {
		const res = await getCertifications();
		emit('update:certifications', res.data);
		allCertifications.value = res.data;

		if (newCertification) {
			const justCreatedCert = res.data.find((cert) => cert.id === newCertification.id || cert.name === newCertification.name);

			if (justCreatedCert) {
				await nextTick();
				if (!selectedCertifications.value.some((c) => Number(c.id) === Number(justCreatedCert.id))) {
					selectedCertifications.value.push(justCreatedCert);
					emit('update:modelValue', {
						...props.modelValue,
						certifications: selectedCertifications.value.map((c) => Number(c.id)),
					});
				}
				showCertificationDropdown.value = true;
				setTimeout(() => {
					showCertificationDropdown.value = false;
				}, 1500);
			}
		}
	} catch (error) {
		console.error('Error al recargar certificaciones:', error);
	} finally {
		closeCertificationModal();
	}
};

const handleSavedDiploma = async (newDiploma) => {
	try {
		const res = await getDiplomas();
		emit('update:diplomas', res.data);
		allDiplomas.value = res.data;

		if (newDiploma) {
			const justCreatedDiploma = res.data.find((diploma) => diploma.id === newDiploma.id || diploma.name === newDiploma.name);

			if (justCreatedDiploma) {
				await nextTick();
				if (!selectedDiplomas.value.some((d) => Number(d.id) === Number(justCreatedDiploma.id))) {
					selectedDiplomas.value.push(justCreatedDiploma);
					emit('update:modelValue', {
						...props.modelValue,
						diplomas: selectedDiplomas.value.map((d) => Number(d.id)),
					});
				}
				showDiplomaDropdown.value = true;
				setTimeout(() => {
					showDiplomaDropdown.value = false;
				}, 1500);
			}
		}
	} catch (error) {
		console.error('Error al recargar diplomados:', error);
	} finally {
		closeDiplomaModal();
	}
};

const handleSavedBenefitType = async (newBenefitType) => {
	try {
		const res = await getBenefitType();
		emit('update:benefitTypes', res.data);
		allBenefitTypes.value = res.data;

		if (newBenefitType) {
			const justCreatedBenefit = res.data.find((b) => b.id === newBenefitType.id || b.name === newBenefitType.name);

			if (justCreatedBenefit) {
				await nextTick();
				if (!selectedBenefitTypes.value.some((b) => b.id === justCreatedBenefit.id)) {
					selectedBenefitTypes.value.push(justCreatedBenefit);
					benefitQuantities.value[justCreatedBenefit.id] = 1;
					updateBenefitTypesInModel();
				}
				showBenefitTypeDropdown.value = true;
				setTimeout(() => {
					showBenefitTypeDropdown.value = false;
				}, 1500);
			}
		}
	} catch (error) {
		console.error('Error al recargar tipos de beneficio:', error);
	} finally {
		closeBenefitTypeModal();
	}
};

const handleSavedDualType = async (newDualType) => {
	try {
		const res = await getDualTypes();
		emit('update:dualTypes', res.data);

		if (newDualType) {
			const justCreatedDualType = res.data.find((type) => type.id === newDualType.id || type.name === newDualType.name);

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
	} catch (error) {
		console.error('Error al recargar tipos duales:', error);
	} finally {
		closeDualTypeModal();
	}
};

// ==================== VALIDACIÓN PRINCIPAL ====================
const validate = () => {
	hasAttemptedSubmit.value = true;
	showValidationErrors.value = true;

	const requiredFields = [
		'name_report',
		'id_organization',
		'id_dual_area',
		'period_start',
		'status_document',
		'economic_support',
		'is_concluded',
		'is_hired',
		'dual_type_id',
	];

	let isValid = true;
	errors.value = {};

	for (const field of requiredFields) {
		const value = props.modelValue[field];
		if (value === null || value === undefined || value === '') {
			errors.value[field] = 'Este campo es obligatorio';
			isValid = false;
		}
	}

	// Validación de monto - solo requerido si NO es "Sin Apoyo Económico"
	if (props.modelValue.economic_support &&
		(!sinApoyoId.value || String(props.modelValue.economic_support) !== sinApoyoId.value)) {
		if (props.modelValue.amount === null || props.modelValue.amount === undefined || props.modelValue.amount === '') {
			errors.value.amount = 'El monto es obligatorio cuando hay apoyo económico';
			isValid = false;
		} else if (props.modelValue.amount < 0) {
			errors.value.amount = 'El monto debe ser mayor o igual a 0';
			isValid = false;
		}
	}

	if (props.modelValue.is_concluded === 1) {
		if (!props.modelValue.period_end) {
			errors.value.period_end = 'La fecha de fin es obligatoria cuando el proyecto está concluido';
			isValid = false;
		}
	}

	const start = props.modelValue.period_start ? new Date(props.modelValue.period_start) : null;
	const end = props.modelValue.period_end ? new Date(props.modelValue.period_end) : null;

	if (start && end && start > end) {
		errors.value.period_end = 'La fecha de fin debe ser posterior a la fecha de inicio';
		isValid = false;
	}

	if (internalAdvisorQualification.value !== null && internalAdvisorQualification.value !== '') {
		if (!validateQualification(internalAdvisorQualification.value, 'internal_advisor_qualification')) {
			isValid = false;
		}
	}

	if (externalAdvisorQualification.value !== null && externalAdvisorQualification.value !== '') {
		if (!validateQualification(externalAdvisorQualification.value, 'external_advisor_qualification')) {
			isValid = false;
		}
	}

	return isValid;
};

defineExpose({ validate, resetValidation, getValidationSummary });

// ==================== WATCHERS ====================
watch(internalAdvisorName, (newValue) => {
	update('internal_advisor_name', newValue);
});

watch(externalAdvisorName, (newValue) => {
	update('external_advisor_name', newValue);
});

watch(searchSupport, (newSearchValue, oldSearchValue) => {
	if (newSearchValue === '' && oldSearchValue && oldSearchValue.length > 0) {
		setTimeout(() => {
			if (searchSupport.value === '' && !supportDropdownRef.value?.contains(document.activeElement)) {
				update('economic_support', null);
				isAmountDisabled.value = true;
				emit('update:modelValue', {
					...props.modelValue,
					amount: 0
				});
				showSupportDropdown.value = false;
			}
		}, 200);
	}
});

watch(
	() => props.modelValue.max_qualification,
	(newScale, oldScale) => {
		if (newScale !== oldScale) {
			internalAdvisorQualification.value = null;
			externalAdvisorQualification.value = null;
			update('internal_advisor_qualification', null);
			update('external_advisor_qualification', null);
			update('qualification', null);
		}
	}
);

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

watch(
	() => props.modelValue.economic_support,
	(newSupportId, oldSupportId) => {
		// Verificar si es "Sin Apoyo Económico" usando el ID dinámico
		if ((sinApoyoId.value && String(newSupportId) === sinApoyoId.value) ||
			newSupportId === null || newSupportId === undefined || newSupportId === '') {
			isAmountDisabled.value = true;
			emit('update:modelValue', {
				...props.modelValue,
				amount: 0
			});

			// Si es "Sin Apoyo Económico", actualizar el searchSupport con el nombre correcto
			if (sinApoyoId.value && String(newSupportId) === sinApoyoId.value && props.supportTypes) {
				const sinApoyoOption = props.supportTypes.find((s) => String(s.id) === sinApoyoId.value);
				if (sinApoyoOption) {
					searchSupport.value = sinApoyoOption.name;
				}
			} else {
				searchSupport.value = '';
			}
		} else {
			isAmountDisabled.value = false;
		}
	}
);

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

watch(
	() => props.modelValue.max_qualification,
	(newVal) => {
		maxQualification.value = newVal != null ? newVal.toString() : '';
	}
);

watch(maxQualification, (newVal) => {
	update('max_qualification', newVal ? Number(newVal) : '');
});

// Watch para cuando cambian los supportTypes (por si agregan/eliminan opciones)
watch(
	() => props.supportTypes,
	(newSupportTypes) => {
		if (newSupportTypes && newSupportTypes.length > 0) {
			const sinApoyo = newSupportTypes.find(
				s => s.name.toLowerCase().includes('sin apoyo') ||
					s.name.toLowerCase() === 'sin apoyo económico'
			);
			if (sinApoyo) {
				sinApoyoId.value = String(sinApoyo.id);
			}
		}
	},
	{ immediate: true }
);

const updateSearchValuesFromProps = () => {
	if (props.areas && props.areas.length > 0 && props.modelValue.id_dual_area) {
		const area = props.areas.find((a) => a.id === props.modelValue.id_dual_area);
		if (area && searchArea.value !== area.name) {
			searchArea.value = area.name;
		}
	}

	if (props.organizations && props.organizations.length > 0 && props.modelValue.id_organization) {
		const org = props.organizations.find((o) => o.id === props.modelValue.id_organization);
		if (org && searchOrganization.value !== org.name) {
			searchOrganization.value = org.name;
		}
	}

	if (props.agreementStatuses && props.agreementStatuses.length > 0 && props.modelValue.status_document) {
		const status = props.agreementStatuses.find((s) => s.id === props.modelValue.status_document);
		if (status && searchStatus.value !== status.name) {
			searchStatus.value = status.name;
		}
	}

	if (props.supportTypes && props.supportTypes.length > 0 && props.modelValue.economic_support) {
		const support = props.supportTypes.find((s) => String(s.id) === String(props.modelValue.economic_support));
		if (support && searchSupport.value !== support.name) {
			searchSupport.value = support.name;
		}

		// Verificar si es "Sin Apoyo Económico" usando el ID dinámico
		if (sinApoyoId.value && String(props.modelValue.economic_support) === sinApoyoId.value) {
			isAmountDisabled.value = true;
		} else {
			isAmountDisabled.value = false;
		}
	}

	if (props.dualTypes && props.dualTypes.length > 0 && props.modelValue.dual_type_id) {
		const dualType = props.dualTypes.find((d) => d.id === props.modelValue.dual_type_id);
		if (dualType && searchDualType.value !== dualType.name) {
			searchDualType.value = dualType.name;
		}
	}
};

watch(
	() => [
		props.areas,
		props.organizations,
		props.agreementStatuses,
		props.supportTypes,
		props.dualTypes,
		props.modelValue.id_dual_area,
		props.modelValue.id_organization,
		props.modelValue.status_document,
		props.modelValue.economic_support,
		props.modelValue.dual_type_id,
	],
	() => {
		nextTick(() => {
			updateSearchValuesFromProps();
		});
	},
	{ deep: true }
);

watch(
	() => props.modelValue,
	(newValue) => {
		if (newValue && Object.keys(newValue).length > 0) {
			setTimeout(() => {
				updateSearchValuesFromProps();
			}, 100);
		}
	},
	{ deep: true, immediate: true }
);

watch(
	() => props.microCredentials,
	(newMicroCreds) => {
		if (JSON.stringify(allMicroCredentials.value) !== JSON.stringify(newMicroCreds || [])) {
			allMicroCredentials.value = newMicroCreds || [];
			setTimeout(() => {
				initializeMicroCredentials();
			}, 100);
		}
	},
	{ immediate: true }
);

watch(
	() => props.certifications,
	(newCerts) => {
		if (JSON.stringify(allCertifications.value) !== JSON.stringify(newCerts || [])) {
			allCertifications.value = newCerts || [];
			setTimeout(() => {
				initializeCertifications();
			}, 100);
		}
	},
	{ immediate: true }
);

watch(
	() => props.diplomas,
	(newDiplomas) => {
		if (JSON.stringify(allDiplomas.value) !== JSON.stringify(newDiplomas || [])) {
			allDiplomas.value = newDiplomas || [];
			setTimeout(() => {
				initializeDiplomas();
			}, 100);
		}
	},
	{ immediate: true }
);

watch(
	() => props.benefitTypes,
	(newBenefitTypes) => {
		const current = JSON.stringify(allBenefitTypes.value);
		const incoming = JSON.stringify(newBenefitTypes || []);

		if (current !== incoming) {
			allBenefitTypes.value = newBenefitTypes || [];
			setTimeout(() => {
				initializeBenefitTypes();
			}, 0);
		}
	},
	{ immediate: true }
);

watch(
	() => props.modelValue.micro_credentials,
	(newValue) => {
		if (JSON.stringify(selectedMicroCredentials.value.map((m) => String(m.id))) !== JSON.stringify(newValue || [])) {
			initializeMicroCredentials();
		}
	},
	{ deep: true }
);

watch(
	() => props.modelValue.certifications,
	(newValue) => {
		if (JSON.stringify(selectedCertifications.value.map((c) => String(c.id))) !== JSON.stringify(newValue || [])) {
			initializeCertifications();
		}
	},
	{ deep: true }
);

watch(
	() => props.modelValue.diplomas,
	(newValue) => {
		if (JSON.stringify(selectedDiplomas.value.map((d) => String(d.id))) !== JSON.stringify(newValue || [])) {
			initializeDiplomas();
		}
	},
	{ deep: true }
);

// ==================== EVENT HANDLERS ====================
const handleClickOutside = (event) => {
	const dropdowns = [
		{ ref: areaDropdownRef, show: showAreaDropdown },
		{ ref: organizationDropdownRef, show: showOrganizationDropdown },
		{ ref: statusDropdownRef, show: showStatusDropdown },
		{ ref: supportDropdownRef, show: showSupportDropdown },
		{ ref: dualTypeDropdownRef, show: showDualTypeDropdown },
		{ ref: microDropdownRef, show: showMicroDropdown },
		{ ref: benefitTypeDropdownRef, show: showBenefitTypeDropdown },
		{ ref: certificationDropdownRef, show: showCertificationDropdown },
		{ ref: diplomaDropdownRef, show: showDiplomaDropdown },
	];

	let shouldCloseAll = true;

	dropdowns.forEach(({ ref, show }) => {
		if (ref.value && ref.value.contains(event.target)) {
			shouldCloseAll = false;
		}

		const inputSelectors = [
			'input[placeholder*="Buscar"]',
			'input[placeholder*="tipo"]',
			'input[placeholder*="clasificación"]',
			'input[placeholder*="organización"]',
			'input[placeholder*="estado"]',
			'input[placeholder*="apoyo"]',
			'input[placeholder*="beneficio"]',
			'input[placeholder*="microcredencial"]',
			'input[placeholder*="certificado"]',
			'input[placeholder*="diploma"]',
		];

		inputSelectors.forEach((selector) => {
			const inputs = document.querySelectorAll(selector);
			inputs.forEach((input) => {
				if (input.contains(event.target)) {
					shouldCloseAll = false;
				}
			});
		});
	});

	if (shouldCloseAll) {
		dropdowns.forEach(({ show }) => {
			show.value = false;
		});
	}
};

// ==================== LIFECYCLE ====================
onMounted(async () => {
	document.addEventListener('click', handleClickOutside);

	// Buscar el ID de "Sin Apoyo Económico"
	await findSinApoyoId();

	setTimeout(() => {
		initializeSearchValues();
	}, 300);

	// Verificar estado inicial del apoyo económico
	if ((sinApoyoId.value && String(props.modelValue.economic_support) === sinApoyoId.value) ||
		!props.modelValue.economic_support ||
		props.modelValue.economic_support === '' ||
		props.modelValue.economic_support === null) {
		isAmountDisabled.value = true;
		if (props.modelValue.amount !== 0) {
			emit('update:modelValue', {
				...props.modelValue,
				amount: 0
			});
		}
	} else {
		isAmountDisabled.value = false;
	}
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});

// ==================== UTILIDADES ====================
function formatNumber(value) {
	if (!value) return '0'
	return Number(value).toLocaleString('es-MX')
}

function handleQuantityInput(id, event) {
	let rawValue = event.target.value.replace(/[^0-9]/g, '')
	const numericValue = rawValue ? Number(rawValue) : 0
	benefitQuantities.value[id] = numericValue
	updateBenefitTypesInModel()
	event.target.value = formatNumber(numericValue)
}
const handleAmountInput = (event) => {
	let value = event.target.value

	value = value.replace(/[^0-9.]/g, '')

	const parts = value.split('.')
	if (parts.length > 2) {
		value = parts[0] + '.' + parts.slice(1).join('')
	}

	if (parts[1]) {
		value = parts[0] + '.' + parts[1].slice(0, 2)
	}

	const numericValue = parseFloat(value)

	update('amount', isNaN(numericValue) ? null : numericValue)
}

</script>

<template>
	<div class="space-y-8">
		<!-- Modal de validación -->
		<div
			v-if="showValidationErrors && getValidationSummary()"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
				<div class="bg-red-500 text-white p-4">
					<h3 class="text-lg font-semibold flex items-center gap-2">
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd" />
						</svg>
						Campos Requeridos
					</h3>
				</div>

				<div class="p-6">
					<p class="text-gray-700 mb-4">Por favor, completa los siguientes campos obligatorios:</p>

					<div class="space-y-3 max-h-60 overflow-y-auto">
						<div
							v-for="field in getValidationSummary().fields"
							:key="field.name"
							class="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
							<svg
								class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd" />
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

		<!-- Estado de validación -->
		<div
			v-if="hasAttemptedSubmit"
			class="bg-white border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div
						v-if="Object.keys(errors).length === 0"
						class="flex items-center gap-2 text-green-600">
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd" />
						</svg>
						<span class="font-medium">Todos los campos requeridos están completos</span>
					</div>
					<div
						v-else
						class="flex items-center gap-2 text-red-600">
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd" />
						</svg>
						<span class="font-medium">{{ Object.keys(errors).length }} campo(s) requieren atención</span>
					</div>
				</div>
				<button
					v-if="Object.keys(errors).length > 0"
					class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
					@click="showValidationErrors = true">
					Ver detalles
					<svg
						class="w-4 h-4"
						fill="currentColor"
						viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Formulario principal -->
		<div class="space-y-8">
			<div class="text-center">
				<h2 class="text-2xl font-bold text-brand-900 mb-2">Proyecto Dual</h2>
				<p class="text-gray-600 text-sm">Complete la información del proyecto dual</p>
			</div>

			<!-- Sección 1: Proyecto Dual -->
			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">1</span>
					Proyecto Dual
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Nombre del Proyecto -->
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
						<p
							v-if="errors.name_report"
							class="error-msg">
							{{ errors.name_report }}
						</p>
					</div>

					<!-- Clasificación General -->
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
									v-show="showAreaDropdown && filteredAreas.length"
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
								@open="({ mode, pk, table }) => openAreaModal(mode, pk, table)" />
						</div>
						<p
							v-if="errors.id_dual_area"
							class="error-msg">
							{{ errors.id_dual_area }}
						</p>
					</div>
				</div>

				<!-- Tipo de Educación Dual y Descripción -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					<div ref="dualTypeDropdownRef">
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
								v-show="showDualTypeDropdown"
								class="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 divide-y divide-gray-200">
								<li
									v-for="dual in firstThreeDualTypes"
									:key="dual.id"
									class="px-4 py-2 hover:bg-brand-50 cursor-pointer transition-colors"
									@click="update('dual_type_id', dual.id)">
									{{ dual.name }}
								</li>

								<li class="relative group">
									<div class="px-4 py-2 hover:bg-brand-50 cursor-pointer flex justify-between items-center transition-colors">
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
						<p
							v-if="errors.dual_type_id"
							class="error-msg">
							{{ errors.dual_type_id }}
						</p>
					</div>

					<!-- Descripción -->
					<div v-if="modelValue.dual_type_id">
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
						<p
							v-if="errors.description"
							class="error-msg">
							{{ errors.description }}
						</p>
					</div>
				</div>
			</div>

			<!-- Sección 2: Organización -->
			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">2</span>
					Organización
				</h3>
				<div
					ref="organizationDropdownRef"
					class="flex items-end gap-2">
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
							v-model="searchOrganization"
							class="input"
							:class="getValidationClass('id_organization')"
							placeholder="Buscar organización..."
							@focus="showOrganizationDropdown = true"
							@input="showOrganizationDropdown = true" />
						<ul
							v-show="showOrganizationDropdown && filteredOrganizations.length"
							class="dropdown">
							<li
								v-for="org in filteredOrganizations"
								:key="org.id"
								class="dropdown-item"
								@click="update('id_organization', org.id)">
								{{ org.name }}
							</li>
						</ul>
						<p
							v-if="errors.id_organization"
							class="error-msg">
							{{ errors.id_organization }}
						</p>
					</div>
					<btn-create
						:table="'organizacion'"
						class="h-12 px-4 flex-shrink-0"
						tooltip="Crear nueva organización"
						@open="({ mode, pk, table }) => openModal(mode, pk, table)" />
				</div>
			</div>

			<!-- Sección 3: Periodo -->
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
							v-model="period_start"
							placeholder="Seleccione la fecha"
							:enable-time-picker="false"
							class="input"
							:class="getValidationClass('period_start')" />
						<p
							v-if="errors.period_start"
							class="error-msg">
							{{ errors.period_start }}
						</p>
					</div>
					<div>
						<label class="label flex items-center gap-1">
							Fecha de Fin
							<span
								v-if="modelValue.is_concluded === 1"
								class="text-red-500">
								*
							</span>
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
						<p
							v-if="errors.period_end"
							class="error-msg">
							{{ errors.period_end }}
						</p>
						<p
							v-if="modelValue.is_concluded !== 1"
							class="text-xs text-gray-500 mt-1">
							Opcional para proyectos en curso
						</p>
					</div>
				</div>

				<div class="mt-4">
					<label class="label flex items-center gap-1">Observaciones del Período</label>
					<textarea
						class="input min-h-[80px]"
						placeholder="Observaciones adicionales sobre el período (opcional)"
						:value="modelValue.period_observation || ''"
						@input="update('period_observation', $event.target.value)" />
					<p class="text-xs text-gray-500 mt-1">Campo opcional para notas sobre el período del proyecto</p>
				</div>
			</div>

			<!-- Sección 4: Convenio y Apoyo -->
			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">4</span>
					Convenio y Apoyo
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<!-- Estado del Convenio -->
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
								v-model="searchStatus"
								class="input"
								:class="getValidationClass('status_document')"
								placeholder="Buscar estado..."
								@focus="showStatusDropdown = true"
								@input="showStatusDropdown = true" />
							<ul
								v-show="showStatusDropdown && filteredStatuses.length"
								class="dropdown">
								<li
									v-for="estado in filteredStatuses"
									:key="estado.id"
									class="dropdown-item"
									@click="update('status_document', estado.id)">
									{{ estado.name }}
								</li>
							</ul>
						</div>
						<p
							v-if="errors.status_document"
							class="error-msg">
							{{ errors.status_document }}
						</p>
					</div>

					<!-- Tipo de Apoyo Económico -->
					<div ref="supportDropdownRef">
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
							<ul
								v-show="showSupportDropdown && filteredSupports.length"
								class="dropdown">
								<li
									v-for="apoyo in filteredSupports"
									:key="apoyo.id"
									class="dropdown-item"
									@click="update('economic_support', apoyo.id)">
									{{ apoyo.name }}
								</li>
							</ul>
						</div>
						<p
							v-if="errors.economic_support"
							class="error-msg">
							{{ errors.economic_support }}
						</p>
					</div>

					<!-- Monto -->
					<div>
						<label class="label flex items-center gap-1">
							Monto Mensual
							<button
								v-tooltip="fieldHelpTexts.amount"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<div class="relative w-32">
							<span class="absolute left-28 top-1/2 -translate-y-1/2 text-gray-500">
								$
							</span>
							<input
								ref="amountField"
								type="text"
								inputmode="decimal"
								class="input"
								:class="[
									getValidationClass('amount'),
									{ 'bg-gray-100 cursor-not-allowed opacity-60': isAmountDisabled }
								]"
								:disabled="isAmountDisabled"
								:placeholder="isAmountDisabled ? 'No aplica' : 'Ingrese el monto'"
								:value="formatNumber(modelValue.amount)"
								@input="handleAmountInput($event)" />
						</div>
						<p
							v-if="errors.amount"
							class="error-msg">
							{{ errors.amount }}
						</p>

						<p
							v-if="isAmountDisabled"
							class="text-xs text-gray-500 mt-1">
							Campo deshabilitado cuando no hay apoyo económico
						</p>
					</div>
				</div>
			</div>

			<!-- Sección 5: Estado del Proyecto Dual -->
			<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-6 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">5</span>
					Estado del Proyecto Dual
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Proyecto Concluido -->
					<div>
						<label class="label flex items-center gap-1">
							Proyecto Dual Concluido
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.is_concluded"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<select
							class="input"
							:class="getValidationClass('is_concluded')"
							:value="modelValue.is_concluded"
							@change="update('is_concluded', parseInt($event.target.value))">
							<option :value="0">No</option>
							<option :value="1">Sí</option>
						</select>
						<p
							v-if="errors.is_concluded"
							class="error-msg">
							{{ errors.is_concluded }}
						</p>
					</div>

					<!-- Contratado -->
					<div>
						<label class="label flex items-center gap-1">
							Contratado
							<span class="text-red-500">*</span>
							<button
								v-tooltip="fieldHelpTexts.is_hired"
								type="button"
								class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
								?
							</button>
						</label>
						<div class="relative">
							<select
								class="input w-full"
								:class="[
									getValidationClass('is_hired'),
									{
										'opacity-50 cursor-not-allowed bg-gray-100': isHiredDisabled,
										'cursor-pointer': !isHiredDisabled,
									},
								]"
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
						<p
							v-if="errors.is_hired"
							class="error-msg">
							{{ errors.is_hired }}
						</p>

						<p
							v-if="isHiredDisabled"
							class="text-xs text-gray-500 mt-1 flex items-center">
							<svg
								class="w-4 h-4 mr-1"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd" />
							</svg>
							Disponible cuando el proyecto esté concluido
						</p>
					</div>
				</div>

				<!-- Observaciones de Contratación -->
				<div
					v-if="modelValue.is_hired === 1"
					class="mt-4">
					<label class="label flex items-center gap-1">
						Observaciones de Contratación
						<button
							v-tooltip="fieldHelpTexts.hired_observation"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
							?
						</button>
					</label>
					<textarea
						class="input min-h-[80px]"
						placeholder="Detalles sobre la contratación (opcional)"
						:value="modelValue.hired_observation || ''"
						@input="update('hired_observation', $event.target.value)" />
					<p class="text-xs text-gray-500 mt-1">Campo opcional para notas sobre la contratación</p>
				</div>

				<!-- Escala de evaluación -->
				<div class="mt-8">
					<label class="label flex items-center gap-1">
						Escala de evaluación
						<button
							v-tooltip="fieldHelpTexts.max_qualification"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
							?
						</button>
					</label>
					<select
						v-model="modelValue.max_qualification"
						class="input w-full md:w-64"
						:class="{
							'opacity-50 cursor-not-allowed bg-gray-100': !areQualificationsEnabled,
							'cursor-pointer': areQualificationsEnabled,
						}"
						:disabled="!areQualificationsEnabled"
						@change="update('max_qualification', Number($event.target.value))">
						<option value="">Seleccione...</option>
						<option value="10">10</option>
						<option value="100">100</option>
					</select>
					<p
						v-if="errors.max_qualification"
						class="error-msg">
						{{ errors.max_qualification }}
					</p>

					<p
						v-if="!areQualificationsEnabled"
						class="text-xs text-gray-500 mt-1 flex items-center">
						<svg
							class="w-4 h-4 mr-1"
							fill="currentColor"
							viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clip-rule="evenodd" />
						</svg>
						Disponible cuando el proyecto esté concluido
					</p>
				</div>

				<!-- Asesores y Calificaciones -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
					<!-- Asesor Interno -->
					<div>
						<label class="label flex items-center gap-1">Asesor Interno</label>
						<input
							v-model="internalAdvisorName"
							type="text"
							class="input"
							placeholder="Nombre del asesor interno" />

						<div
							v-if="internalAdvisorName && areQualificationsEnabled"
							class="mt-3">
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
							<p
								v-if="errors.internal_advisor_qualification"
								class="error-msg">
								{{ errors.internal_advisor_qualification }}
							</p>
							<p
								v-else
								class="text-xs text-gray-500 mt-1">
								Máximo permitido: {{ modelValue.max_qualification || 'Seleccione escala primero' }}
							</p>
						</div>

						<p
							v-if="internalAdvisorName && !areQualificationsEnabled"
							class="text-xs text-brand-200 mt-1 flex items-center">
							<svg
								class="w-4 h-4 mr-1"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd" />
							</svg>
							La calificación estará disponible cuando el proyecto esté concluido
						</p>
					</div>

					<!-- Asesor Externo -->
					<div>
						<label class="label flex items-center gap-1">Asesor Externo</label>
						<input
							v-model="externalAdvisorName"
							type="text"
							class="input"
							placeholder="Nombre del asesor externo" />

						<div
							v-if="externalAdvisorName && areQualificationsEnabled"
							class="mt-3">
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
							<p
								v-if="errors.external_advisor_qualification"
								class="error-msg">
								{{ errors.external_advisor_qualification }}
							</p>
							<p
								v-else
								class="text-xs text-gray-500 mt-1">
								Máximo permitido: {{ modelValue.max_qualification || 'Seleccione escala primero' }}
							</p>
						</div>

						<p
							v-if="externalAdvisorName && !areQualificationsEnabled"
							class="text-xs text-brand-200 mt-1 flex items-center">
							<svg
								class="w-4 h-4 mr-1"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd" />
							</svg>
							La calificación estará disponible cuando el proyecto esté concluido
						</p>
					</div>

					<!-- Calificación Final -->
					<div
						v-if="bothQualificationsPresent && areQualificationsEnabled"
						class="md:col-span-2 mt-4">
						<label class="label flex items-center gap-1">Calificación Final</label>
						<input
							type="number"
							class="input bg-gray-100 cursor-not-allowed"
							:value="averageQualification"
							disabled />
					</div>
				</div>
			</div>

			<!-- Sección 7: Microcredenciales, Certificaciones y Diplomados -->
			<div
				v-if="showCredentialsSection"
				class="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">7</span>
					Microcredenciales, Certificaciones y Diplomados
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<!-- Microcredenciales -->
					<div
						ref="microDropdownRef"
						class="relative">
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
								@open="({ mode, pk, table }) => openMicroModal(mode, pk, table)" />
						</div>
						<ul
							v-show="showMicroDropdown && filteredMicro.length"
							class="absolute top-full left-0 w-full mt-1 dropdown z-10">
							<li
								v-for="micro in filteredMicro"
								:key="micro.id"
								class="dropdown-item"
								@click="addMicroCredential(micro)">
								{{ micro.name }}-{{ micro.organization }}
							</li>
						</ul>
						<div class="flex flex-wrap gap-2 mt-2">
							<span
								v-for="micro in selectedMicroCredentials"
								:key="micro.id"
								class="bg-brand-100 text-brand-800 px-3 py-1 rounded-full flex items-center gap-2">
								{{ micro.name }}
								<button
									type="button"
									class="text-red-500 hover:text-red-700 font-bold"
									@click="removeMicroCredential(micro)">
									×
								</button>
							</span>
						</div>
					</div>

					<!-- Certificaciones -->
					<div
						ref="certificationDropdownRef"
						class="relative">
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
								@open="({ mode, pk, table }) => openCertificationModal(mode, pk, table)" />
						</div>
						<ul
							v-show="showCertificationDropdown && filteredCertifications.length"
							class="absolute top-full left-0 w-full mt-1 dropdown z-10">
							<li
								v-for="certification in filteredCertifications"
								:key="certification.id"
								class="dropdown-item"
								@click="addCertification(certification)">
								{{ certification.name }}-{{ certification.organization }}
							</li>
						</ul>
						<div class="flex flex-wrap gap-2 mt-2">
							<span
								v-for="certification in selectedCertifications"
								:key="certification.id"
								class="bg-brand-100 text-brand-800 px-3 py-1 rounded-full flex items-center gap-2">
								{{ certification.name }}
								<button
									type="button"
									class="text-red-500 hover:text-red-700 font-bold"
									@click="removeCertification(certification)">
									×
								</button>
							</span>
						</div>
					</div>

					<!-- Diplomados -->
					<div
						ref="diplomaDropdownRef"
						class="relative">
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
								@open="({ mode, pk, table }) => openDiplomaModal(mode, pk, table)" />
						</div>
						<ul
							v-show="showDiplomaDropdown && filteredDiplomas.length"
							class="absolute top-full left-0 w-full mt-1 dropdown z-10">
							<li
								v-for="diploma in filteredDiplomas"
								:key="diploma.id"
								class="dropdown-item"
								@click="addDiploma(diploma)">
								{{ diploma.name }}-{{ diploma.organization }}
							</li>
						</ul>
						<div class="flex flex-wrap gap-2 mt-2">
							<span
								v-for="diploma in selectedDiplomas"
								:key="diploma.id"
								class="bg-brand-100 text-brand-800 px-3 py-1 rounded-full flex items-center gap-2">
								{{ diploma.name }}
								<button
									type="button"
									class="text-red-500 hover:text-red-700 font-bold"
									@click="removeDiploma(diploma)">
									×
								</button>
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Sección 8: Tipos de Beneficio -->
			<div
				v-if="showCredentialsSection"
				class="bg-gray-50 rounded-xl p-6 border border-gray-200 relative">
				<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
					<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">8</span>
					Tipos de Beneficio Anual
				</h3>

				<div class="relative">
					<label class="label flex items-center gap-1">
						Tipos de Beneficio Anual
						<button
							v-tooltip="fieldHelpTexts.benefitTypes"
							type="button"
							class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
							?
						</button>
					</label>

					<div class="flex items-center gap-2 mb-4 relative">
						<input
							v-model="searchBenefitType"
							class="input flex-1"
							placeholder="Buscar tipo de beneficio anual..."
							@focus="showBenefitTypeDropdown = true"
							@input="showBenefitTypeDropdown = true"
							@blur="
								setTimeout(() => {
									showBenefitTypeDropdown = false;
								}, 200)
							" />
						<btn-create
							:table="'Tipo de Beneficio'"
							@open="({ mode, pk, table }) => openBenefitTypeModal(mode, pk, table)" />

						<div
							v-show="showBenefitTypeDropdown && filteredBenefitTypes.length"
							class="absolute top-full left-0 w-full mt-1 z-50">
							<ul class="bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
								<li
									v-for="benefit in filteredBenefitTypes"
									:key="benefit.id"
									class="px-4 py-3 hover:bg-brand-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
									@mousedown.prevent="addBenefitType(benefit)">
									{{ benefit.name }}
								</li>
							</ul>
						</div>
					</div>

					<div class="space-y-3 mt-4">
						<div
							v-for="benefit in selectedBenefitTypes"
							:key="benefit.id"
							class="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
							<div class="flex-1">
								<span class="font-medium text-gray-800">{{ benefit.name }}</span>
							</div>
							<div class="flex items-center gap-3">
								<div>
									<label class="text-sm text-gray-600 mr-2">Cantidad Anual:</label>
									<div class="relative w-32">
										<span class="absolute left-28 top-1/2 -translate-y-1/2 text-gray-500">
											$
										</span>
										<input
											type="text"
											inputmode="decimal"
											class="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-brand-600 focus:border-transparent"
											:value="formatNumber(benefitQuantities[benefit.id])"
											@input="handleQuantityInput(benefit.id, $event)" />
									</div>
								</div>
								<button
									type="button"
									class="text-red-500 hover:text-red-700 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
									@click="removeBenefitType(benefit)">
									×
								</button>
							</div>
						</div>

						<div
							v-if="selectedBenefitTypes.length === 0"
							class="text-center py-8 text-gray-500">
							<svg
								class="w-12 h-12 mx-auto mb-3 text-gray-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
							</svg>
							<p>No hay tipos de beneficio agregados</p>
							<p class="text-sm mt-1">Agrega tipos de beneficio usando el campo de búsqueda arriba</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Modales -->
	<mdl-organization
		:show="showModal"
		:data="modalData"
		@close="closeModal"
		@saved="handleSavedOrganization" />

	<mdlMicroCredential
		:show="showMicroModal"
		:data="microModalData"
		@close="closeMicroModal"
		@saved="handleSavedMicroCredential" />

	<mdlCertification
		:show="showCertificationModal"
		:data="certificationModalData"
		@close="closeCertificationModal"
		@saved="handleSavedCertification" />

	<mdlDiploma
		:show="showDiplomaModal"
		:data="diplomaModalData"
		@close="closeDiplomaModal"
		@saved="handleSavedDiploma" />

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

	<mdlBenefitType
		:show="showBenefitTypeModal"
		:data="benefitTypeModalData"
		@close="closeBenefitTypeModal"
		@saved="handleSavedBenefitType" />
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
	@apply absolute z-50 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg;
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

/* Mejoras de rendimiento */
.dropdown {
	will-change: transform, opacity;
	contain: content;
}

.transition-all {
	will-change: transform, opacity, max-height;
}

/* Clase específica para los dropdowns */
.dropdown-fixed {
	position: fixed !important;
	z-index: 10000 !important;
	width: auto !important;
	max-width: 400px;
	max-height: 300px !important;
}

/* Contenedor relativo para los dropdowns */
.dropdown-container {
	position: relative;
	z-index: 100;
}

/* Optimización para listas largas */
.dropdown-item {
	contain: layout style;
}
</style>