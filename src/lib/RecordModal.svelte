<script lang="ts">
	import AudioRecorder from './AudioRecorder.svelte';
	import Modal from './Modal.svelte';
	let props: {
		show: boolean;
		onSubmit: (data: Blob | undefined) => void;
		onClose: () => void;
	} = $props();
	let audioBlob: Blob | undefined = $state();

	const onRecordingComplete = (blob: Blob) => {
		audioBlob = blob;
	};

	const onSubmit = () => {
		props.onSubmit(audioBlob);
		audioBlob = undefined;
	};

	const onClose = () => {
		props.onClose();
		audioBlob = undefined;
	};
</script>

<Modal
	show={props.show}
	title={'From Recording'}
	{onClose}
	submitText={'Load'}
	submitEnabled={audioBlob !== undefined}
	{onSubmit}
>
	{'Record audio using your microphone'}
	<AudioRecorder {onRecordingComplete} />
</Modal>
