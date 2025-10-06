<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { getCareers } from '../../../services/institutions/careers'
import { getInstitutions } from '../../../services/institutions/institutions'
import { showSpecialty } from '../../../services/institutions/specialties'

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)
const alvRoute = ref('')
const alvMethod = ref<'POST' | 'PUT'>('POST')

const careers = ref<any[]>([])
const institutions = ref<any[]>([])

const filteredCareers = computed(() => {
	if (!form.id_institution) {
		return careers.value;
	}

	const institutionId = parseInt(form.id_institution);
	return careers.value.filter(career =>
		career.id_institution === institutionId
	);
});


const hasCareersForInstitution = computed(() => {
	if (!form.id_institution) return true;
	return filteredCareers.value.length > 0;
});

const afterDone = (response: any) => {
	console.log(response.data + ' guardado exitosamente')
	emit('saved')
	emit('close')
}

const afterError = (error: any) => {
	console.log('Error al enviar:', error.response?.data || error.message)
}

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean
	data: {
		mode: 'create' | 'edit'
		pk: number | null
		table: string
	}
}>()

const form = reactive({
	id: '',
	name: '',
	id_institution: '',
	id_career: ''
})


watch(() => form.id_institution, (newInstitutionId, oldInstitutionId) => {
	if (newInstitutionId !== oldInstitutionId) {
		if (form.id_career) {
			const currentCareer = filteredCareers.value.find(career =>
				career.id === parseInt(form.id_career)
			);
			if (!currentCareer) {
				form.id_career = '';
			}
		}
	}
});

const loadSelectData = async () => {
	try {
		const [{ data: careersData }, { data: institutionsData }] = await Promise.all([
			getCareers(),
			getInstitutions()
		])
		careers.value = careersData
		institutions.value = institutionsData
	} catch (error) {
		console.error('Error cargando opciones:', error)
	}
}

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}specialties/${props.data.pk}`
		alvMethod.value = 'PUT'
		isLoading.value = true

		showSpecialty(props.data.pk).then(res => {
			const specialty = res.data
			Object.keys(form).forEach(key => {
				if (specialty[key] !== undefined) {
					form[key] = specialty[key]
				}
			})
		}).catch(error => {
			console.error('Error al cargar la especialidad:', error)
		}).finally(() => {
			isLoading.value = false
		})

	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}specialties`
		alvMethod.value = 'POST'

		Object.keys(form).forEach(key => {
			form[key] = ''
		})
	}
})

onMounted(() => {
	loadSelectData()
})
</script>

<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style="margin-top: 0px" @click.self="emit('close')">
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[85vh] flex flex-col overflow-hidden"
				style="background-image: url('/images/background/bg-white-flores.png');">
				<div class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
					</h4>

					<div class="flex items-center gap-4">
						<div
							v-if="isLoading"
							class="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />

						<button
							class="text-white/80 hover:text-white text-2xl font-bold leading-none"
							@click="emit('close')">
							&times;
						</button>
					</div>
				</div>

				<alv-form
					id="SpecialtyForm"
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
							<label class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<input
									v-model="form.name"
									type="text"
									name="name"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading" />
							</template>
						</div>

						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Carrera*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<select
									v-model="form.id_career"
									name="id_career"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading || !hasCareersForInstitution">
									<option value="">
										{{ form.id_institution && !hasCareersForInstitution
											? 'No hay carreras disponibles'
											: 'Seleccione carrera'
										}}
									</option>
									<option
										v-for="career in filteredCareers"
										:key="career.id"
										:value="career.id">
										{{ career.name }}
									</option>
								</select>
								<div
									v-if="form.id_institution && !hasCareersForInstitution"
									class="text-sm text-red-600 mt-1">
									⚠️ La institución seleccionada no tiene carreras disponibles
								</div>
								<div
									v-else-if="form.id_institution && form.id_career && filteredCareers.length > 0"
									class="text-sm text-green-600 mt-1">
									✓ {{ filteredCareers.length }} carrera(s) disponible(s)
								</div>
							</template>
						</div>

						<div class="form-error md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-1">Institución*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse w-full" />
							</template>
							<template v-else>
								<select
									v-model="form.id_institution"
									name="id_institution"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800"
									:disabled="isLoading">
									<option value="">Seleccione institución</option>
									<option v-for="inst in institutions" :key="inst.id" :value="inst.id">
										{{ inst.name }}
									</option>
								</select>
								<div
									v-if="form.id_institution"
									class="text-sm text-gray-600 mt-1">
									Al seleccionar una institución, solo verás sus carreras disponibles
								</div>
							</template>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-transparent z-10">
						<button
							type="button"
							class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
							:disabled="isLoading"
							@click="emit('close')">
							Cancelar
						</button>
						<button
							form="SpecialtyForm"
							class="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110 transition shadow-md"
							:disabled="isLoading || (form.id_institution && !hasCareersForInstitution)">
							<span v-if="data.mode !== 'create'">💾</span>
							<span>Guardar</span>
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