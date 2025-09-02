<template>
	<FullScreenLayout>
		<div
			class="relative w-full h-screen bg-cover bg-center"
			style="background-image: url('/images/background/bg-guinda.jpg');">
			<div class="flex w-full h-full">
				<div
					class="hidden md:flex w-1/2 h-full bg-cover bg-center"
					style="background-image: url('/images/carousel/carousel-01.png');" />
				
				<div class="flex items-center justify-center w-full md:w-1/2 h-full">
					<div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg dark:bg-gray-900/95">
						<div class="flex justify-center mb-6 gap-6 flex-wrap">
							<img src="/images/logo/logo-anuies-guinda.png" alt="Logo" class="w-24 h-24 object-contain" />
							<img src="/images/logo/logo-sied.png" alt="Logo" class="w-24 h-24 object-contain" />
							<img src="/images/logo/logo-tecnm-blue.png" alt="Logo" class="w-24 h-24 object-contain" />
						</div>

						<div class="mb-5 sm:mb-3 text-center">
							<h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
								Sistema Integral de Educación Dual
							</h1>
						</div>

						<form class="space-y-5" @submit.prevent="handleSubmit">
							<div>
								<label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
									Correo electrónico<span class="text-error-500">*</span>
								</label>
								<input
									id="email"
									v-model="email"
									type="email"
									placeholder="correo@ejemplo.com"
									class="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-white/30" />
							</div>

							<div>
								<label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
									Contraseña<span class="text-error-500">*</span>
								</label>
								<div class="relative">
									<input
										id="password"
										v-model="password"
										:type="showPassword ? 'text' : 'password'"
										placeholder="Ingresa tu contraseña"
										class="h-11 w-full rounded-lg border border-gray-300 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-white/30" />
									<span
										class="absolute text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
										@click="togglePasswordVisibility" />
								</div>
							</div>

							<div class="flex items-center justify-between">
								<label for="keepLoggedIn" class="flex items-center text-sm text-gray-700 cursor-pointer select-none dark:text-gray-400">
									<input id="keepLoggedIn" v-model="keepLoggedIn" type="checkbox" class="mr-2" />
									Mantener sesión iniciada
								</label>
								<router-link to="/reset-password" class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
									¿Olvidaste tu contraseña?
								</router-link>
							</div>

							<button
								type="submit"
								class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
								Ingresar
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</FullScreenLayout>
</template>






<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FullScreenLayout from '../../components/layouts/FullScreenLayout.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)

const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value
}

const handleSubmit = () => {
	router.push('/dashboard')
}
</script>
