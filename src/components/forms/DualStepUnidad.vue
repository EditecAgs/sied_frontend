<script setup>
import { DatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

defineProps({
	modelValue: Object
});

defineEmits(['update:modelValue']);
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold mb-4">Datos de Unidad Dual</h2>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa/unidad</label>
				<input
					type="text"
					:value="modelValue.nombreEmpresa"
					class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
					required
					@input="$emit('update:modelValue', { ...modelValue, nombreEmpresa: $event.target.value })" />
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
					<DatePicker
						:modelValue="modelValue.fechaInicio"
						:enableTimePicker="false"
						class="w-full"
						inputClassName="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
						@update:modelValue="val => $emit('update:modelValue', { ...modelValue, fechaInicio: val })" />
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Fecha de término</label>
					<DatePicker
						:modelValue="modelValue.fechaTermino"
						:enableTimePicker="false"
						class="w-full"
						inputClassName="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
						@update:modelValue="val => $emit('update:modelValue', { ...modelValue, fechaTermino: val })" />
				</div>
			</div>
		</div>
	</div>
</template>