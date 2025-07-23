
<script setup lang="ts">
import { defineProps, defineEmits, reactive, watchEffect, ref, onMounted } from 'vue'
import axios from 'axios'
import {getAcademicPeriodById} from "../../services/institutions/academic-periods"

const emit = defineEmits(['close', 'saved'])
const isLoading = ref(false)

const alvRoute = ref()
const alvMethod = ref('POST')

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
  name: '',
  description: ''
})

watchEffect(() => {
  if (props.data.mode === 'edit' && props.data.pk !== null) {
    alvRoute.value = `${axios.defaults.baseURL}academic-periods/${props.data.pk}`
    alvMethod.value = 'PUT'
    isLoading.value = true

    getAcademicPeriodById(props.data.pk)
        .then(res =>{
          const period = res.data
          form.name = period.name
          form.description =period.description
        })
        .finally(() => { isLoading.value = false })
  } else if (props.data.mode === 'create') {
    alvRoute.value = `${axios.defaults.baseURL}academic-periods`
    alvMethod.value = 'POST'
    form.name = ''
    form.description = ''
  }
})

const afterDone = (response) => {
  console.log(response.data + ' guardado exitosamente')
  emit('saved')
  emit('close')
}

const afterError = (response) => {
  console.log('Error al enviar:', response.data)
}
</script>

<template>
	<transition name="fade-scale">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			@click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[85vh] flex flex-col overflow-hidden">
				<h4 class="text-2xl font-extrabold text-brand-900 mb-6 flex items-center justify-between">
					{{ data.mode === 'create' ? `Crear ${data.table}` : `Editar ${data.table}` }}
					<div
						v-if="isLoading"
						class="ml-4 w-6 h-6 border-4 border-t-4 border-gray-300 border-t-brand-800 rounded-full animate-spin" />
				</h4>

				<alv-form
					id="AcademicPeriodForm"
					:action="alvRoute"
					:data-object="form"
					:input-parent-selector="'.form-error'"
					:method="alvMethod"
					:enable-button-on-done="true"
					:spinner="true"
					class="flex-grow overflow-y-auto pr-2"
					@after-done="afterDone"
					@after-error="afterError">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<!-- Nombre -->
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse" />
							</template>
							<template v-else>
								<input
									v-model="form.name"
									type="text"
									name="name"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
							</template>
						</div>

						<!-- Descripción -->
						<div class="form-error">
							<label class="block text-sm font-medium text-gray-700 mb-1">Descripción*</label>
							<template v-if="isLoading">
								<div class="h-8 bg-gray-300 rounded animate-pulse" />
							</template>
							<template v-else>
								<input
									v-model="form.description"
									type="text"
									name="description"
									required
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-800" />
							</template>
						</div>
					</div>

					<!-- Botones -->
					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
						<button
							type="button"
							class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
							@click="emit('close')">
							Cancelar
						</button>
						<button
							form="AcademicPeriodForm"
							class="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110 transition shadow-md">
							<span v-if="data.mode === 'create'">➕</span>
							<span v-else>💾</span>
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
