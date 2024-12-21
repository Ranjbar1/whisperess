<script lang="ts">
	import type { Snippet } from 'svelte';

	let props: {
		icon: Snippet;
		text?: string;
		onClick?: () => void;
	} = $props();
</script>

<button
	onclick={props.onClick}
	class="flex items-center justify-center rounded-lg
  bg-white p-1 text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 hover:text-indigo-600 sm:p-2"
>
	<div class="h-7 w-7">{@render props.icon()}</div>
	{#if props.text}
		<span class="break-text text-md w-30 ml-1 text-center sm:ml-2">
			{props.text}
		</span>
	{/if}
</button>
