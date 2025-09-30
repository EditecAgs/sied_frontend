import { getCurrentInstance, ComponentInternalInstance } from 'vue'

export function useLoaderNotifier() {
	const instance = getCurrentInstance() as ComponentInternalInstance | null

	const notifyLoaded = (): void => {
		instance?.emit('loaded')
	}

	return { notifyLoaded }
}
