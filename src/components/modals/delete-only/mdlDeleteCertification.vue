<script setup>
import { ref, watch } from 'vue'
import { removeCertification } from "../../../services/dual_projects/certifications"

const props = defineProps({
	show: Boolean,
	pk: Number
})

const emit = defineEmits(['close', 'deleted'])

const error = ref('')
const success = ref('')
const loading = ref(false)

watch(() => props.show, (newVal) => {
	if (newVal) {
		error.value = ''
		success.value = ''
		loading.value = false
	}
})

function deleteItem() {
	error.value = ''
	success.value = ''
	loading.value = true

	removeCertification(props.pk)
		.then(() => {
			success.value = 'Eliminación realizada con éxito.'
			loading.value = false
			setTimeout(() => {
				emit('deleted', props.pk)
				emit('close')
			}, 1500)
		})
		.catch(() => {
			error.value = 'Hubo un error al eliminar. Por favor, intenta nuevamente.'
			loading.value = false
		})
}

function close() {
	if (!loading.value) {
		emit('close')
	}
}
</script>
