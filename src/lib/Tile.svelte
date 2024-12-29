<script lang="ts">
	import type { Snippet } from 'svelte';

	let props: {
		icon: Snippet;
		text?: string;
		onClick?: () => void;
	} = $props();
</script>

<button
	onmousedown={props.onClick}
	class="group relative flex aspect-square w-20 flex-col items-center justify-center rounded-full
  bg-white p-4 text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 hover:text-indigo-600 sm:p-2"
>
	<div class="aspect-square w-14">{@render props.icon()}</div>
	{#if props.text}
		<span
			class="absolute -top-8 ml-1 hidden w-32 rounded-md bg-slate-800 py-1 text-center text-sm text-slate-100 group-hover:block"
		>
			{props.text}
		</span>
	{/if}
</button>
