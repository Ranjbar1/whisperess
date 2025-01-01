export type Note = {
	id: number;
	title: string;
	content: string;
	createdAt: number;
	updatedAt: number;
};

export type Notes = {
	items: Note[];
	showNotes: boolean;
	selectedNoteId?: Note['id'];
};

export const notes = $state<Notes>({
	items: [],
	showNotes: false
});
