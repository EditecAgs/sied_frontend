<template>
  <div :class="typeClass">
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({ type: String, message: String });
const typeClass = props.type === 'success' ? 'text-green-600' : 'text-red-600';
</script>
