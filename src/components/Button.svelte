<script lang="ts">
	export let onClick: () => void
  export let classes = 'mr-2'
</script>

<button
  on:click={onClick}
  class="mt-8 p-4 border rounded-2xl bg-gray-200 {classes}"
>
  <slot></slot>
</button>
