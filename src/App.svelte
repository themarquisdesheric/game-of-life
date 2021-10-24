<script lang="ts">
	import type { GameBoard } from './global'
	import { createGameBoardRows } from './utils'

	const BOARD_LENGTH = 10

	const gameBoard: GameBoard = createGameBoardRows(BOARD_LENGTH)
</script>

<main class="h-screen flex justify-center items-center text-center">
	<div class="game-board grid grid-rows-{BOARD_LENGTH} grid-cols-{BOARD_LENGTH} gap-x-px gap-y-px">
		{#each gameBoard as row}
			{#each row as square}
				<span class="square w-12 h-12" class:filled={square} />
			{/each}
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

	.square {
		line-height: 3rem;
	}

	.square.filled {
		background-color: #000;
	}
</style>
