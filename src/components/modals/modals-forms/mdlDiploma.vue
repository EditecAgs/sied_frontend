<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { VTooltip } from 'floating-vue'
import 'floating-vue/dist/style.css'
import { showDiplomas } from "../../../services/dual_projects/diplomas";

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)
const errorMessage = ref<string>('')

const alvRoute = ref()
alvRoute.value = axios.defaults.baseURL + 'diplomas'
const alvMethod = ref<'POST' | 'PUT'>('POST')

const vTooltip = VTooltip

const fieldHelpTexts: Record<string, string> = {
	name: "Nombre oficial del diplomado.",
	organization: "Nombre de la organización que emite el diplomado.",
	description: "Descripción breve del diplomado.",
	image: "Imagen o logotipo relacionado con el diplomado.",
	type: "Tipo de diplomado: Académico o No Académico.",
	hours: "Número de horas que representa el diplomado."
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
		alvRoute.value = `${axios.defaults.baseURL}diplomas/${props.data.pk}`
		alvMethod.value = 'PUT'
		isLoading.value = true

		showDiplomas(props.data.pk)
			.then((res) => {
				const dp = res.data
				Object.keys(form).forEach((key) => {
					if (dp[key] !== undefined) {
						form[key as keyof typeof form] = dp[key]
					}
				})
				if (!form.image) {
					form.image = 'images/insignia.jpg';
				}
			})
			.catch((error) => {
				console.error('Error al cargar el diplomado:', error)
			})
			.finally(() => {
				isLoading.value = false
			})
	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}diplomas`
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
				class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] flex flex-col overflow-hidden"
				style="background-image: url('/images/background/bg-white-flores.png');">
				<div
					class="flex items-center justify-between bg-brand-900 -mx-8 -mt-8 px-8 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">
						{{ data.mode === 'create' ? `Crear Diplomado` : `Editar Diplomado` }}
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
					id="DiplomaForm"
					:action="alvRoute"
					:data-object="form"
					:method="alvMethod"
					class="flex-grow overflow-y-auto pr-2"
					@after-done="afterDone"
					@after-error="afterError">
					<div
						v-if="errorMessage"
						class="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
						{{ errorMessage }}
					</div>

					<div class="space-y-8 mt-5">
						<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
							<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
								<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">1</span>
								Información Básica
							</h3>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label class="label flex items-center gap-1">
										Nombre
										<span class="text-red-500">*</span>
										<button
											v-tooltip="fieldHelpTexts.name"
											type="button"
											class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
											?
										</button>
									</label>
									<input
										v-model="form.name"
										type="text"
										name="name"
										required
										class="input"
										:disabled="isLoading"
										placeholder="Ingresa el nombre del diplomado" />
								</div>

								<div>
									<label class="label flex items-center gap-1">
										Organización
										<span class="text-red-500">*</span>
										<button
											v-tooltip="fieldHelpTexts.organization"
											type="button"
											class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
											?
										</button>
									</label>
									<input
										v-model="form.organization"
										type="text"
										name="organization"
										required
										class="input"
										:disabled="isLoading"
										placeholder="Nombre de la organización emisora" />
								</div>

								<div class="md:col-span-2">
									<label class="label flex items-center gap-1">
										Descripción
										<button
											v-tooltip="fieldHelpTexts.description"
											type="button"
											class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
											?
										</button>
									</label>
									<textarea
										v-model="form.description"
										name="description"
										rows="3"
										class="input min-h-[100px]"
										:disabled="isLoading"
										placeholder="Describe el propósito y contenido del diplomado" />
								</div>
							</div>
						</div>
						
						<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
							<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
								<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">2</span>
								Detalles
							</h3>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label class="label flex items-center gap-1">
										Tipo
										<button
											v-tooltip="fieldHelpTexts.type"
											type="button"
											class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
											?
										</button>
									</label>
									<select
										v-model="form.type"
										class="input">
										<option value="" disabled selected>Selecciona el tipo</option>
										<option value="academic">Académico</option>
										<option value="no_academic">No Académico</option>
									</select>
								</div>

								<div>
									<label class="label flex items-center gap-1">
										Horas
										<button
											v-tooltip="fieldHelpTexts.hours"
											type="button"
											class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
											?
										</button>
									</label>
									<input
										v-model="form.hours"
										type="number"
										name="hours"
										min="0"
										class="input"
										:disabled="isLoading"
										placeholder="Número de horas" />
								</div>
							</div>
						</div>
						
						<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
							<h3 class="text-lg font-semibold text-brand-800 mb-4 flex items-center">
								<span class="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 text-sm mr-2">3</span>
								Imagen
							</h3>

							<div>
								<label class="label flex items-center gap-1">
									Imagen del diplomado
									<button
										v-tooltip="fieldHelpTexts.image"
										type="button"
										class="help-icon text-gray-400 hover:text-brand-600 cursor-help transition-colors">
										?
									</button>
								</label>
								<input
									type="file"
									accept="image/*"
									class="input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
									:disabled="isLoading"
									@change="handleImageUpload" />

								<div v-if="form.image" class="mt-4 flex flex-col items-center">
									<p class="text-sm text-gray-600 mb-2">Vista previa:</p>
									<img :src="form.image" alt="Preview" class="max-h-32 rounded-lg shadow-md border border-gray-200" />
								</div>

								<div v-else class="mt-4 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
									<svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<p class="text-sm text-gray-500">Selecciona una imagen para el diplomado</p>
								</div>
							</div>
						</div>
					</div>
				</alv-form>

				<div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 sticky bottom-0 bg-white/95 backdrop-blur-sm z-10 rounded-b-2xl -mx-8 -mb-8 px-8 py-4">
					<button
						type="button"
						class="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors border border-gray-300"
						:disabled="isLoading"
						@click="emit('close')">
						Cancelar
					</button>
					<button
						form="DiplomaForm"
						class="px-8 py-3 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:from-brand-600 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
						:disabled="isLoading">
						<span class="flex items-center gap-2">
							<svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
							</svg>
							{{ isLoading ? 'Guardando...' : 'Guardar Diplomado' }}
						</span>
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

.label {
	@apply block text-sm font-medium text-gray-700 mb-2;
}
.input {
	@apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors;
}
.help-icon {
	@apply w-4 h-4 flex items-center justify-center rounded-full border border-current text-xs font-bold transition-colors;
}

/* Personalización del scroll */
::-webkit-scrollbar {
	width: 6px;
}

::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 3px;
}

::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}
</style>