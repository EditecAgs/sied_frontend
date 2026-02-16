<!-- /pages/ModeloDualFormPage.vue - VERSIÓN OPTIMIZADA MEJORADA -->
<template>
  <AdminLayout>
    <!-- Loading overlay principal con progreso -->
    <div v-if="globalLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 shadow-xl max-w-md w-full">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-800 mx-auto mb-4"></div>
        <p class="text-center text-gray-700 font-medium mb-2">
          {{ globalLoadingMessage }}
        </p>
        <div v-if="loadingProgress < 100" class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-brand-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${loadingProgress}%` }"
          ></div>
        </div>
        <p v-if="loadingProgress < 100" class="text-center text-sm text-gray-600 mt-2">
          {{ loadingProgress }}% completado
        </p>
      </div>
    </div>
    
    <PageBreadcrumb :pageTitle="pageTitle" />
    
    <div class="space-y-5 sm:space-y-6" :class="{ 'opacity-50 pointer-events-none': globalLoading }">
      <ComponentCard :title="formTitle">
        <!-- Encabezado con botón para volver -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <button
              @click="goBackToList"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeftIcon class="h-5 w-5 mr-2" />
              Volver a la lista
            </button>
          </div>
          <div v-if="mode !== 'create'" class="text-sm font-medium px-3 py-1 rounded-full"
               :class="mode === 'edit' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
            {{ mode === 'edit' ? 'Modo Edición' : 'Modo Completar' }}
          </div>
        </div>

        <!-- Contenedor del formulario vertical -->
        <div class="bg-white rounded-lg shadow p-6 space-y-8" id="form-container">
          <!-- Sección 1: Información de Institución -->
          <div class="border rounded-lg overflow-hidden transition-all duration-300" 
               :class="section1Expanded ? 'border-blue-200 shadow-sm' : 'border-gray-200'"
               id="section-1">
            <!-- Encabezado de sección 1 -->
            <button
              @click="toggleSection(1)"
              class="w-full p-4 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-500 hover:to-brand-700 flex items-center justify-between transition-all duration-200"
              :disabled="globalLoading"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-white bg-opacity-20">
                  <span class="font-semibold text-white">1</span>
                </div>
                <div class="text-left">
                  <h3 class="text-lg font-semibold text-white">
                    Información de Institución
                  </h3>
                  <p class="text-sm text-white text-opacity-90 mt-1">
                    Selecciona la institución educativa
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <div v-if="isSection1Incomplete" 
                     class="mr-3 flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  <ExclamationTriangleIcon class="h-3 w-3 mr-1" />
                  <span class="text-xs font-medium">Pendiente</span>
                </div>
                <div v-else-if="!isSection1Incomplete" 
                     class="mr-3 flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  <CheckCircleIcon class="h-3 w-3 mr-1" />
                  <span class="text-xs font-medium">Completo</span>
                </div>
                <ChevronDownIcon 
                  class="h-6 w-6 text-white transition-transform duration-300"
                  :class="{ 'transform rotate-180': section1Expanded }"
                />
              </div>
            </button>

            <!-- Contenido de sección 1 -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[2000px]"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-[2000px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-show="section1Expanded" class="p-6 border-t">
                <DualStepAcademico
                  ref="stepAcademicoRef"
                  v-model="formData.academico"
                  v-model:reportaModeloDual="reportaModeloDual"
                  :institutions="institutions"
                  :mode="mode"
                  @update:institutions="handleInstitutionsUpdate"
                />
              </div>
            </transition>
          </div>

          <!-- Sección 2: Datos Personales - Mostrar solo si reportaModeloDual es true -->
          <div v-if="reportaModeloDual" 
               class="border rounded-lg overflow-hidden transition-all duration-300"
               :class="section2Expanded ? 'border-blue-200 shadow-sm' : 'border-gray-200'"
               id="section-2">
            <!-- Encabezado de sección 2 -->
            <button
              @click="toggleSection(2)"
              class="w-full p-4 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-500 hover:to-brand-700 flex items-center justify-between transition-all duration-200"
              :disabled="isSection1Incomplete || globalLoading"
              :class="{ 'opacity-50 cursor-not-allowed': isSection1Incomplete || globalLoading }"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-white bg-opacity-20">
                  <span class="font-semibold text-white">2</span>
                </div>
                <div class="text-left">
                  <h3 class="text-lg font-semibold text-white">
                    Datos Personales de Estudiantes
                  </h3>
                  <p class="text-sm text-white text-opacity-90 mt-1">
                    Información de los estudiantes participantes
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <div v-if="isSection2Incomplete" 
                     class="mr-3 flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  <ExclamationTriangleIcon class="h-3 w-3 mr-1" />
                  <span class="text-xs font-medium">Pendiente</span>
                </div>
                <div v-else-if="!isSection2Incomplete" 
                     class="mr-3 flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  <CheckCircleIcon class="h-3 w-3 mr-1" />
                  <span class="text-xs font-medium">Completo</span>
                </div>
                <ChevronDownIcon 
                  class="h-6 w-6 text-white transition-transform duration-300"
                  :class="{ 'transform rotate-180': section2Expanded }"
                />
              </div>
            </button>

            <!-- Contenido de sección 2 -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[2000px]"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-[2000px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-show="section2Expanded" class="p-6 border-t">
                <DualStepPersonal
                  :key="'personal-step-' + personalStepKey"
                  ref="stepPersonalRef"
                  v-model="formData.personal"
                  :careers="filteredCareersForInstitution"
                  :specialties="filteredSpecialtiesForInstitution"
                  :institution="{
                    id: formData.academico.id_institution,
                    name: institutions.find(i => i.id === formData.academico.id_institution)?.name || ''
                  }"
                  @update:careers="handleCareersUpdate"
                  @update:specialties="handleSpecialtiesUpdate"
                />
              </div>
            </transition>
          </div>

          <!-- Sección 3: Unidad Dual - Mostrar solo si reportaModeloDual es true -->
          <div v-if="reportaModeloDual" 
               class="border rounded-lg overflow-hidden transition-all duration-300"
               :class="section3Expanded ? 'border-blue-200 shadow-sm' : 'border-gray-200'"
               id="section-3">
            <!-- Encabezado de sección 3 -->
            <button
              @click="toggleSection(3)"
              class="w-full p-4 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-500 hover:to-brand-700 flex items-center justify-between transition-all duration-200"
              :disabled="isSection2Incomplete || globalLoading"
              :class="{ 'opacity-50 cursor-not-allowed': isSection2Incomplete || globalLoading }"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-white bg-opacity-20">
                  <span class="font-semibold text-white">3</span>
                </div>
                <div class="text-left">
                  <h3 class="text-lg font-semibold text-white">
                    Información de Unidad Dual
                  </h3>
                  <p class="text-sm text-white text-opacity-90 mt-1">
                    Detalles del proyecto y organización
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <div v-if="isSection3Incomplete" 
                     class="mr-3 flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  <ExclamationTriangleIcon class="h-3 w-3 mr-1" />
                  <span class="text-xs font-medium">Pendiente</span>
                </div>
                <div v-else-if="!isSection3Incomplete" 
                     class="mr-3 flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  <CheckCircleIcon class="h-3 w-3 mr-1" />
                  <span class="text-xs font-medium">Completo</span>
                </div>
                <ChevronDownIcon 
                  class="h-6 w-6 text-white transition-transform duration-300"
                  :class="{ 'transform rotate-180': section3Expanded }"
                />
              </div>
            </button>

            <!-- Contenido de sección 3 -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[2000px]"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-[2000px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-show="section3Expanded" class="p-6 border-t">
                <DualStepUnidad
                  ref="stepUnidadDualRef"
                  :key="'unidad-step-' + personalStepKey"
                  v-model="formData.unidadDual"
                  :areas="areas"
                  :clusters="clusters"
                  :agreementStatuses="agreementStatuses"
                  :supportTypes="supportTypes"
                  :organizations="organizations"
                  :dualTypes="dualTypes"
                  :microCredentials="microCredentials"
                  :certifications="certifications"
                  :diplomas="diplomas"
                  :benefitTypes="benefitTypes"
                  @update:organizations="handleOrganizationsUpdate"
                  @update:microCredentials="handleMicroCredentialsUpdate"
                  @update:certifications="handleCertificationsUpdate"
                  @update:diplomas="handleDiplomasUpdate"
                  @update:dualTypes="handleDualTypesUpdate"
                  @update:benefitTypes="handleBenefitTypesUpdate"
                />
              </div>
            </transition>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-between items-center pt-6 mt-8 border-t">
            <div class="text-sm text-gray-600">
              <span v-if="pendingSectionsCount > 0" class="text-yellow-600 font-medium">
                {{ pendingSectionsCount }} sección{{ pendingSectionsCount !== 1 ? 'es' : '' }} pendiente{{ pendingSectionsCount !== 1 ? 's' : '' }}
              </span>
              <span v-else class="text-green-600 font-medium">
                ✓ Todos los campos están completos
              </span>
            </div>
            <button
              :disabled="isSubmitting || !canSubmit || globalLoading"
              @click="submitForm"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              <CheckIcon class="h-5 w-5 mr-2" />
              {{ isSubmitting ? 'Guardando...' : buttonText }}
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>

    <!-- Indicador flotante de secciones pendientes -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="showFloatingIndicator && pendingSectionsCount > 0"
           class="fixed bottom-4 right-4 z-50">
        <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-4 flex items-center animate-pulse">
          <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
          <span class="text-sm font-medium">
            {{ pendingSectionsCount }} sección{{ pendingSectionsCount !== 1 ? 'es' : '' }} pendiente{{ pendingSectionsCount !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '../../components/layouts/AdminLayout.vue';
import PageBreadcrumb from '../../components/common/PageBreadcrumb.vue';
import ComponentCard from '../../components/common/componentCard.vue';
import DualStepPersonal from '../../components/forms/DualStepPersonal.vue';
import DualStepAcademico from '../../components/forms/DualStepAcademico.vue';
import DualStepUnidad from '../../components/forms/DualStepUnidad.vue';
import { 
  createDualProject, 
  updateDualProject, 
  showDualProject 
} from '../../services/dual_projects/dual_projects';
import { getInstitutions } from '../../services/institutions/institutions.js';
import { getCareers } from '../../services/institutions/careers.js';
import { getSpecialties } from '../../services/institutions/specialties.js';
import { getClusters } from '../../services/organizations/clusters.js';
import { getDualAreas } from '../../services/dual_projects/dual-areas.js';
import { getOrganizations } from '../../services/organizations/organizations.js';
import { getDocumentStatuses } from '../../services/dual_projects/documents-statuses.js';
import { getEconomicSupports } from '../../services/dual_projects/economic-supports.js';
import { getDualTypes } from '../../services/dual_projects/dual-types';
import { getMicroCredentials } from '../../services/dual_projects/micro-credentials';
import { getCertifications } from '../../services/dual_projects/certifications.js';
import { getDiplomas } from '../../services/dual_projects/diplomas.js';
import { getBenefitType } from '../../services/dual_projects/BenefitType';
import { 
  ArrowLeftIcon, 
  CheckIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/vue/24/solid'

const route = useRoute();
const router = useRouter();

// ==================== VARIABLES REACTIVAS PRINCIPALES ====================
const mode = ref('create');
const projectId = ref<number | null>(null);

// ==================== ESTADOS DE CARGA OPTIMIZADOS ====================
const globalLoading = ref(false);
const globalLoadingMessage = ref('Iniciando formulario...');
const loadingProgress = ref(0);
const isSubmitting = ref(false);
const reportaModeloDual = ref<boolean>(false);
const personalStepKey = ref(0);
const showFloatingIndicator = ref(false);

// ==================== ESTADO DE EXPANSIÓN DE SECCIONES ====================
const section1Expanded = ref(true);
const section2Expanded = ref(false);
const section3Expanded = ref(false);

// ==================== REFERENCIAS A COMPONENTES ====================
const stepAcademicoRef = ref();
const stepPersonalRef = ref();
const stepUnidadDualRef = ref();

// ==================== DATOS DEL FORMULARIO ====================
const formData = ref({
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
    period_observation: '',
    status_document: '',
    economic_support: '',
    amount: '0',
    qualification: '0',
    max_qualification: '10',
    is_concluded: 0,
    is_hired: 0,
    hired_observation: '',
    dual_type_id: '',
    micro_credentials: [],
    certifications: [],
    diplomas: [],
    benefitTypes: [],
    description: '',
    internal_advisor_name: '',
    internal_advisor_qualification: null,
    external_advisor_name: '',
    external_advisor_qualification: null,
  }
});

// ==================== DATOS PARA SELECTORES (CARGADOS POR LOTES) ====================
const institutions = shallowRef([]);
const careers = shallowRef([]);
const specialties = shallowRef([]);
const clusters = shallowRef([]);
const areas = shallowRef([]);
const agreementStatuses = shallowRef([]);
const supportTypes = shallowRef([]);
const organizations = shallowRef([]);
const dualTypes = shallowRef([]);
const microCredentials = shallowRef([]);
const certifications = shallowRef([]);
const diplomas = shallowRef([]);
const benefitTypes = shallowRef([]);

// ==================== FUNCIONES AUXILIARES ====================
const getModeFromRoute = (): string => {
  const path = route.path;
  if (path.includes('/modelo-dual/editar/')) return 'edit';
  if (path.includes('/modelo-dual/completar/')) return 'complete';
  if (path.includes('/modelo-dual/crear')) return 'create';
  return 'create';
};

const getPkFromRoute = (): number | null => {
  const path = route.path;
  const match = path.match(/\/(\d+)$/);
  return match && match[1] ? parseInt(match[1]) : null;
};

// ==================== COMPUTED PROPERTIES ====================
const isSection1Incomplete = computed(() => !formData.value.academico.id_institution);

const isSection2Incomplete = computed(() => {
  if (!reportaModeloDual.value) return false;
  return (formData.value.personal.dual_project_students?.length || 0) < 1;
});

const isSection3Incomplete = computed(() => {
  if (!reportaModeloDual.value) return false;
  return !formData.value.unidadDual.name_report || 
         !formData.value.unidadDual.id_organization || 
         !formData.value.unidadDual.id_dual_area;
});

const pendingSectionsCount = computed(() => {
  let count = 0;
  if (isSection1Incomplete.value) count++;
  if (reportaModeloDual.value && isSection2Incomplete.value) count++;
  if (reportaModeloDual.value && isSection3Incomplete.value) count++;
  return count;
});

const pageTitle = computed(() => {
  switch (mode.value) {
    case 'create': return 'Crear Proyecto Dual';
    case 'complete': return 'Completar Proyecto Dual';
    default: return 'Editar Proyecto Dual';
  }
});

const formTitle = computed(() => {
  const sections = reportaModeloDual.value ? '3 Secciones' : '1 Sección';
  return `${pageTitle.value} - ${sections}`;
});

const buttonText = computed(() => {
  switch (mode.value) {
    case 'create': return 'Guardar Proyecto Dual';
    case 'complete': return 'Completar Proyecto Dual';
    default: return 'Actualizar Proyecto Dual';
  }
});

const canSubmit = computed(() => {
  if (!formData.value.academico.id_institution) return false;
  if (reportaModeloDual.value === false) return true;
  
  const studentCount = formData.value.personal.dual_project_students?.length || 0;
  if (studentCount < 1) return false;
  
  return !(!formData.value.unidadDual.name_report || 
           !formData.value.unidadDual.id_organization || 
           !formData.value.unidadDual.id_dual_area);
});

const filteredCareersForInstitution = computed(() => {
  if (!formData.value.academico.id_institution || careers.value.length === 0) return [];
  
  const institutionId = formData.value.academico.id_institution;
  return careers.value.filter(career => {
    return career.id_institution === institutionId ||
           career.institution_id === institutionId ||
           career.institution?.id === institutionId;
  });
});

const filteredSpecialtiesForInstitution = computed(() => {
  if (!formData.value.academico.id_institution || specialties.value.length === 0) return [];
  
  const filteredCareers = filteredCareersForInstitution.value;
  const careerIds = new Set(filteredCareers.map(c => c.id));
  
  return specialties.value.filter(specialty => 
    careerIds.has(specialty.id_career) || 
    careerIds.has(specialty.career_id)
  );
});

// ==================== MÉTODOS DE CARGA OPTIMIZADOS ====================
const updateLoadingProgress = (increment: number) => {
  loadingProgress.value = Math.min(loadingProgress.value + increment, 100);
};

const loadEssentialDependencies = async () => {
  globalLoadingMessage.value = 'Cargando datos básicos...';
  updateLoadingProgress(10);
  
  try {
    // Cargar solo lo esencial primero - con timeout para evitar bloqueos
    const [institutionsRes, organizationsRes] = await Promise.all([
      getInstitutions(),
      getOrganizations()
    ]);
    
    institutions.value = institutionsRes.data;
    organizations.value = organizationsRes.data;
    updateLoadingProgress(30);
    
    return true;
  } catch (error) {
    console.error('Error cargando dependencias esenciales:', error);
    return false;
  }
};

const loadSecondaryDependencies = async () => {
  globalLoadingMessage.value = 'Cargando datos adicionales...';
  
  try {
    // Cargar en lotes con delays estratégicos
    const batch1 = await Promise.all([
      getCareers(),
      getSpecialties(),
      getClusters()
    ]);
    
    careers.value = batch1[0].data;
    specialties.value = batch1[1].data;
    clusters.value = batch1[2].data;
    updateLoadingProgress(15);
    
    // Pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const batch2 = await Promise.all([
      getDualAreas(),
      getDocumentStatuses(),
      getEconomicSupports()
    ]);
    
    areas.value = batch2[0].data;
    agreementStatuses.value = batch2[1].data;
    supportTypes.value = batch2[2].data;
    updateLoadingProgress(15);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const batch3 = await Promise.all([
      getDualTypes(),
      getMicroCredentials()
    ]);
    
    dualTypes.value = batch3[0].data;
    microCredentials.value = batch3[1].data;
    updateLoadingProgress(10);
    
    // Cargar datos menos críticos en segundo plano
    setTimeout(async () => {
      try {
        const [certRes, diplomaRes, benefitRes] = await Promise.all([
          getCertifications(),
          getDiplomas(),
          getBenefitType()
        ]);
        
        certifications.value = certRes.data;
        diplomas.value = diplomaRes.data;
        benefitTypes.value = benefitRes.data;
        updateLoadingProgress(20);
      } catch (error) {
        console.warn('Error cargando datos opcionales:', error);
        // No fallamos si los datos opcionales no cargan
      }
    }, 500);
    
    return true;
  } catch (error) {
    console.error('Error cargando dependencias secundarias:', error);
    // Continuamos aunque falle parcialmente
    return true;
  }
};

const loadExistingData = async () => {
  if (!projectId.value) return;
  
  globalLoadingMessage.value = 'Cargando datos del proyecto...';
  
  try {
    const res = await showDualProject(projectId.value);
    const project = res.data;

    // 1. Datos personales
    formData.value.personal = {
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
      formData.value.personal.control_number = firstStudent.control_number || '';
      formData.value.personal.name_student = firstStudent.name || '';
      formData.value.personal.lastname = firstStudent.lastname || '';
      formData.value.personal.gender = firstStudent.gender || '';
      formData.value.personal.semester = firstStudent.semester || '';
      formData.value.personal.id_career = firstStudent.id_career || '';
      formData.value.personal.id_specialty = firstStudent.id_specialty || '';
    }

    // 2. Datos académicos
    formData.value.academico = {
      id_institution: project.id_institution ?? '',
    };

    // 3. Datos unidad dual - asegurar que benefitTypes tenga formato correcto
    const benefitTypesData = project.dual_project_reports?.benefit_types || [];
    const formattedBenefitTypes = Array.isArray(benefitTypesData) 
      ? benefitTypesData.map(b => ({
          id: b.id || b.pivot?.id,
          quantity: b.pivot?.quantity || 1
        }))
      : [];

    formData.value.unidadDual = {
      name_report: project.dual_project_reports?.name ?? '',
      id_organization: project.organization_dual_projects?.organization?.id ?? '',
      id_dual_area: project.dual_project_reports?.dual_area?.id ?? '',
      period_start: project.dual_project_reports?.period_start ?? '',
      period_end: project.dual_project_reports?.period_end ?? '',
      period_observation: project.dual_project_reports?.period_observation ?? '',
      status_document: project.dual_project_reports?.status_document?.id ?? '',
      economic_support: project.dual_project_reports?.economic_support?.id ?? '',
      amount: String(project.dual_project_reports?.amount ?? ''),
      qualification: project.dual_project_reports?.qualification ?? '',
      is_concluded: project.dual_project_reports?.is_concluded ?? 0,
      is_hired: project.dual_project_reports?.is_hired ?? 0,
      hired_observation: project.dual_project_reports?.hired_observation ?? '',
      dual_type_id: project.dual_project_reports?.dual_type?.id ?? '',
      max_qualification: project.dual_project_reports?.max_qualification ?? '',
      micro_credentials: project.dual_project_reports?.micro_credentials?.map(m => m.id) || [],
      certifications: project.dual_project_reports?.certifications?.map(c => c.id) || [],
      diplomas: project.dual_project_reports?.diplomas?.map(d => d.id) || [],
      benefitTypes: formattedBenefitTypes,
      description: project.dual_project_reports?.description ?? '',
      internal_advisor_name: project.dual_project_reports?.internal_advisor_name ?? '',
      internal_advisor_qualification: project.dual_project_reports?.internal_advisor_qualification ?? null,
      external_advisor_name: project.dual_project_reports?.external_advisor_name ?? '',
      external_advisor_qualification: project.dual_project_reports?.external_advisor_qualification ?? null,
    };

    // 4. Determinar si reporta modelo dual
    reportaModeloDual.value = mode.value === 'complete' ? true : !!project.dual_project_reports;
    
    // 5. Forzar actualización de componentes
    personalStepKey.value++;
    updateLoadingProgress(10);
    
  } catch (error) {
    console.error('Error cargando datos del proyecto:', error);
    throw error;
  }
};

// ==================== MÉTODOS PRINCIPALES ====================
const toggleSection = (sectionNumber: number) => {
  if (globalLoading.value) return;
  
  if (sectionNumber === 2 && isSection1Incomplete.value) return;
  if (sectionNumber === 3 && isSection2Incomplete.value) return;

  switch (sectionNumber) {
    case 1: 
      section1Expanded.value = !section1Expanded.value; 
      break;
    case 2: 
      if (reportaModeloDual.value) section2Expanded.value = !section2Expanded.value; 
      break;
    case 3: 
      if (reportaModeloDual.value) section3Expanded.value = !section3Expanded.value; 
      break;
  }
};

const validateForm = async () => {
  if (stepAcademicoRef.value?.validate) {
    const academicValid = await stepAcademicoRef.value.validate();
    if (!academicValid) {
      await nextTick();
      return false;
    }
  }

  if (reportaModeloDual.value === false) return true;

  if (reportaModeloDual.value && stepPersonalRef.value?.validate) {
    const personalValid = await stepPersonalRef.value.validate();
    if (!personalValid) {
      await nextTick();
      return false;
    }

    if ((formData.value.personal.dual_project_students?.length || 0) < 1) {
      await Swal.fire({
        icon: 'warning',
        title: 'Estudiantes requeridos',
        text: 'Debes agregar al menos 1 estudiante.',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }
  }

  if (reportaModeloDual.value && stepUnidadDualRef.value?.validate) {
    const unidadValid = await stepUnidadDualRef.value.validate();
    if (!unidadValid) {
      await nextTick();
      return false;
    }
  }

  return true;
};

const formatDate = (date: string | Date | null): string => {
  if (!date) return '';
  try {
    return new Date(date).toISOString().slice(0, 10);
  } catch {
    return '';
  }
};

const submitForm = async () => {
  if (isSubmitting.value || globalLoading.value) return;

  try {
    const isValid = await validateForm();
    if (!isValid) return;
  } catch (error) {
    console.error('Error en validación:', error);
    return;
  }

  if (!canSubmit.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor completa todas las secciones obligatorias',
      confirmButtonColor: '#3085d6',
    });
    return;
  }

  isSubmitting.value = true;
  globalLoadingMessage.value = mode.value === 'create' ? 'Creando proyecto...' : 'Actualizando proyecto...';
  loadingProgress.value = 0;

  try {
    let payload: Record<string, any>;

    if (reportaModeloDual.value === false) {
      payload = {
        has_report: 0,
        id_institution: Number(formData.value.academico.id_institution)
      };
    } else {
      const studentCount = formData.value.personal.dual_project_students?.length || 0;

      const studentsPayload = formData.value.personal.dual_project_students.map(student => ({
        control_number: student.student?.control_number || student.control_number,
        name_student: student.student?.name || student.name_student,
        lastname: student.student?.lastname || student.lastname,
        gender: student.student?.gender || student.gender,
        semester: student.student?.semester || student.semester,
        id_career: student.student?.id_career || student.id_career,
        id_specialty: student.student?.id_specialty || student.id_specialty || null,
        id_institution: Number(formData.value.academico.id_institution)
      }));

      // Formatear benefitTypes correctamente
      const formattedBenefitTypes = Array.isArray(formData.value.unidadDual.benefitTypes) 
        ? formData.value.unidadDual.benefitTypes
            .filter(b => b && b.id)
            .map(b => ({
              id: Number(b.id),
              quantity: Number(b.quantity || 1)
            }))
        : [];

      payload = {
        has_report: 1,
        id_institution: Number(formData.value.academico.id_institution),
        number_student: studentCount,
        students: studentsPayload,
        name_report: formData.value.unidadDual.name_report,
        id_organization: Number(formData.value.unidadDual.id_organization),
        id_dual_area: Number(formData.value.unidadDual.id_dual_area),
        period_start: formatDate(formData.value.unidadDual.period_start),
        period_end: formatDate(formData.value.unidadDual.period_end),
        period_observation: formData.value.unidadDual.period_observation || '',
        status_document: Number(formData.value.unidadDual.status_document),
        economic_support: Number(formData.value.unidadDual.economic_support),
        amount: Number(formData.value.unidadDual.amount) || 0,
        qualification: Number(formData.value.unidadDual.qualification) || null,
        max_qualification: String(formData.value.unidadDual.max_qualification) || '10',
        is_concluded: Number(formData.value.unidadDual.is_concluded) || 0,
        is_hired: Number(formData.value.unidadDual.is_hired) || 0,
        hired_observation: formData.value.unidadDual.hired_observation || '',
        dual_type_id: Number(formData.value.unidadDual.dual_type_id),
        description: formData.value.unidadDual.description || '',
        micro_credentials: formData.value.unidadDual.micro_credentials || [],
        certifications: formData.value.unidadDual.certifications || [],
        diplomas: formData.value.unidadDual.diplomas || [],
        benefit_types: formattedBenefitTypes,
        internal_advisor_name: formData.value.unidadDual.internal_advisor_name || '',
        internal_advisor_qualification: Number(formData.value.unidadDual.internal_advisor_qualification) || null,
        external_advisor_name: formData.value.unidadDual.external_advisor_name || '',
        external_advisor_qualification: Number(formData.value.unidadDual.external_advisor_qualification) || null,
      };
    }

    if (mode.value === 'create') {
      await createDualProject(payload);
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Proyecto dual creado correctamente',
        confirmButtonColor: '#3085d6',
      });
    } else {
      await updateDualProject(projectId.value!, payload);
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Proyecto dual actualizado correctamente',
        confirmButtonColor: '#3085d6',
      });
    }
    
    router.push('/form-elements');
    
  } catch (err: any) {
    console.error('Error al guardar:', err);
    
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join('<br>');
        errorMessage = errorMessages;
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      }
    }
    
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      html: errorMessage,
      confirmButtonColor: '#3085d6',
    });
  } finally {
    isSubmitting.value = false;
    loadingProgress.value = 100;
  }
};

// ==================== HANDLERS ====================
const handleCareersUpdate = async () => {
  try {
    const response = await getCareers();
    careers.value = response.data;
  } catch (error) {
    console.error('Error al recargar carreras:', error);
  }
};

const handleSpecialtiesUpdate = async () => {
  try {
    const response = await getSpecialties();
    specialties.value = response.data;
  } catch (error) {
    console.error('Error al recargar especialidades:', error);
  }
};

const handleInstitutionsUpdate = (newInstitutions: any[]) => {
  institutions.value = newInstitutions;
};

const handleOrganizationsUpdate = (newOrganizations: any[]) => {
  organizations.value = newOrganizations;
};

const handleMicroCredentialsUpdate = (newMicroCredentials: any[]) => {
  microCredentials.value = newMicroCredentials;
};

const handleDiplomasUpdate = (newDiplomas: any[]) => {
  diplomas.value = newDiplomas;
};

const handleCertificationsUpdate = (newCertifications: any[]) => {
  certifications.value = newCertifications;
};

const handleBenefitTypesUpdate = (newBenefitTypes: any[]) => {
  benefitTypes.value = newBenefitTypes;
};

const handleDualTypesUpdate = (newDualTypes: any[]) => {
  dualTypes.value = newDualTypes;
};

const goBackToList = () => {
  router.push('/form-elements');
};

const handleScroll = () => {
  const formContainer = document.getElementById('form-container');
  if (formContainer) {
    const scrollPosition = window.scrollY + window.innerHeight;
    const formBottom = formContainer.offsetTop + formContainer.offsetHeight;
    showFloatingIndicator.value = pendingSectionsCount.value > 0 && scrollPosition < formBottom - 200;
  }
};

// ==================== WATCHERS OPTIMIZADOS ====================
watch(reportaModeloDual, (newValue) => {
  if (newValue && !globalLoading.value) {
    setTimeout(() => {
      if (!isSection1Incomplete.value && !section2Expanded.value) {
        section2Expanded.value = true;
      }
    }, 100);
  } else if (!newValue) {
    section2Expanded.value = false;
    section3Expanded.value = false;
  }
});

watch(() => formData.value.academico.id_institution, (newValue) => {
  if (newValue && reportaModeloDual.value && !section2Expanded.value && !globalLoading.value) {
    setTimeout(() => {
      section2Expanded.value = true;
    }, 50);
  }
});

watch(() => formData.value.personal.dual_project_students?.length, (newValue) => {
  if (newValue && newValue >= 1 && reportaModeloDual.value && !section3Expanded.value && !globalLoading.value) {
    setTimeout(() => {
      section3Expanded.value = true;
    }, 50);
  }
});

watch(pendingSectionsCount, (newCount) => {
  showFloatingIndicator.value = newCount > 0;
});

// ==================== LIFECYCLE HOOKS OPTIMIZADOS ====================
onMounted(async () => {
  // 1. Establecer modo y ID inmediatamente
  mode.value = getModeFromRoute();
  projectId.value = getPkFromRoute();
  
  // 2. Activar loading GLOBAL inmediatamente
  globalLoading.value = true;
  globalLoadingMessage.value = 'Preparando formulario...';
  loadingProgress.value = 0;
  
  try {
    // 3. Cargar dependencias esenciales primero
    const essentialLoaded = await loadEssentialDependencies();
    if (!essentialLoaded) {
      throw new Error('No se pudieron cargar los datos esenciales');
    }
    
    // 4. Si es modo edición/completar, cargar datos del proyecto
    if ((mode.value === 'edit' || mode.value === 'complete') && projectId.value) {
      await loadExistingData();
    }
    
    // 5. Cargar dependencias secundarias en segundo plano
    setTimeout(async () => {
      try {
        await loadSecondaryDependencies();
        
        // 6. Completar carga
        setTimeout(() => {
          globalLoadingMessage.value = '¡Listo!';
          loadingProgress.value = 100;
          
          // 7. Pequeño delay para mostrar el 100%
          setTimeout(() => {
            globalLoading.value = false;
          }, 300);
        }, 500);
        
      } catch (error) {
        console.warn('Error en carga secundaria:', error);
        // Continuamos aunque falle parcialmente
        globalLoading.value = false;
      }
    }, 300);
    
  } catch (error) {
    console.error('Error inicializando formulario:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error de carga',
      text: 'No se pudieron cargar los datos necesarios',
      confirmButtonColor: '#3085d6',
    });
    goBackToList();
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.btn {
  @apply px-5 py-2 rounded-lg font-medium transition-all duration-200;
}

/* Animaciones mejoradas */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

/* Optimizaciones de rendimiento */
.transition-all {
  will-change: transform, opacity, max-height;
}

/* Mejoras visuales */
.border-gradient {
  border-image: linear-gradient(to right, #3b82f6, #8b5cf6) 1;
}

/* Scroll suave */
#form-container {
  scroll-behavior: smooth;
}
</style>