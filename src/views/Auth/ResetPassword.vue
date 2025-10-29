<template>
	<div
		class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
		style="background-image: url('/images/background/bg-white-flores.png'); background-size: cover;">
		<div class="w-full max-w-lg ml-4 mr-4">
			<RequestEmail
				v-if="step === 'email'"
				@email-sent="handleEmailSent" />
			<ResetPassword
				v-else-if="step === 'reset'"
				:token="token"
				:email="email"
				@reset-success="handleResetSuccess"
				@reset-error="handleResetError" />
			<StatusMessage
				v-else
				:type="statusType"
				:message="statusMessage" />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ComponentCard from "../../components/common/componentCard.vue";
import RequestEmail from '../../components/forgot-password/RequestEmail.vue';
import ResetPassword from '../../components/forgot-password/ResetPassword.vue';
import StatusMessage from '../../components/forgot-password/StatusMessage.vue';

const step = ref('email');
const token = ref('');
const email = ref('');
const statusType = ref('success');
const statusMessage = ref('');

const route = useRoute();

onMounted(() => {
	const queryToken = route.query.token;
	const queryEmail = route.query.email;
	if (queryToken && queryEmail) {
		token.value = queryToken;
		email.value = queryEmail;
		step.value = 'reset';
	}
});

const handleEmailSent = (payload) => {
	email.value = payload.email;
	statusType.value = 'success';
	statusMessage.value = '✅ Se ha enviado un enlace de recuperación a tu correo.';
	step.value = 'status';
};

const handleResetSuccess = (message) => {
	statusType.value = 'success';
	statusMessage.value = message;
	step.value = 'status';
};

const handleResetError = (message) => {
	statusType.value = 'error';
	statusMessage.value = message;
	step.value = 'status';
};
</script>
