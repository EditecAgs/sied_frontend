<template>
	<div class="max-w-md mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 relative">
		<button
			class="absolute top-4 left-4 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500 flex items-center gap-1"
			@click="router.push('/signin')">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<div class="text-center mb-6 mt-4">
			<h2 class="text-lg font-semibold text-gray-800 dark:text-white">
				Recuperar contraseña
			</h2>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Ingresa tu correo electrónico para recibir el enlace de recuperación
			</p>
		</div>
		
		<div class="space-y-5">
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
					Correo electrónico
				</label>
				<input
					v-model="email"
					type="email"
					placeholder="tucorreo@ejemplo.com"
					class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800
                 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-brand-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
			</div>

			<button
				class="w-full bg-brand-500 text-white py-3 rounded-lg font-medium hover:bg-brand-600 transition"
				@click="sendEmail">
				Enviar enlace
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { requestResetEmail } from '../../services/auth/forgot-passwodService.js';

const emits = defineEmits(['email-sent']);
const router = useRouter();
const email = ref('');
const emailSent = ref(false);

const sendEmail = async () => {
	if (!email.value) {
		Swal.fire({
			icon: 'warning',
			title: 'Campo vacío',
			text: 'Por favor ingresa tu correo electrónico.',
			confirmButtonColor: '#8B1D41'
		});
		return;
	}

	try {
		await requestResetEmail(email.value);
		emits('email-sent', { email: email.value });
		emailSent.value = true;
		
		await Swal.fire({
			icon: 'success',
			title: 'Correo enviado',
			text: 'Se ha enviado un enlace de recuperación a tu correo. Por favor revisa tu bandeja de entrada o carpeta de spam.',
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#8B1D41'
		});
		router.push('/signin');
	} catch (err) {
		// Alerta de error general
		Swal.fire({
			icon: 'error',
			title: 'Error al enviar el correo',
			text: err.response?.data?.message || 'Ocurrió un error inesperado. Intenta nuevamente más tarde.',
			confirmButtonColor: '#8B1D41'
		});
	}
};
</script>
