<script lang="ts">
	import { onDestroy } from 'svelte'
	import { interval } from './stores'
	import { createGameBoard, updateGameBoard, isEvolutionOver } from './utils'
	import type { GameBoard } from './global'
	import { Emojis } from './enums'

	const BOARD_LENGTH = 12
	const initialGameBoard: GameBoard = createGameBoard(BOARD_LENGTH)
	let evolutionOver = false
	let evolutionPaused = false
	let generations = 1

	$: gameBoard = initialGameBoard

	const processNextTick = () => {
		const newGameBoard = updateGameBoard(gameBoard)
		// evolution has ended when gameboards cease to differ
		if (isEvolutionOver(newGameBoard, gameBoard)) {
			evolutionOver = true

			pauseEvolution()
			return
		}

		generations += 1
		gameBoard = newGameBoard
	}

	const startEvolution = () => {
		evolutionOver = false
		evolutionPaused = false
		
		interval.startInterval(processNextTick)
	}

	const replayEvolution = () => {
		gameBoard = initialGameBoard
		generations = 1
		
		startEvolution()
	}
	
	const pauseEvolution = () => {
		evolutionPaused = true

		clearInterval($interval)
	}

	startEvolution()

	onDestroy(() => clearInterval($interval))
</script>

<main class="h-screen flex flex-col justify-center items-center text-center">
	<div class="game-board grid grid-rows-{BOARD_LENGTH} grid-cols-{BOARD_LENGTH} gap-x-px gap-y-px">
		{#each gameBoard as row}
			{#each row as cell}
				<span
					class="cell w-12 h-12 text-5xl"
					class:opacity-25={cell.emoji === Emojis.dead}
					>
					{#if cell.emoji}
						{cell.emoji}
					{/if}
				</span>
			{/each}
		{/each}
	</div>

	<p class="mt-8" class:font-bold={evolutionOver}>
		{evolutionOver ? 'This experiment survived ' : ''}
		{generations} generation{generations > 1 ? 's' : ''}
	</p>
	
	<div>
		{#if !evolutionOver}
			{#if evolutionPaused}
				<button
					on:click={startEvolution}
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
