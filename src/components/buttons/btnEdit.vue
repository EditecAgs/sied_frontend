<template>
  <button
      class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#FBEAEA] text-[#7A1E1E] hover:bg-[#f3d9d9] hover:text-[#5c1616] font-semibold shadow-sm transition duration-200 text-sm"
      @click="handleClick"
  >
    <span class="text-base">✏️</span>
    <span>Editar</span>
  </button>
</template>

<script setup>
const props = defineProps({
  table: {
    type: String,
    required: true
  },
  pk: {
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
