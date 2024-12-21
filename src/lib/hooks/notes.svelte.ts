export type Note = {
	id: string;
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
	items: [
		{
			content: 'asd',
			title: 'asd',
			id: 'asd',
			createdAt: 'asd',
			updatedAt: 'asd'
		}
	],
	showNotes: false
});
