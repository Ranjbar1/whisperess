<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tile from './Tile.svelte';
	import UrlModal from './UrlModal.svelte';
	let props: {
		icon: Snippet;
		text: string;
		onUrlUpdate: (url?: string) => void;
	} = $props();
	let show: boolean = $state(false);

	const onClick = () => {
		show = true;
	};

	const onClose = () => {
		show = false;
	};

	const onSubmit = (url?: string) => {
		props.onUrlUpdate(url);
		onClose();
	};
</script>

<Tile icon={props.icon} text={props.text} {onClick} />
<UrlModal bind:show {onSubmit} {onClose} />
