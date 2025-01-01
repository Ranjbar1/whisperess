<script lang="ts">
	import { notes } from './hooks/notes.svelte';
	import { isBusy, transcript } from './hooks/transcriber.svelte';
	import { getCharacterCount, getWordCount } from './utils/StringUtils';

	$effect(() => {
		$inspect($transcript, $isBusy);
	});
</script>

<header
	class="fixed left-0 top-0 flex h-16 w-full flex-row items-center justify-between bg-slate-800 px-6 text-white md:px-10"
>
	<div class="flex flex-row sm:space-x-10">
		<strong class="text-shadow hidden text-xl sm:block">Whisperess</strong>
		<div class="relative">
			<span
				class=" absolute right-[-6px] top-[-2px] inline-block h-3 w-3 animate-bounce rounded-full bg-blue-700"
			>
			</span>
			<button
				onmousedown={() => (notes.showNotes = !notes.showNotes)}
				class=" rounded-md bg-slate-700 px-2 py-1 text-sm transition-colors hover:bg-slate-600"
			>
				Notes
			</button>
		</div>
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
