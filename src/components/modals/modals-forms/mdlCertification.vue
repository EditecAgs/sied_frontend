<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { VTooltip } from 'floating-vue'
import 'floating-vue/dist/style.css'
import { showCertification } from "../../../services/dual_projects/certifications.js"

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)
const errorMessage = ref<string>('')

const alvRoute = ref()
alvRoute.value = axios.defaults.baseURL + 'certifications'
const alvMethod = ref<'POST' | 'PUT'>('POST')

// Eliminamos la lógica manual de tooltips y usamos floating-vue
const vTooltip = VTooltip

const fieldHelpTexts: Record<string, string> = {
	name: "Nombre oficial de la certificación.",
	organization: "Nombre de la organización, empresa o institución que emite el certificado.",
	description: "Breve descripción del contenido o propósito del certificado.",
	image: "Imagen o logotipo representativo del certificado.",
	type: "Tipo de certificación: Académico o No Académico.",
	hours: "Número de horas que representa la certificación."
}

// Eliminamos todas las funciones de tooltip manuales
// ya que floating-vue se encargará de esto

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
	organization: '',
	description: '',
	image: '',
	type: '',
	hours: ''
})

const handleImageUpload = (event: Event) => {
	const target = event.target as HTMLInputElement
	const file = target.files?.[0]
	if (!file) return

	const reader = new FileReader()
	reader.onload = (e) => {
		form.image = e.target?.result as string
	}
	reader.readAsDataURL(file)
}

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}certifications/${props.data.pk}`
		alvMethod.value = 'PUT'
		isLoading.value = true

		showCertification(props.data.pk)
			.then((res) => {
				const cert = res.data
				Object.keys(form).forEach((key) => {
					if (cert[key] !== undefined) {
						form[key as keyof typeof form] = cert[key]
					}
				})
				if (!form.image) {
					form.image = 'images/insignia.jpg';
				}
			})
			.catch((error) => {
				console.error('Error al cargar la certificación:', error)
			})
			.finally(() => {
				isLoading.value = false
			})
	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}certifications`
		alvMethod.value = 'POST'
		Object.keys(form).forEach((key) => {
			form[key as keyof typeof form] = ''
		})
	}
})

const afterDone = (response: any) => {
	console.log(response.data + ' guardado exitosamente')
	errorMessage.value = ''
	emit('saved')
	emit('close')
}

const afterError = (error: any) => {
	if (error.response?.status === 422) {
		errorMessage.value = error.response?.data?.message || 'Algunos campos no son válidos'
	} else {
		errorMessage.value = error.message || 'Ocurrió un error inesperado'
	}
	console.error('Error al enviar:', error.response?.data || error.message)
}
</script>

<template>
	<transition name="fade-scale">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			style="margin-top: 0px"
			@click.self="emit('close')">
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[85vh] flex flex-col overflow-hidden"
				style="background-image: url('/images/background/bg-white-flores.png');">
				<div
					class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear Certificación` : `Editar Certificación` }}
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
					id="CertificationForm"
					:action="alvRoute"
					:data-object="form"
					:method="alvMethod"
					class="flex-grow overflow-y-auto pr-2"
					@after-done="afterDone"
					@after-error="afterError">
					<div
						v-if="errorMessage"
						class="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
						{{ errorMessage }}
					</div>

					<div class="grid grid-cols-1 gap-4 mb-6 mt-5">
						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Nombre*
								<button
									v-tooltip="fieldHelpTexts.name"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<input
								v-model="form.name" type="text" name="name" required
								class="w-full px-3 py-2 border rounded-md" :disabled="isLoading" />
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Organización*
								<button
									v-tooltip="fieldHelpTexts.organization"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<input
								v-model="form.organization" type="text" name="organization" required
								class="w-full px-3 py-2 border rounded-md" :disabled="isLoading" />
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Descripción
								<button
									v-tooltip="fieldHelpTexts.description"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<textarea
								v-model="form.description" name="description" rows="3"
								class="w-full px-3 py-2 border rounded-md" :disabled="isLoading" />
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Tipo
								<button
									v-tooltip="fieldHelpTexts.type"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<select
								v-model="form.type"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-brand-900 focus:outline-none">
								<option value="academic">Académico</option>
								<option value="no_academic">No Académico</option>
							</select>
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Horas
								<button
									v-tooltip="fieldHelpTexts.hours"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<input
								v-model="form.hours"
								type="number"
								name="hours"
								min="0"
								class="w-full px-3 py-2 border rounded-md"
								:disabled="isLoading" />
						</div>

						<div class="form-error">
							<label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
								Insignia
								<button
									v-tooltip="fieldHelpTexts.image"
									type="button"
									class="help-icon text-gray-400 hover:text-brand-600 cursor-help">?</button>
							</label>
							<input
								type="file" accept="image/*"
								class="w-full px-3 py-2 border rounded-md"
								:disabled="isLoading"
								@change="handleImageUpload" />
							<div v-if="form.image" class="mt-3">
								<img :src="form.image" alt="Preview" class="max-h-40 rounded shadow-md" />
							</div>
						</div>
					</div>
				</alv-form>

				<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-transparent z-10">
					<button type="button" class="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" :disabled="isLoading" @click="emit('close')">
						Cancelar
					</button>
					<button form="CertificationForm" class="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold" :disabled="isLoading">
						<span>Guardar</span>
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

.help-icon {
	@apply w-4 h-4 flex items-center justify-center rounded-full border border-current text-xs font-bold;
}
</style>