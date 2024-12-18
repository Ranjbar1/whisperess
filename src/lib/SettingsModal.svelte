<script lang="ts">
  import {
    language,
    model,
    multilingual,
    quantized,
    subtask,
  } from "./hooks/transcriber.svelte";
  import Modal from "./Modal.svelte";
  import { LANGUAGES, titleCase } from "./utils/Constants";

  let props: {
    show: boolean;
    onSubmit: (url: string) => void;
    onClose: () => void;
  } = $props();
  const names = Object.values(LANGUAGES).map(titleCase);

  const models = {
    // Original checkpoints
    "Xenova/whisper-tiny": [41, 152],
    "Xenova/whisper-base": [77, 291],
    "Xenova/whisper-small": [249],
    "Xenova/whisper-medium": [776],

    // Distil Whisper (English-only)
    "distil-whisper/distil-medium.en": [402],
    "distil-whisper/distil-large-v2": [767],
  } as any;
</script>

<Modal
  show={props.show}
  title={"Settings"}
  onClose={props.onClose}
  onSubmit={() => {}}
>
  <label for="model">Select the model to use.</label>
  <select
    id="model"
    name="model"
    class="mt-1 mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    bind:value={$model}
  >
    {#each Object.keys(models as any)
      .filter((key) => $quantized || models[key].length == 2)
      .filter((key) => !$multilingual || !key.startsWith("distil-whisper/")) as key}
      <option value={key}
        >{`${key}${
          $multilingual || key.startsWith("distil-whisper/") ? "" : ".en"
        } (${models[key][$quantized ? 0 : 1]}MB)`}</option
      >
    {/each}
  </select>
  <div class="flex justify-between items-center mb-3 px-1">
    <div class="flex">
      <input id="multilingual" type="checkbox" bind:checked={$multilingual} />
      <label for={"multilingual"} class="ms-1"> Multilingual </label>
    </div>
    <div class="flex">
      <input id="quantize" type="checkbox" bind:checked={$quantized} />
      <label for={"quantize"} class="ms-1"> Quantized </label>
    </div>
  </div>
  {#if $multilingual}
    <label for="">Select the source language.</label>
    <select
      class="mt-1 mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
      class="mt-1 mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      bind:value={$subtask}
    >
      <option value={"transcribe"}>Transcribe</option>
      <option value={"translate"}>Translate (to English)</option>
    </select>
  {/if}
</Modal>
