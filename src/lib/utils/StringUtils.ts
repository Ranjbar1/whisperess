export const getWordCount = (text: string) => {
	const strippedText = text.replace(/<[^>]*>/g, ' ');
	return strippedText
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
};

export const getCharacterCount = (text: string) => {
	const strippedText = text.replace(/<[^>]*>/g, '');
	return strippedText.length;
};
