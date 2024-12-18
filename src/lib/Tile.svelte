<script lang="ts">
  import type { Snippet } from "svelte";

  let props: {
    icon: Snippet;
    text?: string;
    onClick?: () => void;
  } = $props();
</script>

<button
  onclick={props.onClick}
  class="flex items-center justify-center rounded-lg
  p-1 sm:p-2 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:scale-105 transition-all duration-200"
>
  <div class="w-7 h-7">{@render props.icon()}</div>
  {#if props.text}
    <span class="ml-1 sm:ml-2 break-text text-center text-md w-30">
      {props.text}
    </span>
  {/if}
</button>
