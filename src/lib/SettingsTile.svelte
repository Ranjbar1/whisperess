<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tile from './Tile.svelte';
	import SettingsModal from './SettingsModal.svelte';

	let props: {
		icon: Snippet;
		class?: string;
	} = $props();
	let show = $state(false);

	const onClick = () => {
		show = true;
	};

	const onClose = () => {
		show = false;
	};

	const onSubmit = () => {
		onClose();
	};
</script>

<div class={props.class}>
	<Tile icon={props.icon} {onClick} />
	<SettingsModal bind:show {onSubmit} {onClose} />
</div>
