<template>
	<un-auth-layout />
</template>
<script setup>
import {watch,defineAsyncComponent} from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useAxios } from './axios';
const UnAuthLayout = defineAsyncComponent(() => import('/src/layouts/UnauthLayout.vue'))
const route = useRoute();
const router = useRouter();

//localStorage.setItem('lang', 'en');


watch(
    () => route.name,
    () => {
      window.axios = useAxios(router);
    }
);
</script>