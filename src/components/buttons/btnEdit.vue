<template>
	<button
		class="text-sm text-blue-600 hover:underline"
		@click="handleClick">
		✏️ Editar
	</button>
</template>

<script setup>
const props = defineProps({
  table:{
	  type: String,
	  required: true
  },
  pk:{
	  type: Number,
	  required: true
  }
})

const emit = defineEmits(['open'])

function handleClick() {
  emit('open', {
    mode: 'edit',
    pk: props.pk,
	table: props.table
  })
}
</script>
