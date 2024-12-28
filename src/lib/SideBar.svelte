<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { notes, type Note } from './hooks/notes.svelte';
	$effect(() => {
		if (localStorage.getItem('notes') && !notes.items.length) {
			notes.items = JSON.parse(localStorage.getItem('notes') as string);
		}
	});
	const handleSaveNotes = () => {
		localStorage.setItem('notes', JSON.stringify(notes.items));
	};
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
	const handleImportNotes = (event: any) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const importedNotes = JSON.parse(e.target?.result as string);
					if (
						Array.isArray(importedNotes) &&
						importedNotes.every(
							(note) =>
								typeof note === 'object' &&
								'id' in note &&
								'title' in note &&
								'content' in note
						)
					) {
						const now = Date.now();
						const migratedNotes = importedNotes.map((note) => ({
							...note,
							tags: note.tags || [],
							versions: note.versions || [],
							created: note.created || now,
							lastEdited: note.lastEdited || now
						}));
						notes.items.push(...migratedNotes);
					} else {
						alert('Invalid notes format');
					}
				} catch (error) {
					console.error('Error importing notes:', error);
					alert('Error importing notes');
				}
			};
			reader.readAsText(file);
		}
	};
</script>

{#if notes.showNotes}
	<aside
		transition:fly|global={{ x: -100, y: 0, duration: 500 }}
		class:fixed={notes.showNotes}
		class="scrollbar left-0 z-10 mt-16 h-screen w-screen overflow-y-auto bg-slate-100"
	>
		<div
			class="container mx-auto grid grid-cols-2 grid-rows-[repeat(1fr)] gap-2"
		>
			{#each notes.items as note, index}
				<div
					transition:fade|global
					class:flex-1={Boolean(note.id === notes.selectedNoteId)}
					class={` w-full cursor-pointer rounded-md border border-gray-600/40 px-2 py-1 text-gray-700 transition-colors`}
				>
					<div class="">
						<div class="flex w-full flex-col items-start gap-2">
							<h3
								contenteditable
								bind:innerText={note.title}
								class="px-2 font-medium"
							>
								{note.title}
							</h3>
							<p
								contenteditable
								class:truncate={!Boolean(note.id === notes.selectedNoteId)}
								bind:innerText={note.content}
								class=" max-w-full rounded-md border-gray-600/40 px-2 py-1"
							>
								{note.content}
							</p>
						</div>
						<div>
							<button
								onclick={() => handleSelectNote(note.id)}
								class="p-0 text-sm text-red-500 hover:text-red-700"
							>
								✏️</button
							>
							<button
								onclick={(e) => {
									e.stopPropagation();
									notes.items = notes.items.filter(
										(item) => item.id !== note.id
									);
								}}
								class="p-0 text-sm text-red-500 hover:text-red-700"
							>
								×
							</button>
						</div>
					</div>
				</div>
			{/each}
			<div class="flex h-36 w-1/4 flex-col gap-2">
				<button
					class="hover:scale-10 bg-green-500 text-white"
					onclick={handleSaveNotes}>Save Notes</button
				>
				<button
					class="hover:scale-10 bg-purple-700 text-white"
					onclick={handleExportNotes}>Export Notes</button
				>
				<label
					class="w-full cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-center text-white transition-colors hover:bg-blue-600"
				>
					Import Notes
					<input
						type="file"
						accept=".json"
						onchange={handleImportNotes}
						class="hidden"
					/>
				</label>
			</div>
		</div>
	</aside>
{/if}
