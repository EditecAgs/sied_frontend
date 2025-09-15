<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted } from 'vue'
import axios from 'axios'
import { showStudent } from '../../../services/dual_projects/students.js'
import { getInstitutions } from '../../../services/institutions/institutions.js'
import { getCareers } from '../../../services/institutions/careers.js'
import { getSpecialties } from '../../../services/institutions/specialties.js'

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)
const alvRoute = ref('')
const alvMethod = ref<'POST' | 'PUT'>('POST')

// ✅ Manejo de respuestas
const afterDone = (response) => {
	console.log(response.data + ' guardado exitosamente')
	emit('saved')
	emit('close')
}

const afterError = (response) => {
	console.log('Error al enviar:', response.response?.data || response.message)
}

const props = defineProps<{
	show: boolean
	data: {
		mode: 'create' | 'edit'
		pk: number | null
		table: string
	}
}>()

const form = reactive({
	control_number: '',
	name: '',
	lastname: '',
	gender: '',
	semester: '',
	id_institution: '',
	id_career: '',
	id_specialty: ''
})

const institutions = ref([])
const careers = ref([])
const specialties = ref([])

const LoadDependences = async () => {
	try {
		const [institutionsResp, careersResp, specialtiesResp] = await Promise.all([
			getInstitutions(),
			getCareers(),
			getSpecialties()
		])
		institutions.value = institutionsResp.data
		careers.value = careersResp.data
		specialties.value = specialtiesResp.data
	} catch (err) {
		console.error('Error load dependences:', err)
	}
}

onMounted(() => {
	LoadDependences()
})

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}students/${props.data.pk}`
		alvMethod.value = 'PUT'
		isLoading.value = true

		showStudent(props.data.pk).then(res => {
			const student = res.data
			Object.keys(form).forEach(key => {
				if (student[key] !== undefined) {
					form[key] = student[key]
				}
			})
		}).finally(() => {
			isLoading.value = false
		})
	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}students`
		alvMethod.value = 'POST'
		Object.keys(form).forEach(key => {
			form[key] = ''
		})
	}
})
</script>

<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style="margin-top: 0px" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative max-h-[85vh] flex flex-col overflow-hidden">

				<div class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
					</h4>
					<div class="flex items-center gap-4">
						<div v-if="isLoading" class="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />
						<button class="text-white/80 hover:text-white" @click="emit('close')">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				<alv-form
					id="StudentForm"
					:action="alvRoute"
					:data-object="form"
					:input-parent-selector="'.form-error'"
					:method="alvMethod"
					:enable-button-on-done="true"
					:spinner="true"
					class="flex-grow overflow-y-auto pr-2"
					@after-done="afterDone"
					@after-error="afterError">

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Número de control*</label>
							<input v-model="form.control_number" name="control_number" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
							<input v-model="form.name" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Apellido*</label>
							<input v-model="form.lastname" name="lastname" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Género*</label>
							<select v-model="form.gender" name="gender" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="">Seleccione</option>
								<option value="Masculino">Masculino</option>
								<option value="Femenino">Femenino</option>
								<option value="Otro">Otro</option>
							</select>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Semestre*</label>
							<input v-model="form.semester" name="semester" type="number" min="1" max="12" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Institución*</label>
							<select v-model="form.id_institution" name="id_institution" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="">Seleccione una institución</option>
								<option v-for="inst in institutions" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
							</select>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Carrera*</label>
							<select v-model="form.id_career" name="id_career" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="">Seleccione una carrera</option>
								<option v-for="car in careers" :key="car.id" :value="car.id">{{ car.name }}</option>
							</select>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Especialidad*</label>
							<select v-model="form.id_specialty" name="id_specialty" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
								<option value="">Seleccione una especialidad</option>
								<option v-for="esp in specialties" :key="esp.id" :value="esp.id">{{ esp.name }}</option>
							</select>
						</div>
					</div>

					<!-- Botones -->
					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
						<button type="button" class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200" @click="emit('close')">
							Cancelar
						</button>
						<button form="StudentForm" class="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110">
							Guardar
						</button>
					</div>
				</alv-form>
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
