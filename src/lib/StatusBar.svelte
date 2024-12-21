<script lang="ts">
	import { notes } from './hooks/notes.svelte';
	import { isBusy, transcript } from './hooks/transcriber.svelte';
	import { getCharacterCount, getWordCount } from './utils/StringUtils';

	$effect(() => {
		$inspect($transcript, $isBusy);
	});
</script>

<header
	class="absolute left-0 top-0 flex h-16 w-full flex-row items-center justify-between bg-slate-800 px-6 text-white md:px-10"
>
	<div class="space-x-2">
		<span>Whisperess</span>
		<button
			onclick={() => (notes.showNotes = !notes.showNotes)}
			class=" rounded-sm bg-slate-700 p-0 text-sm transition-colors hover:bg-slate-600"
		>
			{notes.showNotes ? '🔽' : '🔼'}
		</button>
	</div>

	<div class="flex flex-row items-center space-x-1 md:space-x-4">
		<span>Stats : </span>
		<span class="text-sm font-bold"
			>{#if $transcript}
				<div
					class="flex flex-row items-center space-x-1 text-green-500"
					class:text-yellow-500={$isBusy}
				>
					<div>Words: {getWordCount($transcript.text)}</div>
					<div class="hidden md:block">
						Characters: {getCharacterCount($transcript.text)}
					</div>
				</div>
			{:else}
				<span class=""> N/A </span>
			{/if}
		</span>
		<span>Status : </span>
		{#if $isBusy}
			<span class="inline-block animate-bounce">🚀</span>
		{:else}
			<span class="animate-pulse">🟢</span>
		{/if}
	</div>
</header>
