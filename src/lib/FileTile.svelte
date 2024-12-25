<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tile from './Tile.svelte';
	import Constants from './utils/Constants';

	let props: {
		icon: Snippet;
		text: string;
		onFileUpdate: (
			decoded: AudioBuffer,
			blobUrl: string,
			mimeType: string
		) => void;
	} = $props();
	let elem = document.createElement('input');
	elem.type = 'file';
	elem.accept = 'audio/* , video/*';
	elem.oninput = (event) => {
		// Make sure we have files to use
		let files = (event.target as HTMLInputElement).files;
		if (!files) return;

		// Create a blob that we can use as an src for our audio element
		const urlObj = URL.createObjectURL(files[0]);
		const mimeType = files[0].type;

		const reader = new FileReader();
		reader.addEventListener('load', async (e) => {
			const arrayBuffer = e.target?.result as ArrayBuffer; // Get the ArrayBuffer
			if (!arrayBuffer) return;

			const audioCTX = new AudioContext({
				sampleRate: Constants.SAMPLING_RATE
			});

			const decoded = await audioCTX.decodeAudioData(arrayBuffer);

			props.onFileUpdate(decoded, urlObj, mimeType);
		});
		reader.readAsArrayBuffer(files[0]);

		// Reset files
		elem.value = '';
	};
</script>

<Tile icon={props.icon} text={props.text} onClick={() => elem.click()} />
