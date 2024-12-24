<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { notes, type Note } from './hooks/notes.svelte';
	$effect(() => {
		$inspect(notes.items);
		localStorage.setItem('notes', JSON.stringify(notes.items));
	});
	const handleSelectNote = (id: Note['id']) => {
		notes.selectedNoteId = id;
	};
	const handleExportNotes = () => {
		const notesBlob = new Blob([JSON.stringify(notes.items, null, 2)], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(notesBlob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'scribe-notes-export.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
</script>

{#if notes.showNotes}
	<aside
		transition:fly|global={{ x: -100, y: 0, duration: 300 }}
		class:fixed={notes.showNotes}
		class="left-0 z-10 mt-16"
	>
		<div
			class="flex h-screen w-screen flex-col gap-2 bg-slate-100 md:w-96 overflow-y-auto scrollbar"
		>
			<div class="flex flex-col items-center justify-between space-y-2 p-2">
				{#each notes.items as note, index}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						transition:fade|global
						onclick={() => handleSelectNote(note.id)}
						class:flex-1={Boolean(note.id === notes.selectedNoteId)}
						class={`w-full h-28 cursor-pointer rounded-md border border-cyan-700 p-3 text-gray-700 transition-colors`}
					>
						<div class="flex items-start justify-between">
							<div class="flex items-start flex-col w-full gap-2">
								<h3
									contenteditable
									bind:innerText={note.title}
									class="font-medium"
								>
									{note.title}
								</h3>
								<p
									contenteditable
									class:truncate={!Boolean(note.id === notes.selectedNoteId)}
									bind:innerText={note.content}
									class="max-w-full outline-none focus:ring-2 rounded-md ring-cyan-300 px-2 py-4"
								>
									{note.content}
								</p>
							</div>
							<button
								onclick={(e) => {
									e.stopPropagation();
									notes.items = notes.items.filter(
										(item) => item.id !== note.id
									);
								}}
								class="text-red-500 hover:text-red-700 text-sm p-0"
							>
								×
							</button>
						</div>
					</div>
				{/each}
				<div class="flex flex-col w-full h-36 gap-2 pb-2">
					<button onclick={handleExportNotes}>Export Notes</button>
					<button> Import Notes</button>
				</div>
			</div>
			<!-- <div class="flex flex-col gap-2">
				<div class="flex flex-col gap-2">
					<div class="flex flex-row items-center justify-between"></div>
				</div>
			</div> -->
		</div>
	</aside>
{/if}
