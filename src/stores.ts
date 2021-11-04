import { writable } from 'svelte/store'

const createInterval = () => {
	const { subscribe, update } = writable(setInterval(() => {}))

	return {
		subscribe,
		startInterval: (processNextTick: () => void) => {
      update((oldInterval: NodeJS.Timer) => {
        clearInterval(oldInterval)
        
        return setInterval(processNextTick, 500)
      })
    }
	}
}

export const interval = createInterval()
