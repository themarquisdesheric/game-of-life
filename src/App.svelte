<script lang="ts">
	import { onDestroy } from 'svelte'
	import { interval } from './stores'
	import type { GameBoard } from './global'
	import { createGameBoard, updateGameBoard } from './utils'

	const BOARD_LENGTH = 12
	const initialGameBoard: GameBoard = createGameBoard(BOARD_LENGTH)
	let evolutionStopped = false
	let evolutionPaused = false
	let generations = 1

	$: gameBoard = initialGameBoard

	const startInterval = () => {
		evolutionStopped = false
		evolutionPaused = false
		
		interval.update((oldInterval: NodeJS.Timer) => {
			clearInterval(oldInterval)
			
			return setInterval(processNextTick, 500)
		})
	}
	
	const pauseEvolution = () => {
		evolutionPaused = true

		clearInterval($interval)
	}

	const replayEvolution = () => {
		gameBoard = initialGameBoard
		generations = 1

		startInterval()	
	}
	
	const processNextTick = () => {
		const newGameBoard = updateGameBoard(gameBoard)
		
		if (newGameBoard.toString() === gameBoard.toString()) {
			evolutionStopped = true

			pauseEvolution()
			return
		}

		generations += 1
		gameBoard = newGameBoard
	}

	startInterval()

	onDestroy(() => clearInterval($interval))
</script>

<main class="h-screen flex flex-col justify-center items-center text-center">
	<div class="game-board grid grid-rows-{BOARD_LENGTH} grid-cols-{BOARD_LENGTH} gap-x-px gap-y-px">
		{#each gameBoard as row}
			{#each row as cell}
				<span class="cell w-12 h-12" class:filled={cell} />
			{/each}
		{/each}
	</div>

	<p class="mt-8">
		{evolutionStopped ? 'This experiment survived ' : ''}
		{generations} generation{generations > 1 ? 's' : ''}
	</p>
	
	<div>
		{#if evolutionPaused}
			<button
				on:click={startInterval}
				class="mt-8 mr-2 p-4 border rounded-2xl"
			>
				start evolution
			</button>
		{:else}
			<button
				on:click={pauseEvolution}
				class="mt-8 mr-2 p-4 border rounded-2xl"
			>
				stop evolution
			</button>
		{/if}
		<button
			on:click={replayEvolution}
			class="mt-8 p-4 border rounded-2xl"
		>
			replay evolution
		</button>
	</div>
</main>

<style global>
  @tailwind base;
  @tailwind utilities;

	:global(body) {
		background-color: #aaa;
	}
	
	.game-board {
		width: fit-content;
	}

	.cell {
		line-height: 3rem;
	}

	.cell.filled {
		background-color: #000;
	}
</style>
