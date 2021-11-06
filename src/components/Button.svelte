<script lang="ts">
	export let onClick: () => void
  export let classes = ''
</script>

<button
  on:click={onClick}
  class="mr-2 p-2 border rounded-2xl bg-gray-200 {classes}"
>
  <slot></slot>
</button>

<style>
  button {
    width: 107px;
    font-size: 0.75rem;
  }
</style>
