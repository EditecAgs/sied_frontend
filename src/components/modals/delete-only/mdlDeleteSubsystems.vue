<template>
	<transition name="fade-scale">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			style="margin-top: 0px"
			@click.self="close">
			<div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative max-h-[85vh] flex flex-col overflow-hidden">
				<div class="flex justify-center mb-4">
					<template v-if="success">
						<svg class="w-12 h-12 text-green-700" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 6L9 17l-5-5" />
						</svg>
					</template>
					<template v-else-if="error">
						<svg class="w-12 h-12 text-red-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12" y2="16" />
						</svg>
					</template>
					<template v-else>
						<svg class="w-12 h-12 text-brand-900" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
							<path d="M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78a1.5 1.5 0 001.29-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z" />
							<line x1="12" y1="9" x2="12" y2="13" />
							<circle cx="12" cy="17" r="1" />
						</svg>
					</template>
				</div>


				<h4 v-if="!success && !error" class="text-3xl font-extrabold text-brand-900 mb-4 text-center">
					¿Estás segura/o de eliminar?
				</h4>


				<p class="text-gray-700 mb-6 text-center text-lg">
					<template v-if="success">
						{{ success }}
					</template>
					<template v-else-if="error">
						{{ error }}
					</template>
					<template v-else>
						Esta acción <span class="font-semibold">no se puede deshacer</span>. ¿Deseas continuar?
					</template>
				</p>

				<div class="flex justify-end gap-3 mt-auto pt-4 border-t border-gray-200">
					<button
            v-if="!success && !error"
						type="button"
						class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
						:disabled="loading"
						@click="close">
						Cancelar
					</button>

					<button
						v-if="!success"
						class="px-6 py-2 rounded-lg bg-brand-900 text-white font-semibold hover:brightness-110 transition shadow-md flex items-center justify-center gap-2"
						:disabled="loading"
						@click="deleteItem">
						<span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
						<span>{{ loading ? 'Eliminando...' : 'Confirmar' }}</span>
					</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { removeSubsystems } from "../../../services/institutions/subsystems.js"

const props = defineProps({
  show: Boolean,
  table: String,
  pk: Number
})
const emit = defineEmits(['close', 'deleted'])

const error = ref('')
const success = ref('')
const loading = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal) {
    error.value = ''
    success.value = ''
    loading.value = false
  }
})

function deleteItem() {
  error.value = ''
  success.value = ''
  loading.value = true

  removeSubsystems(props.pk)
      .then(() => {
        success.value = 'Eliminación realizada con éxito.'
        loading.value = false
        setTimeout(() => {
          emit('deleted', props.pk)
          emit('close')
        }, 1500)
      })
      .catch(() => {
        error.value = 'Hubo un error al eliminar. Por favor, intenta nuevamente.'
        loading.value = false
      })
}

function close() {
  if (!loading.value) {
    emit('close')
  }
}
</script>

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

/* Spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
