import { getCurrentInstance, ComponentInternalInstance } from 'vue';

export function useLoaderNotifier() {
	const instance = getCurrentInstance() as ComponentInternalInstance | null;

	const notifyLoading = (): void => {
		instance?.emit('loading');
	};

	const notifyLoaded = (): void => {
		instance?.emit('loaded');
	};

	return { notifyLoading, notifyLoaded };
}
