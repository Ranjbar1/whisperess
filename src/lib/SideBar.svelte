<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { notes, type Note } from './hooks/notes.svelte';
	import { onMount } from 'svelte';
	import { exportTXT } from './utils/FileUtils';
	onMount(() => {
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
		class="scrollbar left-0 z-10 mt-16 flex h-screen w-screen flex-col gap-2 overflow-y-auto bg-slate-100"
	>
		<div class="container mx-auto flex flex-col gap-2 p-2 md:flex-row">
			<button
				class="hover:scale-10 bg-green-500 text-white"
				onmousedown={handleSaveNotes}>Save Notes</button
			>
			<button
				class="hover:scale-10 bg-purple-700 text-white"
				onmousedown={handleExportNotes}>Export Notes</button
			>
			<label
				class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-600"
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
		<div
			class="container mx-auto grid grid-cols-1 grid-rows-[repeat(1fr)] gap-2 p-2 md:grid-cols-2"
		>
			{#each notes.items as note (note.createdAt)}
				<div
					transition:fade|global
					class:flex-1={Boolean(note.id === notes.selectedNoteId)}
					class="w-full cursor-pointer rounded-md border border-gray-600/40 px-2 py-1 text-gray-700 focus-within:bg-gray-200 hover:bg-gray-200"
				>
					<div class="flex w-full flex-col items-start gap-2">
						<div class="flex w-full items-center gap-2">
							<h3
								contenteditable
								bind:innerText={note.title}
								class="flex-1 rounded-md px-2 text-start font-semibold outline-none transition-colors focus:bg-slate-50 focus:text-blue-600"
							>
								{note.title}
							</h3>

							<button
								onmousedown={() => handleSelectNote(note.id)}
								class="p-1 text-sm"
							>
								✏️</button
							>
							<button
								onmousedown={() => exportTXT(note.content)}
								class="p-1 text-sm"
							>
								💾</button
							>
							<button
								onmousedown={(e) => {
									e.stopPropagation();
									notes.items = notes.items.filter(
										(item) => item.id !== note.id
									);
								}}
								class="p-1 text-sm"
							>
								❌
							</button>
						</div>

						<p
							contenteditable
							class:truncate={!Boolean(note.id === notes.selectedNoteId)}
							bind:innerText={note.content}
							class=" max-w-full rounded-md px-2 py-1 outline-none transition-colors focus:bg-slate-50 focus:text-blue-600"
						>
							{note.content}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</aside>
{/if}
