<script lang="ts">
	import { onDestroy } from 'svelte'
	import { interval } from './stores'
	import Button from './components/Button.svelte'
	import { createGameBoard, updateGameBoard, isEvolutionOver, getBackgroundColor } from './utils'
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

<main class="h-screen flex flex-col justify-center items-center text-center bg-gray-800">
	<div class="game-board grid grid-rows-{BOARD_LENGTH} grid-cols-{BOARD_LENGTH} gap-x-px gap-y-px rounded-3xl p-12 bg-gray-200">
		{#each gameBoard as row}
			{#each row as cell}
				<span
					class="cell w-12 h-12 text-5xl"
					class:opacity-50={cell.emoji === Emojis.dead}
					style="background-color: {getBackgroundColor(cell.emoji)}"
				>
					{#if cell.emoji}
						{cell.emoji}
					{/if}
				</span>
			{/each}
		{/each}
	</div>

	<p class="mt-8 text-gray-200" class:font-bold={evolutionOver}>
		{evolutionOver ? 'This experiment survived ' : ''}
		{generations} generation{generations > 1 ? 's' : ''}
	</p>
	
	<div>
		{#if !evolutionOver}
			{#if evolutionPaused}
				<Button onClick={startEvolution}>
					start evolution
				</Button>
			{:else}
				<Button onClick={pauseEvolution}>
					stop evolution
				</Button>
			{/if}
		{/if}
		<Button onClick={replayEvolution} classes="mr-0">
			replay evolution
		</Button>
	</div>
</main>

<style global>
  @tailwind base;
  @tailwind utilities;
	
	.game-board {
		width: fit-content;
	}

	.cell {
		line-height: 3rem;
	}
</style>
