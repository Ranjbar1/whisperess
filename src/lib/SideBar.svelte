<script lang="ts">
	import { fly } from 'svelte/transition';
	import { notes } from './hooks/notes.svelte';
</script>

{#if notes.showNotes}
	<aside
		transition:fly|global={{ x: -100, y: 0, duration: 300 }}
		class:fixed={notes.showNotes}
		class=" left-0 mt-16"
	>
		<div class="flex min-h-screen w-screen flex-col gap-2 bg-slate-100 md:w-64">
			<div class="flex flex-row items-center justify-between space-y-2 p-2">
				{#each notes.items as note, index}
					<div
						class={`h-28 w-full cursor-pointer rounded-md border border-cyan-700 p-3 transition-colors ${
							// selectedNoteId === note.id
							// 	? 'bg-blue-100 hover:bg-blue-200'
							// 	: 'hover:bg-gray-100'

							'text-gray-700'
						}`}
					>
						<div class="flex items-start justify-between">
							<h3 class="font-medium">{note.title}</h3>
							<p>{note.content}</p>
							<button
								onclick={(e) => {
									// e.stopPropagation();
									// onDeleteNote(note.id);
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
