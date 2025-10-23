<script setup lang="ts">
import { defineProps, defineEmits, ref, watchEffect, onMounted } from 'vue'
import { getLogById } from '../../../services/statistics/logsService'

interface Log {
  id: number
  user: string
  action: string
  detail?: string
  timestamp: string
}
// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
  show: boolean
  data: { pk: number | null }
}>()

const emit = defineEmits(['close'])

const isLoading = ref(false)
const log = ref<Log | null>(null)

const fetchLog = async () => {
  if (props.data.pk === null) return
  isLoading.value = true
  try {
    const { data } = await getLogById(props.data.pk)
    log.value = data
  } catch (error) {
    console.error('Error al cargar log:', error)
    log.value = null
  } finally {
    isLoading.value = false
  }
}

watchEffect(() => {
  if (props.show && props.data.pk !== null) {
    fetchLog()
  }
})
</script>

<template>
	<transition name="fade-scale">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			@click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[85vh] overflow-y-auto">
				<div class="flex items-center justify-between bg-brand-900 -mx-6 -mt-6 px-6 py-4 rounded-t-2xl">
					<h4 class="text-xl font-semibold text-white">Detalle de actividad</h4>
					<div class="flex items-center gap-4">
						<div v-if="isLoading" class="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />
						<button class="text-white/80 hover:text-white text-2xl font-bold leading-none" @click="emit('close')">
							&times;
						</button>
					</div>
				</div>

				<div v-if="isLoading" class="mt-4 text-center text-gray-500">Cargando...</div>

				<div v-else-if="log" class="mt-4 space-y-3">
					<p><strong>Usuario:</strong> {{ log.user }}</p>
					<p><strong>Acción:</strong> {{ log.action }}</p>
					<p><strong>Detalle:</strong> {{ log.detail || '—' }}</p>
					<p><strong>Fecha / Hora:</strong> {{ log.timestamp }}</p>
				</div>

				<div v-else class="mt-4 text-center text-red-500">No se pudo cargar la actividad</div>

				<div class="flex justify-end mt-6 pt-4 border-t border-gray-200 sticky bottom-0">
					<button
						type="button"
						class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
						@click="emit('close')">
						Cerrar
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
</style>
