<script lang="ts">
  import { fade } from "svelte/transition";
  import Editor from "./Editor.svelte";
  import { transcript } from "./hooks/transcriber.svelte";
  import { formatAudioTimestamp } from "./utils/AudioUtils";

  let transcribedData = $derived($transcript);

  let view: HTMLDivElement;
  let showEditor = $state(false);
  let chunks = $derived(transcribedData?.chunks ?? []);
  let text = $derived.by(() =>
    chunks
      .map((chunk) => chunk.text)
      .join("")
      .trim()
  );

  const saveBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  const exportTXT = () => {
    const blob = new Blob([text], { type: "text/plain" });
    saveBlob(blob, "transcript.txt");
  };

  const exportJSON = () => {
    let jsonData = JSON.stringify(transcribedData?.chunks ?? [], null, 2);

    // post-process the JSON to make it more readable
    const regex = /(    "timestamp": )\[\s+(\S+)\s+(\S+)\s+\]/gm;
    jsonData = jsonData.replace(regex, "$1[$2 $3]");

    const blob = new Blob([jsonData], { type: "application/json" });
    saveBlob(blob, "transcript.json");
  };

  // Scroll to the bottom when the component updates
  $effect.pre(() => {
    if (view) {
      const diff = Math.abs(
        view.offsetHeight + view.scrollTop - view.scrollHeight
      );

      if (diff <= 64) {
        // We're close enough to the bottom, so scroll to the bottom
        view.scrollTop = view.scrollHeight;
      }
    }
  });
</script>

<div
  bind:this={view}
  class="w-full flex flex-col my-2 p-4 max-h-[20rem] overflow-y-auto"
>
  {#if transcribedData?.chunks}
    {#each transcribedData.chunks as chunk}
      <div
        class="w-full flex flex-row mb-2 bg-white rounded-lg p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
      >
        <div class="mr-5">{formatAudioTimestamp(chunk.timestamp[0])}</div>
        {chunk.text}
      </div>
    {/each}
  {/if}
  {#if transcribedData && !transcribedData.isBusy}
    <div class="w-full text-right">
      <button
        onclick={() => {
          showEditor = !showEditor;
        }}
        class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center"
      >
        Edit before export
      </button>
      <button
        onclick={exportTXT}
        class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center"
      >
        Export TXT
      </button>
      <button
        onclick={exportJSON}
        class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center"
      >
        Export JSON
      </button>
    </div>
  {/if}
</div>
{#if showEditor}
  <div class="w-full flex flex-col my-2 p-4 max-h-[20rem] overflow-y-auto z-50">
    <Editor />
  </div>
{/if}
