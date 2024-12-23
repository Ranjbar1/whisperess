<script lang="ts">
	import { fade } from 'svelte/transition';
	import { transcript } from './hooks/transcriber.svelte';
	import { formatAudioTimestamp } from './utils/AudioUtils';
	import { exportJSON, exportTXT } from './utils/FileUtils';

	let transcribedData = $derived($transcript);

	let view = $state<HTMLDivElement | null>(null);
	let chunks = $derived(transcribedData?.chunks ?? []);
	let text = $derived.by(() =>
		chunks
			.map((chunk) => chunk.text)
			.join('')
			.trim()
	);

	// Scroll to the bottom when the component updates
	$effect.pre(() => {
		if (view) {
			const diff = Math.abs(
				view.offsetHeight + view.scrollTop - view.scrollHeight
			);

			if (chunks.length && diff <= 100) {
				// We're close enough to the bottom, so scroll to the bottom
				view.scrollTop = view.scrollHeight;
				view.scroll({
					behavior: 'smooth'
				});
			}
		}
	});
</script>

<div
	bind:this={view}
	class="scrollbar flex max-h-[20rem] max-w-6xl snap-y scroll-py-[8px] flex-col space-y-[8px] overflow-y-auto p-4"
>
	{#if chunks}
		{#each chunks as chunk}
			<div
				transition:fade|global
				class=" flex snap-end flex-row rounded-lg bg-white p-4 shadow-sm shadow-black/5 ring-1 ring-slate-700/10 md:w-[40rem]"
			>
				<div class="mr-5">{formatAudioTimestamp(chunk.timestamp[0])}</div>
				{chunk.text}
			</div>
		{/each}
	{/if}
	{#if transcribedData && !transcribedData.isBusy}
		<div class="flex w-full snap-end flex-row-reverse text-right">
			{@render Button('Save as Note', () => {})}
			{@render Button('Export TXT', () => exportTXT(text))}
			{@render Button('Export JSON', () => exportJSON(transcribedData.chunks))}
		</div>
	{/if}
</div>

{#snippet Button(text: string, action: () => void)}
	<button
		onclick={action}
		class="mr-2 inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
	>
		{text}
	</button>
{/snippet}
