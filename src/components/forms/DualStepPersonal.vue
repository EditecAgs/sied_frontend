<script setup>
defineProps({
	// eslint-disable-next-line vue/require-default-prop
	modelValue: Object,
	reportaModeloDual: Boolean
});

defineEmits(['update:modelValue', 'update:reportaModeloDual']);
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-xl font-semibold text-brand-900 mb-6">Información Personal</h2>

		<div class="space-y-6">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Nombre completo <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					:value="modelValue.nombre"
					placeholder="Ej. Juan Pérez"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-800 focus:border-brand-800"
					required
					@input="$emit('update:modelValue', { ...modelValue, nombre: $event.target.value })" />
			</div>

			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700">Tipo de Institución</label>
				<div class="flex space-x-4">
					<button
						type="button"
						:class="[
							'px-4 py-2 rounded-lg border flex-1 transition-colors',
							modelValue.tipoInstitucion === 'Publica' ?
								'bg-brand-800 text-white border-brand-800' : 'border-gray-300 hover:bg-gray-50'
						]"
						@click="$emit('update:modelValue', { ...modelValue, tipoInstitucion: 'Publica' })">
						Pública
					</button>
					<button
						type="button"
						:class="[
							'px-4 py-2 rounded-lg border flex-1 transition-colors',
							modelValue.tipoInstitucion === 'Privada' ?
								'bg-brand-800 text-white border-brand-800' : 'border-gray-300 hover:bg-gray-50'
						]"
						@click="$emit('update:modelValue', { ...modelValue, tipoInstitucion: 'Privada' })">
						Privada
					</button>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Institución</label>
				<select
					:value="modelValue.institucion"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-800 focus:border-brand-800 bg-white"
					@change="$emit('update:modelValue', { ...modelValue, institucion: $event.target.value })">
					<option value="">Seleccione una opción</option>
					<option value="Tecnológico Nacional de México">Tecnológico Nacional de México</option>
					<option value="Universidad Politécnica">Universidad Politécnica</option>
					<option value="Universidad Autónoma">Universidad Autónoma</option>
				</select>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
				<input
					type="text"
					:value="modelValue.direccion"
					placeholder="Ej. Av. Siempre Viva 742"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-800 focus:border-brand-800"
					@input="$emit('update:modelValue', { ...modelValue, direccion: $event.target.value })" />
			</div>

			<div class="pt-6 border-t space-y-4">
				<label class="block text-sm font-medium text-gray-700">
					¿En este seguimiento tiene información del Modelo Dual que reportar?
				</label>
				<div class="flex space-x-6">
					<label class="inline-flex items-center space-x-2 cursor-pointer">
						<input
							type="radio"
							:checked="reportaModeloDual === true"
							class="h-5 w-5 text-brand-800 focus:ring-brand-800 border-gray-300 cursor-pointer"
							@change="$emit('update:reportaModeloDual', true)" />
						<span>Sí</span>
					</label>
					<label class="inline-flex items-center space-x-2 cursor-pointer">
						<input
							type="radio"
							:checked="reportaModeloDual === false"
							class="h-5 w-5 text-brand-800 focus:ring-brand-800 border-gray-300 cursor-pointer"
							@change="$emit('update:reportaModeloDual', false)" />
						<span>No</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>