<template>
	<button class="text-red-600 hover:underline" @click="handleClick">🗑️ Eliminar</button>
</template>

<script setup>
const props = defineProps({
  table: String,
  pk: Number,
})
const emit = defineEmits(['open-confirm'])

function handleClick() {
  emit('open-confirm', {
    table: props.table,
    pk: props.pk
  })
}
</script>
