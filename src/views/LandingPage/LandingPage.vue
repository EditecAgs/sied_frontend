<template>
  <div class="min-h-screen bg-gray-50 font-outfit flex flex-col">
    <!-- Navbar -->
    <nav class="flex justify-between items-center px-8 py-4 shadow-md bg-guindo">
      <div class="flex items-center">
        <h1 class="text-3xl text-white font-bo">SIED</h1>
      </div>
      <ul class="flex space-x-8 text-white font-medium">
        <li><a href="#" class="hover:text-guindo-light transition">Inicio</a></li>
        <li><a href="#" class="hover:text-guindo-light transition">Servicios</a></li>
        <li><a href="#" class="hover:text-guindo-light transition">Contacto</a></li>
      </ul>
    </nav>

    <!-- Imagen principal -->
<section class="relative min-h-screen">
  <img
    src="/images/landing/landing.png"
    alt="Imagen Principal"
    class="w-full h-full object-cover"
  />
  <div class="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-8">
    <h1 class="text-4xl md:text-6xl font-bold mb-4">Bienvenido a Nuestra Plataforma</h1>
    <p class="max-w-2xl text-lg md:text-xl mb-6">
      Conectamos innovación con calidad. Descubre todo lo que tenemos para ti.
    </p>
    <button
      class="px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition bg-guindo hover:bg-guindo-light"
      @click="router.push('/signin')"
    >
      Comenzar
    </button>
  </div>
</section>


    <!-- Footer -->
    <footer class="text-gray-200 mt-auto bg-guindo">
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
            <a href="#" class="hover:text-guindo-light transition"><i class="ri-facebook-circle-fill text-2xl"></i></a>
            <a href="#" class="hover:text-guindo-light transition"><i class="ri-instagram-fill text-2xl"></i></a>
            <a href="#" class="hover:text-guindo-light transition"><i class="ri-twitter-x-fill text-2xl"></i></a>
            <a href="#" class="hover:text-guindo-light transition"><i class="ri-linkedin-box-fill text-2xl"></i></a>
          </div>
        </div>
      </div>
      <div class="text-center text-sm text-gray-200 py-4 bg-guindo">
        © 2025 SIED. Todos los derechos reservados.
      </div>
    </footer>
  </div>
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
</style>
