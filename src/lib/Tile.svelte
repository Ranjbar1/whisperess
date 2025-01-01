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
	class="group relative flex aspect-square w-16 flex-col items-center justify-center rounded-full bg-white text-slate-500 shadow-black drop-shadow-xl
  transition-all duration-200 hover:scale-110 hover:bg-indigo-50 hover:text-indigo-600 hover:drop-shadow-sm"
>
	<div class="aspect-square w-10">{@render props.icon()}</div>
	{#if props.text}
		<span
			class="absolute -top-8 hidden w-32 rounded-md bg-slate-800 text-center text-sm text-slate-100 group-hover:block"
		>
			{props.text}
		</span>
	{/if}
</button>
