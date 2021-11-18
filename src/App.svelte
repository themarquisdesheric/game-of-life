<script lang="ts">
	import { onDestroy } from 'svelte'
	import { interval, previousGameBoards } from './stores'
	import Button from './components/Button.svelte'
	import Toggle from './components/Toggle.svelte'
	import Cell from './components/Cell.svelte'
	import { PlayIcon, PauseIcon, RestartIcon, NewIcon } from './components/icons'
	import { createGameBoard, updateGameBoard, removeAgeInGenerationsAndFlagCells, isEvolutionOver, messages } from './utils'
	import type { GameBoard, EvolutionOver } from './global'

	const BOARD_LENGTH = 12
	let initialGameBoard: GameBoard = createGameBoard(BOARD_LENGTH)
	let gameBoard = initialGameBoard
	let evolutionOver: EvolutionOver = false
	let evolutionPaused = false
	let generations = 1
	let emojiMode = false


	const processNextTick = () => {
		const newGameBoard = updateGameBoard(gameBoard)
		
		evolutionOver = isEvolutionOver({
			previousGameBoardsStore: previousGameBoards,
			previousGameBoards: $previousGameBoards,
			newGameBoard,
			generations,
			emojiMode,
		})

		// infinite loop should be allowed to continue for demonstration purposes
		if (evolutionOver && evolutionOver.message !== messages.infiniteLoop) {
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

	const toggleEmojiMode = () => {
		emojiMode = !emojiMode
	}

	const { gameBoard: initialGameBoardNoAgeInGenerations } = removeAgeInGenerationsAndFlagCells({
		gameBoard: initialGameBoard,
		emojiMode,
	})

	previousGameBoards.add(initialGameBoardNoAgeInGenerations)
	playEvolution()

	onDestroy(() => clearInterval($interval))
</script>

<main class="min-h-screen bg-gray-800">
	<div class="content-wrapper flex flex-col justify-center items-center mx-auto pt-8 text-center">
		<div class="game-board-wrapper rounded-3xl bg-gray-200">
			<div
				class="game-board grid gap-x-px gap-y-px bg-gray-800 border border-gray-800"
				style="--board-length: {BOARD_LENGTH};"
			>
				{#each gameBoard as row}
					{#each row as cell}
						<Cell {cell} {emojiMode} />
					{/each}
				{/each}
			</div>
		</div>
	
		<p class="message mt-8 text-gray-200" class:italic={evolutionOver}>
			{#if evolutionOver}
				{evolutionOver.message}
			{:else}
				{messages.generations(generations)}
			{/if}
		</p>
	
		<div class="mt-8 mb-6">
			{#if !evolutionOver || evolutionOver.message === messages.infiniteLoop}
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
			<Button onClick={newEvolution}>
				<NewIcon />
				new
			</Button>
		</div>
	
		<Toggle {emojiMode} {toggleEmojiMode} />
	</div>
</main>

<style global>
  @tailwind base;
  @tailwind utilities;
	
	.content-wrapper {
		width: fit-content;
	}

	.game-board {
		width: fit-content;
		grid-template-columns: repeat(var(--board-length), minmax(0, 1fr));
	}

	.message {
		max-width: 345px;
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
