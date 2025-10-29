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
				Restablecer contraseña
			</h2>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Ingresa y confirma tu nueva contraseña
			</p>
		</div>

		<div class="space-y-5">
			<div class="relative">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
					Nueva contraseña
				</label>
				<div class="relative">
					<input
						v-model="password"
						:type="showPassword ? 'text' : 'password'"
						placeholder="••••••••"
						class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800
						shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-brand-500
						dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 pr-10" />
					<button
						type="button"
						aria-label="Mostrar u ocultar contraseña"
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand-500"
						@click="showPassword = !showPassword">
						<svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.974 9.974 0 013.278-4.568M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
						</svg>
						<svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path
								stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.478 0-8.268-2.943-9.542-7z" />
						</svg>
					</button>
				</div>
			</div>

			<div class="relative">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
					Confirmar contraseña
				</label>
				<div class="relative">
					<input
						v-model="password_confirmation"
						:type="showConfirmPassword ? 'text' : 'password'"
						placeholder="••••••••"
						class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800
						shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-brand-500
						dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 pr-10" />
					<button
						type="button"
						aria-label="Mostrar u ocultar confirmar contraseña"
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand-500"
						@click="showConfirmPassword = !showConfirmPassword">
						<svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.974 9.974 0 013.278-4.568M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
						</svg>
						<svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path
								stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.478 0-8.268-2.943-9.542-7z" />
						</svg>
					</button>
				</div>
			</div>
			<button
				class="w-full bg-brand-500 text-white py-3 rounded-lg font-medium hover:bg-brand-600 transition"
				@click="resetPassword">
				Cambiar contraseña
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { defineProps, defineEmits } from 'vue';
import { resetPassword as resetPasswordService } from '../../services/auth/forgot-passwodService.js';

const props = defineProps({ token: String, email: String });
const emits = defineEmits(['reset-success', 'reset-error']);
const router = useRouter();

const password = ref('');
const password_confirmation = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const resetPassword = async () => {
	if (!password.value || !password_confirmation.value) {
		Swal.fire({
			icon: 'warning',
			title: 'Campos incompletos',
			text: 'Por favor ingresa y confirma tu nueva contraseña.',
			confirmButtonColor: '#8B1D41'
		});
		return;
	}

	if (password.value.length < 8) {
		Swal.fire({
			icon: 'warning',
			title: 'Contraseña débil',
			text: 'La contraseña debe tener al menos 8 caracteres.',
			confirmButtonColor: '#8B1D41'
		});
		return;
	}

	if (password.value !== password_confirmation.value) {
		Swal.fire({
			icon: 'error',
			title: 'Contraseñas no coinciden',
			text: 'Asegúrate de escribir la misma contraseña en ambos campos.',
			confirmButtonColor: '#8B1D41'
		});
		return;
	}

	if (!props.token || !props.email) {
		emits('reset-error', 'El token o el email son inválidos');
		return;
	}

	try {
		await resetPasswordService(props.email, props.token, password.value, password_confirmation.value);
		emits('reset-success', 'Contraseña cambiada exitosamente');

		await Swal.fire({
			icon: 'success',
			title: 'Contraseña actualizada',
			text: 'Tu contraseña se ha cambiado correctamente. Ahora puedes iniciar sesión.',
			confirmButtonText: 'Ir al login',
			confirmButtonColor: '#8B1D41'
		});
		router.push('/signin');
	} catch (err) {
		emits('reset-error', err.response?.data?.message || 'Error al cambiar la contraseña');
		Swal.fire({
			icon: 'error',
			title: 'Error al cambiar la contraseña',
			text: err.response?.data?.message || 'Ocurrió un error inesperado. Intenta nuevamente más tarde.',
			confirmButtonColor: '#8B1D41'
		});
	}
};
</script>
