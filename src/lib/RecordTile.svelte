<script lang="ts">
	import type { Snippet } from 'svelte';
	import RecordModal from './RecordModal.svelte';
	import Tile from './Tile.svelte';
	let props: {
		icon: Snippet;
		text: string;
		setAudioData: (data: Blob) => void;
	} = $props();

	let show = $state(false);

	const onClick = () => {
		show = true;
	};

	const onClose = () => {
		show = false;
	};

	const onSubmit = (data: Blob | undefined) => {
		if (data) {
			props.setAudioData(data);
			onClose();
		}
	};
</script>

<Tile icon={props.icon} text={props.text} {onClick} />
<RecordModal bind:show {onSubmit} {onClose} />
