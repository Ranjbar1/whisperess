<script lang="ts">
	import axios from 'axios';
	import AudioDataBar from './AudioDataBar.svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import FileTile from './FileTile.svelte';
	import Progress from './Progress.svelte';
	import RecordTile from './RecordTile.svelte';
	import TranscribeButton from './TranscribeButton.svelte';
	import UrlTile from './UrlTile.svelte';
	import Constants from './utils/Constants';
	import SettingsTile from './SettingsTile.svelte';
	import {
		AudioSource,
		isBusy,
		isModelLoading,
		onInputChange,
		postRequest,
		progressItems,
		transcript,
		type AudioData
	} from './hooks/transcriber.svelte';
	import { fade, fly } from 'svelte/transition';

	let progress: number | undefined = $state(undefined);
	let audioData: AudioData = $state(undefined);
	let audioDownloadUrl: string | undefined = $state(undefined);

	let isAudioLoading = $derived(progress !== undefined);

	const resetAudio = () => {
		audioData = undefined;
		audioDownloadUrl = undefined;
	};

	const setAudioFromDownload = async (data: ArrayBuffer, mimeType: string) => {
		const audioCTX = new AudioContext({
			sampleRate: Constants.SAMPLING_RATE
		});
		const blobUrl = URL.createObjectURL(new Blob([data], { type: 'audio/*' }));
		const decoded = await audioCTX.decodeAudioData(data);
		audioData = {
			buffer: decoded,
			url: blobUrl,
			source: AudioSource.URL,
			mimeType: mimeType
		};
	};

	const setAudioFromRecording = async (data: Blob) => {
		resetAudio();
		progress = 0;
		const blobUrl = URL.createObjectURL(data);
		const fileReader = new FileReader();
		fileReader.onprogress = (event) => {
			progress = event.loaded / event.total || 0;
		};
		fileReader.onloadend = async () => {
			const audioCTX = new AudioContext({
				sampleRate: Constants.SAMPLING_RATE
			});
			const arrayBuffer = fileReader.result as ArrayBuffer;
			const decoded = await audioCTX.decodeAudioData(arrayBuffer);
			progress = undefined;
			audioData = {
				buffer: decoded,
				url: blobUrl,
				source: AudioSource.RECORDING,
				mimeType: data.type
			};
		};
		fileReader.readAsArrayBuffer(data);
	};

	const downloadAudioFromUrl = async (
		requestAbortController: AbortController
	) => {
		if (audioDownloadUrl) {
			try {
				audioData = undefined;
				progress = 0;
				const { data, headers } = (await axios.get(audioDownloadUrl, {
					signal: requestAbortController.signal,
					responseType: 'arraybuffer',
					onDownloadProgress(progressEvent) {
						progress = progressEvent.progress || 0;
					}
				})) as {
					data: ArrayBuffer;
					headers: { 'content-type': string };
				};

				let mimeType = headers['content-type'];
				if (!mimeType || mimeType === 'audio/wave') {
					mimeType = 'audio/wav';
				}
				setAudioFromDownload(data, mimeType);
			} catch (error) {
				console.error('Request failed or aborted', error);
			} finally {
				progress = undefined;
			}
		}
	};

	// When URL changes, download audio
	$effect(() => {
		if (audioDownloadUrl) {
			const requestAbortController = new AbortController();
			downloadAudioFromUrl(requestAbortController);
			return () => {
				requestAbortController.abort();
			};
		}
	});
</script>

<!-- class="flex flex-col items-center justify-center rounded-se-lg rounded-ss-lg bg-white shadow-xl shadow-black/5" -->

<div class="flex w-full flex-row items-center justify-center gap-6 p-2">
	<UrlTile
		icon={AnchorIcon}
		text={'From URL'}
		onUrlUpdate={(e) => {
			onInputChange($transcript);
			audioDownloadUrl = e;
		}}
	/>
	<!-- <VerticalBar /> -->
	<FileTile
		icon={FolderIcon}
		text={'From file'}
		onFileUpdate={(decoded, blobUrl, mimeType) => {
			onInputChange($transcript);
			audioData = {
				buffer: decoded,
				url: blobUrl,
				source: AudioSource.FILE,
				mimeType: mimeType
			};
		}}
	/>
	{#if navigator.mediaDevices}
		<!-- <VerticalBar /> -->
		<RecordTile
			icon={MicrophoneIcon}
			text={'Record'}
			setAudioData={(e) => {
				onInputChange($transcript);
				setAudioFromRecording(e);
			}}
		/>
	{/if}
</div>
<AudioDataBar progress={isAudioLoading ? progress : +!!audioData} />

{#if audioData}
	<AudioPlayer audioUrl={audioData.url} mimeType={audioData.mimeType} />

	<div class="relative flex w-full items-center justify-center">
		<TranscribeButton
			onmousedown={() => postRequest(audioData?.buffer)}
			isModelLoading={$isModelLoading}
			isTranscribing={$isBusy}
		/>

		<SettingsTile class="absolute right-4" icon={SettingsIcon} />
	</div>
	{#if $progressItems.length > 0}
		<div class="w-full space-y-2 p-4">
			<span>Loading model files... (only run once)</span>
			{#each $progressItems as data}
				<div transition:fade|global>
					<Progress text={data.file} percentage={data.progress} />
				</div>
			{/each}
		</div>
	{/if}
{/if}

{#snippet FolderIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
		/>
	</svg>
{/snippet}

{#snippet SettingsIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
		/>
		<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
	</svg>
{/snippet}

{#snippet MicrophoneIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
		/>
	</svg>
{/snippet}
{#snippet AnchorIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
		/>
	</svg>
{/snippet}
{#snippet VerticalBar()}
	<div class="w-[1px] bg-slate-200"></div>
{/snippet}
