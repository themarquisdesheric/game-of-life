import { writable } from 'svelte/store'
import type { ComparisonGameBoard } from './global'

const createInterval = () => {
	const { subscribe, update } = writable(setInterval(() => {}))

	return {
		subscribe,
		startInterval: (processNextTick: () => void) => {
      update((oldInterval: NodeJS.Timer) => {
        clearInterval(oldInterval)
        
        return setInterval(processNextTick, 400)
      })
    }
	}
}

export const interval = createInterval()

// this store keeps a cache of the n - 2 and n - 1 gameboards
const createPreviousGameBoards = () => {
  const initialGameBoards: ComparisonGameBoard[] = []
	const { subscribe, update } = writable(initialGameBoards)

	return {
		subscribe,
    add: (newGameBoard: ComparisonGameBoard) => {
      update((previousGameBoards: ComparisonGameBoard[]) =>
        previousGameBoards.length === 2
          // remove oldest previous gameboard and add the new one
          ? [previousGameBoards[1], newGameBoard]
          : [...previousGameBoards, newGameBoard]
      )
    }
	}
}

export const previousGameBoards = createPreviousGameBoards()
