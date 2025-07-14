<template>
	<button
		class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
		@click="handleClick">
		<span>➕</span>
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
