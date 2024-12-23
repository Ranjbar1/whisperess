<script lang="ts">
	import AudioRecorder from './AudioRecorder.svelte';
	import Modal from './Modal.svelte';
	let {
		show = $bindable<boolean>(),
		onSubmit,
		onClose
	}: {
		show: boolean;
		onSubmit: (data: Blob | undefined) => void;
		onClose: () => void;
	} = $props();
	let audioBlob: Blob | undefined = $state();

	const onRecordingComplete = (blob: Blob) => {
		audioBlob = blob;
	};

	const handleSubmit = () => {
		onSubmit(audioBlob);
		audioBlob = undefined;
	};

	const handleClose = () => {
		onClose();
		audioBlob = undefined;
	};
</script>

<Modal
	bind:show
	title={'From Recording'}
	onClose={handleClose}
	submitText={'Load'}
	submitEnabled={audioBlob !== undefined}
	onSubmit={handleSubmit}
>
	{'Record audio using your microphone'}
	<AudioRecorder {onRecordingComplete} />
</Modal>
