<script lang="ts">
	type Row = string[]
	
	const rows: [Row, Row, Row, Row, Row] = [
		['x', '', 'x', 'x', 'x'], 
		['x', 'x', '', 'x', 'x'], 
		['x', 'x', 'x', '', 'x'], 
		['', 'x', 'x', 'x', ''], 
		['x', '', 'x', '', 'x']
	]
</script>

<main class="h-screen flex justify-center items-center text-center">
	<div class="game-board grid grid-rows-5 grid-cols-5 gap-x-px gap-y-px">
		{#each rows as row}
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
