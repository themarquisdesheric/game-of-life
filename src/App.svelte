<script lang="ts">
	import { onDestroy } from 'svelte'
	import type { GameBoard } from './global'
	import { createGameBoard, updateGameBoard } from './utils'

	const BOARD_LENGTH = 12
	const initialGameBoard: GameBoard = createGameBoard(BOARD_LENGTH)
	let evolutionStopped = false
	let generations = 0
	let interval

	$: gameBoard = initialGameBoard

	const startInterval = () =>
		(interval = setInterval(processNextTick, 500))
	
	const stopInterval = () => {
		clearInterval(interval)
		evolutionStopped = true
	}

	const replayEvolution = () => {
		gameBoard = initialGameBoard
		evolutionStopped = false
		generations = 0
		startInterval()
	}
	
	const processNextTick = () => {
		const newGameBoard = updateGameBoard(gameBoard)
		
		if (newGameBoard.toString() === gameBoard.toString()) {
			stopInterval()
		}

		generations += 1
		gameBoard = newGameBoard
	}

	const buttonAttributes: [string, () => void][] = [
		['start evolution', startInterval],
		['stop evolution', stopInterval],
		['replay evolution', replayEvolution]
	]

	startInterval()

	onDestroy(() => clearInterval(interval))
</script>

<main class="h-screen flex flex-col justify-center items-center text-center">
	<div class="game-board grid grid-rows-{BOARD_LENGTH} grid-cols-{BOARD_LENGTH} gap-x-px gap-y-px">
		{#each gameBoard as row}
			{#each row as cell}
				<span class="cell w-12 h-12" class:filled={cell} />
			{/each}
		{/each}
	</div>

	{#if evolutionStopped}
		<p class="mt-8">This experiment survived {generations} generations</p>
	{:else}
		<p class="mt-8">Generations: {generations}</p>
	{/if}
	
	<div>
		{#each buttonAttributes as [label, handler], i}
			<button
				on:click={handler}
				class="mt-8 p-4 border rounded-2xl"
				class:mr-2={i < buttonAttributes.length - 1}
			>
				{label}
			</button>
		{/each}
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
