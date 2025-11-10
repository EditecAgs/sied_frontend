<template>
	<button
		class="flex items-center mb-2 gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-800 hover:bg-brand-900 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-800 focus:ring-opacity-50"
		@click="handleClick">
		<span>Crear</span>
	</button>
</template>

<script setup>
const props = defineProps({
  table:{
    type: String,
    required: true
  }
})

const emit = defineEmits(['open'])

function handleClick() {
  emit('open',
      {
        mode: 'create',
        pk: null,
        table: props.table
      })
}
</script>
