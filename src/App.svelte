<script lang="ts">
	import { onDestroy } from 'svelte'
	import { interval } from './stores'
	import Button from './components/Button.svelte'
	import { PlayIcon, PauseIcon, RestartIcon, NewIcon } from './components/icons'
	import { createGameBoard, updateGameBoard, isEvolutionOver, getBackgroundColor } from './utils'
	import type { GameBoard, EvolutionOver } from './global'
	import { Emojis } from './enums'

	const BOARD_LENGTH = 12
	let initialGameBoard: GameBoard = createGameBoard(BOARD_LENGTH)
	let evolutionOver: EvolutionOver = false
	let evolutionPaused = false
	let generations = 1
	let emojiMode = true

	$: gameBoard = initialGameBoard

	const processNextTick = () => {
		const newGameBoard = updateGameBoard(gameBoard)
		// evolution has ended when gameboards cease to differ
		evolutionOver = isEvolutionOver({
			oldGameBoard: gameBoard,
			newGameBoard,
			generations
		})

		if (evolutionOver) {
			pauseEvolution()
			return
		}

		generations += 1
		gameBoard = newGameBoard
	}

	const playEvolution = () => {
		evolutionOver = false
		evolutionPaused = false
		
		interval.startInterval(processNextTick)
	}

	const replayEvolution = () => {
		gameBoard = initialGameBoard
		generations = 1
		
		playEvolution()
	}
	
	const newEvolution = () => {
		initialGameBoard = createGameBoard(BOARD_LENGTH)

		replayEvolution()
	}
	
	const pauseEvolution = () => {
		evolutionPaused = true

		clearInterval($interval)
	}

	playEvolution()

	onDestroy(() => clearInterval($interval))
</script>

<main class="min-h-screen flex flex-col justify-center items-center text-center bg-gray-800">
	<div class="game-board-wrapper rounded-3xl bg-gray-200">
		<div class="game-board grid grid-rows-{BOARD_LENGTH} grid-cols-{BOARD_LENGTH} gap-x-px gap-y-px bg-gray-800 border border-gray-800">
			{#each gameBoard as row}
				{#each row as cell}
					<span class="cell {cell.ageInGenerations ? emojiMode ? getBackgroundColor(cell.emoji) : 'bg-gradient-to-br from-gray-400  to-gray-600' : 'bg-gray-200'}">
						{#if emojiMode}
							{#if cell.emoji === Emojis.dead}
								<span class="opacity-75">
									{cell.emoji}
								</span>
							{:else if cell.emoji}
								{cell.emoji}
							{/if}
						{/if}
					</span>
				{/each}
			{/each}
		</div>
	</div>
	
	<p class="mt-8 text-gray-200" class:italic={evolutionOver}>
		{#if evolutionOver}
			{evolutionOver.message}
		{:else}
			{generations} generation{generations > 1 ? 's' : ''}
		{/if}
	</p>
	
	<div class="my-8">
		{#if !evolutionOver}
			{#if evolutionPaused}
				<Button onClick={playEvolution}>
					<PlayIcon />&nbsp;
					play
				</Button>
			{:else}
				<Button onClick={pauseEvolution}>
					<PauseIcon />&nbsp;
					pause
				</Button>
			{/if}
		{/if}
		<Button onClick={replayEvolution}>
			<RestartIcon />&nbsp;
			replay
		</Button>
		<Button onClick={newEvolution} classes="mr-0">
			<NewIcon />
			new
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
		line-height: 1.75rem;
		width: 1.75rem;
		height: 1.75rem;
		font-size: 1.3125rem;
	}

	svg {
		width: 1rem;
    display: inline-block;
	}

	@media (min-width: 400px) {
		.cell {
			line-height: 2rem;
			width: 2rem;
			height: 2rem;
			font-size: 1.5rem;
		}
	}

	@media (min-width: 500px) {
		.game-board-wrapper {
			padding: 3rem;
		}
	}

	@media (min-width: 700px) {
		.cell {
			line-height: 2.5rem;
			width: 2.5rem;
			height: 2.5rem;
			font-size: 1.875rem;
		}
	}

	@media (min-height: 815px) {
		.cell {
			line-height: 3rem;
			width: 3rem;
			height: 3rem;
			font-size: 2.25rem;
		}
	}
</style>
