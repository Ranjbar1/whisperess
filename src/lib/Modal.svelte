<script lang="ts">
  import type { Component, Snippet } from "svelte";
  import { fly } from "svelte/transition";

  export interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    submitText?: string;
    submitEnabled?: boolean;
    title: string | Component;
    children: Snippet;
  }
  let {
    show,
    onClose,
    onSubmit,
    title,
    children,
    submitText,
    submitEnabled = true,
  }: Props = $props();
  let dialog = $state<HTMLDialogElement>();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->

<dialog
  bind:this={dialog}
  open={show}
  transition:fly={{ duration: 2000 }}
  class="relative z-10"
  onclose={() => (show = false)}
  onclick={(e) => {
    if (e.target === dialog) dialog.close();
  }}
>
  <div
    class="fixed inset-0 min-h-[40dvh] flex flex-col items-center justify-center backdrop-blur-sm bg-gray-100/50 overflow-y-auto"
  >
    <div
      class=" bg-slate-200 rounded-md p-10 border-slate-400 border text-center flex flex-col gap-5"
    >
      <h1 class="text-2xl">{title}</h1>
      <div class="mt-3 text-sm text-gray-500 flex-1">
        {@render children?.()}
      </div>

      <div class="mt-4 flex flex-row-reverse">
        {#if submitText}
          <button
            type="button"
            disabled={!submitEnabled}
            class={`inline-flex ml-4 justify-center rounded-md border border-transparent ${
              submitEnabled ? "bg-indigo-600" : "bg-grey-300"
            } px-4 py-2 text-sm font-medium text-indigo-100 ${
              submitEnabled
                ? "hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                : ""
            } transition-all duration-300`}
            onclick={onSubmit}
          >
            {submitText}
          </button>
        {/if}

        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-300"
          onclick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
</dialog>
