<script lang="ts">
	import type { GameBoard } from './global'
	import { createGameBoardRows, updateGameBoard } from './utils'

	const BOARD_LENGTH = 12
	const gameBoardRows: GameBoard = createGameBoardRows(BOARD_LENGTH)

	$: gameBoard = gameBoardRows

	const processNextTick = () => {
		gameBoard = updateGameBoard(gameBoard)
	}
</script>

<main class="h-screen flex flex-col justify-center items-center text-center">
	<div class="game-board grid grid-rows-{BOARD_LENGTH} grid-cols-{BOARD_LENGTH} gap-x-px gap-y-px">
		{#each gameBoard as row}
			{#each row as cell}
				<span class="cell w-12 h-12" class:filled={cell} />
			{/each}
		{/each}
	</div>
	<button on:click={processNextTick} class="mt-8 p-4 border rounded-2xl">
		Commence evolution
	</button>
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
