<template>
  <div>
    <p v-if="!emailSent">Ingresa tu correo para recibir el enlace de recuperación:</p>

    <!-- Si aún no se ha enviado el correo -->
    <div v-if="!emailSent">
      <input v-model="email" type="email" placeholder="Correo" />
      <button @click="sendEmail">Enviar</button>
    </div>

    <!-- Si ya se envió el correo -->
    <div v-else class="text-green-700 font-semibold mt-3">
      ✅ Se ha enviado un enlace de recuperación a tu correo.  
      <br />
      Por favor revisa tu bandeja de entrada o tu carpeta de spam.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import { requestResetEmail } from '../../services/auth/forgot-passwodService.js';

const emits = defineEmits(['email-sent']);
const email = ref('');
const emailSent = ref(false); // <-- NUEVO estado

const sendEmail = async () => {
  try {
    const response = await requestResetEmail(email.value);
    emits('email-sent', { email: email.value }); 

    // Mostrar mensaje de confirmación
    emailSent.value = true;
  } catch (err) {
    alert(err.response?.data?.message || 'Error al enviar el correo');
  }
};
</script>
