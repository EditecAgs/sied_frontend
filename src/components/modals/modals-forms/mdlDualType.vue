<template>
	<transition name="fade-scale">
		<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" style="margin-top: 0px" @click.self="emit('close')">
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] flex flex-col overflow-hidden"
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
					id="DualTypeForm"
					:action="alvRoute"
					:method="alvMethod"
					:data-object="form"
					:input-parent-selector="'.form-error'"
					:spinner="true"
					:enable-button-on-done="true"
					class="overflow-y-auto pr-2 flex-grow"
					@after-done="afterDone"
					@after-error="afterError">
					<div class="form-error mb-6 mt-5">
						<label class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
						<input v-model="form.name" name="name" required class="w-full px-3 py-2 border rounded-md" />
					</div>

					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-transparent z-10">
						<button type="button" class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200" :disabled="isLoading" @click="emit('close')">
							Cancelar
						</button>
						<button form="DualTypeForm" class="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold hover:brightness-110" :disabled="isLoading">
							{{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
						</button>
					</div>
				</alv-form>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref, watchEffect } from 'vue';
import axios from 'axios';
import { showDualType } from '../../../services/dual_projects/dual-types';

// emits
const emit = defineEmits(['close', 'saved']);

const isLoading = ref(false);
const alvRoute = ref<string>('');
const alvMethod = ref<'POST' | 'PUT'>('POST');

// eslint-disable-next-line vue/valid-define-props
const props = defineProps<{
	show: boolean,
	data: {
		mode: 'create' | 'edit',
		pk: number | null,
		table: string
	}
}>();

// objeto del formulario
const form = reactive({
	name: ''
});

// adaptar ruta y método según mode (create | edit). Si es edit, cargar el registro con showDualType
watchEffect(() => {
	if (props.data.mode === 'edit' && props.data.pk !== null) {
		alvRoute.value = `${axios.defaults.baseURL}dual-types/${props.data.pk}`;
		alvMethod.value = 'PUT';
		isLoading.value = true;

		// usar el servicio que carga un solo registro (igual que showDualArea en tu ejemplo)
		showDualType(props.data.pk)
			.then(({ data }) => {
				form.name = data.name || '';
			})
			.catch((err) => {
				console.error('Error al obtener tipo dual:', err);
			})
			.finally(() => {
				isLoading.value = false;
			});
	} else {
		alvRoute.value = `${axios.defaults.baseURL}dual-types`;
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
