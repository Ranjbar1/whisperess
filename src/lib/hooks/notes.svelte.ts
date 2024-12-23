export type Note = {
	id: string | number;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
};

export type Notes = {
	items: Note[];
	showNotes: boolean;
};

export const notes = $state<Notes>({
	items: [],
	showNotes: false
});
