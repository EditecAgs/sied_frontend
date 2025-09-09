<template>
	<div class="h-auto font-outfit relative">
		<img
			src="/images/landing/landing.png"
			alt="Imagen Principal"
			class="hidden md:block w-screen h-screen object-fit" />

		<img
			src="/images/landing/landing-mobile.png"
			alt="Imagen Principal"
			class="block md:hidden w-screen h-screen object-fit" />

		<div
			class="
		absolute
		/* Mobile */
		bottom-5 left-1/2 -translate-x-1/2
		/* Desktop */
		md:bottom-56 md:right-44 md:left-auto md:translate-x-0
	">
			<button
				class="px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition bg-guindo hover:bg-guindo-light animate-pulse-custom"
				@click="router.push('/signin')">
				Comenzar
			</button>
		</div>
	</div>

	<footer class="text-gray-200 w-full bg-guindo">
		<div class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
			<div>
				<h1 class="text-3xl text-white font-bo">SIED</h1>
				<p class="text-sm text-gray-300 leading-relaxed">
					Creamos experiencias digitales únicas. Nuestro compromiso es innovar y brindar calidad.
				</p>
			</div>
			<div>
				<h3 class="text-lg font-semibold text-white mb-4">Enlaces</h3>
				<ul class="space-y-2">
					<li><a href="#" class="hover:text-guindo-light transition">Inicio</a></li>
					<li><a href="#" class="hover:text-guindo-light transition">Servicios</a></li>
					<li><a href="#" class="hover:text-guindo-light transition">Contacto</a></li>
					<li><a href="#" class="hover:text-guindo-light transition">Acerca de</a></li>
				</ul>
			</div>
			<div>
				<h3 class="text-lg font-semibold text-white mb-4">Síguenos</h3>
				<div class="flex space-x-4">
					<a href="#" class="hover:text-guindo-light transition"><i class="ri-facebook-circle-fill text-2xl" /></a>
					<a href="#" class="hover:text-guindo-light transition"><i class="ri-instagram-fill text-2xl" /></a>
					<a href="#" class="hover:text-guindo-light transition"><i class="ri-twitter-x-fill text-2xl" /></a>
					<a href="#" class="hover:text-guindo-light transition"><i class="ri-linkedin-box-fill text-2xl" /></a>
				</div>
			</div>
		</div>
		<div class="text-center text-sm text-gray-200 py-4 bg-guindo">
			© 2025 SIED. Todos los derechos reservados.
		</div>
	</footer>
</template>


<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped>
.font-outfit {
	font-family: var(--font-outfit);
}

.bg-guindo {
	background-color: #390F1E;
}
.hover\:bg-guindo-light:hover {
	background-color: #931F44;
}
.hover\:text-guindo-light:hover {
	color: #931F44;
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
		box-shadow: 0 0 0 0 rgba(147, 31, 68, 0.7);
	}
	50% {
		transform: scale(1.1);
		box-shadow: 0 0 20px 5px rgba(147, 31, 68, 0.5);
	}
}

.animate-pulse-custom {
	animation: pulse 2s infinite;
}
</style>
