<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref, watchEffect } from 'vue';
import axios from 'axios';
import { showDualArea } from '../../../services/dual_projects/dual-areas';

const emit = defineEmits(['close', 'saved']);
const isLoading = ref(false);
const alvRoute = ref();
const alvMethod = ref('POST');

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean,
	data: {
		mode: 'create' | 'edit',
		pk: number | null,
		table: string
	}
}>();

const form = reactive({
	name: ''
});

watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}dual-areas/${props.data.pk}`;
		alvMethod.value = 'PUT';
		isLoading.value = true;

		showDualArea(props.data.pk).then(({ data }) => {
			form.name = data.name || '';
		}).finally(() => {
			isLoading.value = false;
		});

	} else if (props.data.mode === 'create') {
		alvRoute.value = `${axios.defaults.baseURL}dual-areas`;
		alvMethod.value = 'POST';
		form.name = '';
	}
});

const afterDone = () => {
	emit('saved');
	emit('close');
};

const afterError = (res: any) => {
	console.error('Error al guardar:', res);
};
</script>

<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style="margin-top: 0px" @click.self="emit('close')">
			<div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] flex flex-col overflow-hidden">
				<h4 class="text-2xl font-extrabold text-brand-900 mb-6 flex items-center justify-between">
					{{ data.mode === 'create' ? `Crear Area dual` : `Editar Area dual` }}
					<div v-if="isLoading" class="ml-4 w-6 h-6 border-4 border-t-4 border-gray-300 border-t-brand-800 rounded-full animate-spin" />
				</h4>

				<button
					@click="emit('close')"
					class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
					aria-label="Cerrar modal">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<alv-form
					id="DualAreaForm"
					:action="alvRoute"
					:method="alvMethod"
					:data-object="form"
					:input-parent-selector="'.form-error'"
					:spinner="true"
					:enable-button-on-done="true"
					class="overflow-y-auto pr-2 flex-grow"
					@after-done="afterDone"
					@after-error="afterError">

					<div class="form-error mb-6">
						<label class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
						<input v-model="form.name" name="name" required class="w-full px-3 py-2 border rounded-md" />
					</div>

					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
						<button type="button" class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200" @click="emit('close')" :disabled="isLoading">
							Cancelar
						</button>
						<button form="DualAreaForm" class="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110" :disabled="isLoading">
							{{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
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
