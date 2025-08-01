<template>
	<FullScreenLayout>
		<div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
			<div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
				<div class="flex flex-col flex-1 w-full lg:w-1/2">
					<div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
						<div>
							<div class="mb-5 sm:mb-3">
								<h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
									Iniciar sesión
								</h1>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									¡Introduce tu correo y contraseña para ingresar!
								</p>
							</div>
							<div>
								<form @submit.prevent="handleSubmit">
									<div class="space-y-5">
										<!-- Email -->
										<div>
											<label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
												Correo electrónico<span class="text-error-500">*</span>
											</label>
											<input
												id="email"
												v-model="email"
												type="email"
												name="email"
												placeholder="correo@ejemplo.com"
												class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
										</div>
										<!-- Password -->
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
													class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
												<span
													class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
													@click="togglePasswordVisibility" />
											</div>
										</div>
										<!-- Checkbox -->
										<div class="flex items-center justify-between">
											<div>
												<label for="keepLoggedIn" class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400">
													<div class="relative">
														<input
															id="keepLoggedIn"
															v-model="keepLoggedIn"
															type="checkbox"
															class="sr-only" />
														<div
															:class="keepLoggedIn ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'"
															class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]">
															<span :class="keepLoggedIn ? '' : 'opacity-0'">
																<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
																	<path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round" />
																</svg>
															</span>
														</div>
													</div>
													Mantener sesión iniciada
												</label>
											</div>
											<router-link to="/reset-password" class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
												¿Olvidaste tu contraseña?
											</router-link>
										</div>
										<div>
											<button
												type="submit"
												class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
												Ingresar
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
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
