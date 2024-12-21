<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tile from './Tile.svelte';
	import SettingsModal from './SettingsModal.svelte';

	let props: {
		icon: Snippet;
		class?: string;
	} = $props();
	let showModal = $state(false);

	const onClick = () => {
		showModal = true;
	};

	const onClose = () => {
		showModal = false;
	};

	const onSubmit = (url: string) => {
		onClose();
	};
</script>

<div class={props.class}>
	<Tile icon={props.icon} {onClick} />
	<SettingsModal show={showModal} {onSubmit} {onClose} />
</div>
