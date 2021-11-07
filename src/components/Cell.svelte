<script lang="ts">
  import { getBackgroundColor } from '../utils'
  import { Emojis } from '../enums'
  import type { Cell } from '../global'

	export let cell: Cell
  export let emojiMode: boolean
</script>

<span
  class="cell {cell.ageInGenerations
    ? emojiMode 
      ? getBackgroundColor(cell.emoji)
      : 'bg-gradient-to-br from-gray-400  to-gray-600'
    : 'bg-gray-200'
  }"
>
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

<style>
  .cell {
		line-height: 1.75rem;
		width: 1.75rem;
		height: 1.75rem;
		font-size: 1.3125rem;
	}

  @media (min-width: 400px) {
		.cell {
			line-height: 2rem;
			width: 2rem;
			height: 2rem;
			font-size: 1.5rem;
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
