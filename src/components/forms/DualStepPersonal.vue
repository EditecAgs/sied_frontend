<script setup>
defineProps({
	modelValue: Object,
	reportaModeloDual: Boolean
});

defineEmits(['update:modelValue', 'update:reportaModeloDual']);
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold mb-4">Información Personal</h2>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">
					Nombre completo <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					:value="modelValue.nombre"
					placeholder="Ej. Juan Pérez"
					class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
					required
					@input="$emit('update:modelValue', { ...modelValue, nombre: $event.target.value })" />
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Institución</label>
				<div class="flex space-x-4">
					<button
						type="button"
						:class="[
							'px-4 py-2 rounded border',
							modelValue.tipoInstitucion === 'Publica' ? 
								'bg-blue-100 border-blue-500' : 'border-gray-300'
						]"
						@click="$emit('update:modelValue', { ...modelValue, tipoInstitucion: 'Publica' })">
						Pública
					</button>
					<button
						type="button"
						:class="[
							'px-4 py-2 rounded border',
							modelValue.tipoInstitucion === 'Privada' ? 
								'bg-blue-100 border-blue-500' : 'border-gray-300'
						]"
						@click="$emit('update:modelValue', { ...modelValue, tipoInstitucion: 'Privada' })">
						Privada
					</button>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Institución</label>
				<select
					:value="modelValue.institucion"
					class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
					@change="$emit('update:modelValue', { ...modelValue, institucion: $event.target.value })">
					<option value="">Seleccione una opción</option>
					<option value="Tecnológico Nacional de México">Tecnológico Nacional de México</option>
					<option value="Universidad Politécnica">Universidad Politécnica</option>
					<option value="Universidad Autónoma">Universidad Autónoma</option>
				</select>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
				<input
					type="text"
					:value="modelValue.direccion"
					placeholder="Ej. Av. Siempre Viva 742"
					class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
					@input="$emit('update:modelValue', { ...modelValue, direccion: $event.target.value })" />
			</div>

			<div class="pt-4 border-t">
				<label class="block text-sm font-medium text-gray-700 mb-2">
					¿En este seguimiento tiene información del Modelo Dual que reportar?
				</label>
				<div class="flex space-x-4">
					<label class="inline-flex items-center">
						<input
							type="radio"
							:checked="reportaModeloDual === true"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500"
							@change="$emit('update:reportaModeloDual', true)" />
						<span class="ml-2">Sí</span>
					</label>
					<label class="inline-flex items-center">
						<input
							type="radio"
							:checked="reportaModeloDual === false"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500"
							@change="$emit('update:reportaModeloDual', false)" />
						<span class="ml-2">No</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>