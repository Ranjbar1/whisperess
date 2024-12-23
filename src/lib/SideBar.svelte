<script lang="ts">
	import { fly } from 'svelte/transition';
	import { notes } from './hooks/notes.svelte';
	$effect(() => {
		$inspect(notes.items);
	});
</script>

{#if notes.showNotes}
	<aside
		transition:fly|global={{ x: -100, y: 0, duration: 300 }}
		class:fixed={notes.showNotes}
		class=" left-0 z-10 mt-16"
	>
		<div class="flex min-h-screen w-screen flex-col gap-2 bg-slate-100 md:w-96">
			<div class="flex flex-row items-center justify-between space-y-2 p-2">
				{#each notes.items as note, index}
					<div
						class={`h-28 w-full cursor-pointer rounded-md border border-cyan-700 p-3 text-gray-700 transition-colors`}
					>
						<div class="flex items-start justify-between">
							<h3
								contenteditable
								bind:innerText={note.title}
								class="font-medium"
							>
								{note.title}
							</h3>
							<p>{note.content}</p>
							<button
								onclick={(e) => {
									e.stopPropagation();
									notes.items = notes.items.filter(
										(item) => item.id !== note.id
									);
								}}
								class="text-red-500 hover:text-red-700"
							>
								×
							</button>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex flex-col gap-2">
				<div class="flex flex-col gap-2">
					<div class="flex flex-row items-center justify-between"></div>
				</div>
			</div>
		</div>
	</aside>
{/if}
