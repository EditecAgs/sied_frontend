<template>
	<div class="bg-white rounded-xl shadow-lg overflow-hidden border-l-8 border-red-800 p-6">
		<div class="flex items-center mb-6">
			<svg class="w-6 h-6 text-red-800 mr-2" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 2L15 8H9L12 2Z" />
			</svg>
			<h1 class="text-2xl font-semibold text-red-800">SIED Tutoriales</h1>
		</div>
		<div class="mb-6 relative">
			<input
				v-model="filtro"
				type="text"
				placeholder="Filtrar por título, descripción o módulo..."
				class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 pr-10" />
			<svg
				class="w-5 h-5 text-red-800 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24">
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
		</div>

		<div class="grid md:grid-cols-3 gap-6">
			<div
				v-for="(modulo, index) in modulosFiltrados"
				:key="index"
				class="bg-white rounded-xl shadow-lg overflow-hidden">
				<img :src="modulo.imagen" alt="Módulo" class="w-full h-48 object-cover" />
				<div class="p-4">
					<span
						v-if="modulo.nombre"
						class="bg-red-800 text-white text-xs px-2 py-1 rounded-full mb-2 inline-block">
						{{ modulo.nombre }}
					</span>
					<h3 class="text-lg font-semibold text-red-800 mb-2">{{ modulo.titulo }}</h3>
					<p class="text-gray-600 text-sm">{{ modulo.descripcion }}</p>
					<p class="text-gray-500 text-xs mt-2">Duración: {{ modulo.duracion }}</p>

					<div class="mt-4 text-right">
						<a
							:href="modulo.link"
							target="_blank"
							class="inline-block bg-red-800 hover:bg-red-900 text-white font-semibold py-1 px-3 rounded-full">
							Ver Tutorial
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";

const filtro = ref("");

const modulos = ref([
	{
	titulo: "Inicio de sesión",
	descripcion: "Descripción de inicio de sesión.",
	duracion: "1 minuto",
	imagen: "/images/tutorial/login.png",
	nombre: "Módulo Inicio de sesión",
	link: "https://drive.google.com/file/d/1BZizdLsb5vBPL4zNgHbfVQgoJSp_-1RT/view?usp=sharing"
  },
  {
    titulo: "Dashboard",
    descripcion: "Descripción del Módulo 1.",
    duracion: "1 minuto",
    imagen: "/images/tutorial/dashboard.png",
    nombre: "Módulo Dashboard",
    link: "https://drive.google.com/file/d/13q-tK6OcMuU-I-mmCOY8_De1Z6DvyR91/view?usp=sharing"
  },
  {
    titulo: "Modelo dual 1",
    descripcion: "Modelo dual primera fase.",
    duracion: "1 minuto",
    imagen: "/images/tutorial/fase1.png",
    nombre: "Módulo Modelo dual",
    link: "https://drive.google.com/file/d/1bqxP_NLXU7_G64im0LpCHfPW95Ya4lmq/view?usp=sharing"
  },
  {
    titulo: "Modelo dual 2",
    descripcion: "Modelo dual Segunda fase.",
    duracion: "4 minutos",
    imagen: "/images/tutorial/fase2.png",
    nombre: "Módulo Modelo dual",
    link: "https://drive.google.com/file/d/11_qmxCZmtr8kmeGlxQdFr3PpWNi0Donf/view?usp=sharing"
  },
  {
    titulo: "Modelo dual 3",
    descripcion: "Modelo dual tercera fase.",
    duracion: "2 minutos",
    imagen: "/images/tutorial/fase3.png",
    nombre: "Módulo Modelo dual",
    link: "https://drive.google.com/file/d/1XbYhV_BYlINiGQNzhDK6teePNsDHF9px/view?usp=sharing"
  },
  {
    titulo: "Catálogos",
    descripcion: "Descripción de catálogos.",
    duracion: "5 minutos",
    imagen: "/images/tutorial/catalogos.png",
    nombre: "Módulo Inventario",
    link: "https://drive.google.com/file/d/1EBzJsdi28Xf131e79qbEKq-ZWiRhZDSI/view?usp=sharing"
  },
]);


const modulosFiltrados = computed(() => {
  if (!filtro.value) return modulos.value;
  return modulos.value.filter(modulo =>
    modulo.titulo.toLowerCase().includes(filtro.value.toLowerCase()) ||
    modulo.descripcion.toLowerCase().includes(filtro.value.toLowerCase()) ||
    modulo.nombre.toLowerCase().includes(filtro.value.toLowerCase())
  );
});
</script>
