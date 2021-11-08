<script lang="ts">
	import { onDestroy } from 'svelte'
	import { interval } from './stores'
	import Button from './components/Button.svelte'
	import Cell from './components/Cell.svelte'
	import { PlayIcon, PauseIcon, RestartIcon, NewIcon } from './components/icons'
	import { createGameBoard, updateGameBoard, isEvolutionOver, messages } from './utils'
	import type { GameBoard, EvolutionOver } from './global'

	const BOARD_LENGTH = 12
	let initialGameBoard: GameBoard = createGameBoard(BOARD_LENGTH)
	let evolutionOver: EvolutionOver = false
	let evolutionPaused = false
	let generations = 1
	let emojiMode = false

	$: gameBoard = initialGameBoard

	const processNextTick = () => {
		const newGameBoard = updateGameBoard(gameBoard)
		// evolution has ended when gameboards cease to differ
		evolutionOver = isEvolutionOver({
			oldGameBoard: gameBoard,
			newGameBoard,
			generations,
			emojiMode,
		})

		if (evolutionOver) {
			pauseEvolution()
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
					<Cell {cell} {emojiMode} />
				{/each}
			{/each}
		</div>
	</div>
	
	<p class="mt-8 text-gray-200" class:italic={evolutionOver}>
		{#if evolutionOver}
			{evolutionOver.message}
		{:else}
			{messages.generations(generations)}
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

	svg {
		width: 1rem;
    display: inline-block;
	}

	@media (min-width: 500px) {
		.game-board-wrapper {
			padding: 3rem;
		}
	}
</style>
