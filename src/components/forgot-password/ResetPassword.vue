<template>
  <div>
    <p>Ingresa tu nueva contraseña:</p>
    <input v-model="password" type="password" placeholder="Nueva contraseña" />
    <input v-model="password_confirmation" type="password" placeholder="Confirmar contraseña" />
    <button @click="resetPassword">Cambiar contraseña</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { resetPassword as resetPasswordService } from '../../services/auth/forgot-passwodService.js';

const props = defineProps({ token: String, email: String });
const emits = defineEmits(['reset-success', 'reset-error']);

const password = ref('');
const password_confirmation = ref('');

const resetPassword = async () => {
  console.log(
    'Email:', props.email,
    'Token:', props.token,
    'Password:', password.value,
    'Password_confirmation:', password_confirmation.value
  );

  if (!props.token || !props.email) {
    emits('reset-error', 'El token o el email son inválidos');
    return;
  }

  try {
    await resetPasswordService(
      props.email,
      props.token,
      password.value,
      password_confirmation.value
    );
    emits('reset-success', 'Contraseña cambiada exitosamente');
  } catch (err) {
    emits('reset-error', err.response?.data?.message || 'Error al cambiar la contraseña');
  }
};
</script>
