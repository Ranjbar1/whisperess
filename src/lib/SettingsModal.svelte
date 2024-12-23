<script lang="ts">
	import {
		language,
		model,
		multilingual,
		quantized,
		subtask
	} from './hooks/transcriber.svelte';
	import Modal from './Modal.svelte';
	import { LANGUAGES, titleCase } from './utils/Constants';

	let {
		show = $bindable<boolean>(),
		onSubmit,
		onClose
	}: {
		show: boolean;
		onSubmit: () => void;
		onClose: () => void;
	} = $props();
	const names = Object.values(LANGUAGES).map(titleCase);

	const models = {
		// Original checkpoints
		'Xenova/whisper-tiny': [41, 152],
		'Xenova/whisper-base': [77, 291],
		'Xenova/whisper-small': [249],
		'Xenova/whisper-medium': [776],

		// Distil Whisper (English-only)
		'distil-whisper/distil-medium.en': [402],
		'distil-whisper/distil-large-v2': [767]
	} as any;
</script>

<Modal bind:show title={'Settings'} {onClose} {onSubmit}>
	<label for="model">Select the model to use.</label>
	<select
		id="model"
		name="model"
		class="mb-1 mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		bind:value={$model}
	>
		{#each Object.keys(models as any)
			.filter((key) => $quantized || models[key].length == 2)
			.filter((key) => !$multilingual || !key.startsWith('distil-whisper/')) as key}
			<option value={key}
				>{`${key}${
					$multilingual || key.startsWith('distil-whisper/') ? '' : '.en'
				} (${models[key][$quantized ? 0 : 1]}MB)`}</option
			>
		{/each}
	</select>
	<div class="mb-3 flex items-center justify-between px-1">
		<div class="flex">
			<input id="multilingual" type="checkbox" bind:checked={$multilingual} />
			<label for={'multilingual'} class="ms-1"> Multilingual </label>
		</div>
		<div class="flex">
			<input id="quantize" type="checkbox" bind:checked={$quantized} />
			<label for={'quantize'} class="ms-1"> Quantized </label>
		</div>
	</div>
	{#if $multilingual}
		<label for="">Select the source language.</label>
		<select
			class="mb-3 mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			bind:value={$language}
		>
			{#each Object.keys(LANGUAGES) as key, i (key)}
				<option value={key}>
					{names[i]}
				</option>
			{/each}
		</select>
		<label for="">Select the task to perform.</label>
		<select
			class="mb-3 mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			bind:value={$subtask}
		>
			<option value={'transcribe'}>Transcribe</option>
			<option value={'translate'}>Translate (to English)</option>
		</select>
	{/if}
</Modal>
