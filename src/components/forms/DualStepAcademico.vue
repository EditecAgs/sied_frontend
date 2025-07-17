<script setup>
defineProps({
	modelValue: Object
});

defineEmits(['update:modelValue']);
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold mb-4">Datos Académicos</h2>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
				<input
					type="text"
					:value="modelValue.matricula"
					class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
					required
					@input="$emit('update:modelValue', { ...modelValue, matricula: $event.target.value })" />
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
				<select
					:value="modelValue.nivel"
					class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
					@change="$emit('update:modelValue', { ...modelValue, nivel: $event.target.value })">
					<option value="">Seleccione</option>
					<option value="Primero">Primero</option>
					<option value="Segundo">Segundo</option>
					<option value="Tercero">Tercero</option>
					<option value="Cuarto">Cuarto</option>
					<option value="Quinto">Quinto</option>
					<option value="Sexto">Sexto</option>
				</select>
			</div>
		</div>
	</div>
</template>