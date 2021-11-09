<script lang="ts">
	export let onClick: () => void
</script>

<button on:click={onClick} class="mr-2 p-2 border rounded-2xl bg-gray-200">
  <slot></slot>
</button>

<style>
  button {
    width: 107px;
    font-size: 0.75rem;
  }

  button:last-of-type {
    margin-right: 0;
  }
</style>
