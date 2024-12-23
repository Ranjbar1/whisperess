<script lang="ts">
	import Modal from './Modal.svelte';
	import UrlInput from './UrlInput.svelte';
	import Constants from './utils/Constants';

	let {
		show = $bindable<boolean>(),
		onSubmit,
		onClose
	}: {
		show: boolean;
		onSubmit: (url?: string) => void;
		onClose: () => void;
	} = $props();
	let url = $state(Constants.DEFAULT_AUDIO_URL);

	const onChange = (event: { target: { value: any } }) => {
		url = event.target.value;
	};

	const handleSubmit = () => {
		onSubmit(url);
	};
</script>

<Modal
	bind:show
	title={'Import From URL'}
	{onClose}
	submitText={'Load'}
	onSubmit={handleSubmit}
>
	Enter the URL of the audio file you want to load.<UrlInput
		{onChange}
		value={url}
	/>
</Modal>
