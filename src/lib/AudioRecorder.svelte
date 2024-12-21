<script lang="ts">
	import AudioPlayer from './AudioPlayer.svelte';
	import { formatAudioTimestamp } from './utils/AudioUtils';
	import { webmFixDuration } from './utils/BlobFix';
	let props: {
		onRecordingComplete: (blob: Blob) => void;
	} = $props();

	function getMimeType() {
		const types = [
			'audio/webm',
			'audio/mp4',
			'audio/ogg',
			'audio/wav',
			'audio/aac'
		];
		for (let i = 0; i < types.length; i++) {
			if (MediaRecorder.isTypeSupported(types[i])) {
				return types[i];
			}
		}
		return undefined;
	}

	let recording = $state(false);
	let duration = $state(0);
	let recordedBlob: Blob | null = $state(null);

	let streamRef: MediaStream | null = null;
	let mediaRecorderRef: MediaRecorder | null = null;
	let chunksRef: Blob[] = [];

	// let audioRef: HTMLAudioElement | null = $state(null);

	const startRecording = async () => {
		// Reset recording (if any)
		recordedBlob = null;

		let startTime = Date.now();

		try {
			if (!(streamRef as unknown as MediaStream)) {
				streamRef = await navigator.mediaDevices.getUserMedia({
					audio: true
				});
			}

			const mimeType = getMimeType();
			const mediaRecorder = new MediaRecorder(streamRef as MediaStream, {
				mimeType
			});

			mediaRecorderRef = mediaRecorder;

			mediaRecorder.addEventListener('dataavailable', async (event) => {
				if (event.data.size > 0) {
					chunksRef.push(event.data);
				}
				if (mediaRecorder.state === 'inactive') {
					const duration = Date.now() - startTime;

					// Received a stop event
					let blob = new Blob(chunksRef, { type: mimeType });

					if (mimeType === 'audio/webm') {
						blob = await webmFixDuration(blob, duration, blob.type);
					}

					recordedBlob = blob;
					props.onRecordingComplete(blob);

					chunksRef = [];
				}
			});
			mediaRecorder.start();
			recording = true;
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef && mediaRecorderRef.state === 'recording') {
			mediaRecorderRef.stop(); // set state to inactive
			duration = 0;
			recording = false;
		}
	};

	$effect(() => {
		let stream: MediaStream | null = null;

		if (recording) {
			const timer = setInterval(() => {
				duration += 1;
			}, 1000);

			return () => {
				clearInterval(timer);
			};
		}

		return () => {
			if (stream) {
				(stream as unknown as MediaStream)
					.getTracks()
					.forEach((track) => track.stop());
			}
		};
	});

	const handleToggleRecording = () => {
		if (recording) {
			stopRecording();
		} else {
			startRecording();
		}
	};
</script>

<div class="flex flex-col items-center justify-center">
	<button
		type="button"
		class={`m-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
			recording
				? 'bg-red-500 hover:bg-red-600'
				: 'bg-green-500 hover:bg-green-600'
		}`}
		onclick={handleToggleRecording}
	>
		{recording
			? `Stop Recording (${formatAudioTimestamp(duration)})`
			: 'Start Recording'}
	</button>
	{#if recordedBlob}
		<AudioPlayer
			audioUrl={URL.createObjectURL(recordedBlob)}
			mimeType={recordedBlob.type}
		/>
	{/if}
</div>
