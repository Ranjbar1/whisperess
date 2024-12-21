<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tile from './Tile.svelte';
	import RecordModal from './RecordModal.svelte';
	let props: {
		icon: Snippet;
		text: string;
		setAudioData: (data: Blob) => void;
	} = $props();
	let showModal = $state(false);

	const onClick = () => {
		showModal = true;
	};

	const onClose = () => {
		showModal = false;
	};

	const onSubmit = (data: Blob | undefined) => {
		if (data) {
			props.setAudioData(data);
			onClose();
		}
	};
</script>

<Tile icon={props.icon} text={props.text} {onClick} />
<RecordModal show={showModal} {onSubmit} {onClose} />
