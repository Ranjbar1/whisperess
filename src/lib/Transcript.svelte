<script lang="ts">
  import { fade } from "svelte/transition";
  import Editor from "./Editor.svelte";
  import { transcript } from "./hooks/transcriber.svelte";
  import { formatAudioTimestamp } from "./utils/AudioUtils";
  import Modal from "./Modal.svelte";
  import { exportJSON, exportTXT } from "./utils/FileUtils";

  let transcribedData = $derived($transcript);

  let view = $state<HTMLDivElement | null>(null);
  let showEditor = $state(false);
  let chunks = $derived(transcribedData?.chunks ?? []);
  let text = $derived.by(() =>
    chunks
      .map((chunk) => chunk.text)
      .join("")
      .trim()
  );

  // Scroll to the bottom when the component updates
  $effect.pre(() => {
    if (view) {
      const diff = Math.abs(
        view.offsetHeight + view.scrollTop - view.scrollHeight
      );

      if (chunks.length && diff <= 64) {
        // We're close enough to the bottom, so scroll to the bottom
        view.scrollTop = view.scrollHeight;
        view.scroll({
          behavior: "smooth",
        });
      }
    }
  });
</script>

<div
  bind:this={view}
  class="w-full flex flex-col my-2 p-4 max-h-[20rem] overflow-y-auto scrollbar"
>
  {#if chunks}
    {#each chunks as chunk}
      <div
        transition:fade|global
        class="w-full flex flex-row mb-2 bg-white rounded-lg p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
      >
        <div class="mr-5">{formatAudioTimestamp(chunk.timestamp[0])}</div>
        {chunk.text}
      </div>
    {/each}
  {/if}
  {#if transcribedData && !transcribedData.isBusy}
    <div class="w-full text-right flex flex-row-reverse">
      {@render Button("📝 Edit before export", () => {
        showEditor = !showEditor;
      })}
      {@render Button("Export TXT", () => exportTXT(text))}
      {@render Button("Export JSON", () => exportJSON(transcribedData.chunks))}
    </div>
  {/if}
</div>
<Modal
  title="Edit transcript"
  show={showEditor}
  onClose={() => {
    showEditor = false;
  }}
  submitEnabled={false}
  onSubmit={() => {
    showEditor = false;
  }}
  ><div
    class="container flex flex-col my-2 p-4 max-h-[20rem] overflow-y-auto z-50"
  >
    <Editor />
  </div>
</Modal>
<!-- {#if showEditor}{/if} -->

{#snippet Button(text: string, action: () => void)}
  <button
    onclick={action}
    class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center"
  >
    {text}
  </button>
{/snippet}
