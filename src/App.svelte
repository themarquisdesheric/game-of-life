<script lang="ts">
	type Row = string[]
	
	const rows: [Row, Row, Row, Row, Row] = [
		['x', 'x', 'x', 'x', 'x'], 
		['x', 'x', 'x', 'x', 'x'], 
		['x', 'x', 'x', 'x', 'x'], 
		['x', 'x', 'x', 'x', 'x'], 
		['x', 'x', 'x', 'x', 'x']
	]
</script>

<main>
	<h1>The Game of Life</h1>
	<div class="game-board">
		{#each rows as row}
			{#each row as square}
				<span class="square">{square}</span>
			{/each}
		{/each}
	</div>
</main>

<style global>
  @tailwind base;
  @tailwind utilities;
	
	main {
		width: fit-content;
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	.game-board {
		display: grid;
		grid-template-rows: repeat(3, 1fr);
		grid-template-columns: repeat(5, 1fr);
	}

	.square {
		border: 1px solid;
		margin-right: -1px;
		margin-top: -1px;
		width: 50px;
		height: 50px;
		line-height: 50px;;
	}
</style>
