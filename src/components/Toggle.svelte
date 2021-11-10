<script lang="ts">
  export let toggleEmojiMode: () => void
  export let emojiMode: boolean
</script>

<button on:click={toggleEmojiMode} class="flex items-center text-gray-200">
  {#if emojiMode}
    <span class="mr-2">
      <span class="relative top-0.5 inline-block w-4 h-4 bg-gradient-to-br from-gray-400 border border-gray-200" />
    </span>
    <span class="text-sm">block mode</span>
  {:else}
    <span class="mr-2">😎</span>
    <span class="text-sm">emoji mode</span>
  {/if}
</button>
