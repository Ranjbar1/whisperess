<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { scale } from 'svelte/transition';

	type Props = {
		show: boolean;
		onClose: () => void;
		onSubmit: (url?: string) => void;
		submitText?: string;
		submitEnabled?: boolean;
		title: string | Component;
		children: Snippet;
	} & Partial<Pick<HTMLDialogAttributes, 'oncancel' | 'onclose'>>;
	let {
		show = $bindable<boolean>(false),
		onClose,
		onSubmit,
		title,
		children,
		submitText,
		submitEnabled = true
	}: Props = $props();
	let dialog: HTMLDialogElement;
	$effect(() => {
		// Reference the dialog close event handler.
		if (!show && dialog.open) dialog.close();
		if (show && !dialog.open) {
			document.body.style.overflow = 'hidden';
			dialog.showModal();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->

<dialog
	bind:this={dialog}
	class=" flex items-center justify-center overflow-clip bg-transparent backdrop:bg-transparent/50"
	onclose={() => {
		document.body.style.overflow = 'visible';
		show = false;
	}}
	onmousedown={(e) => {
		if (e.currentTarget !== e.target) return;
		const rect = dialog.getBoundingClientRect();
		const isBackdropClick =
			e.clientX < rect.left ||
			e.clientX > rect.right ||
			e.clientY < rect.top ||
			e.clientY > rect.bottom;
		if (isBackdropClick) dialog.close();
	}}
>
	{#if show}
		<div
			in:scale={{ duration: 600 }}
			class=" flex flex-col gap-5 rounded-md border border-slate-400 bg-slate-200 p-10 text-center"
		>
			<h1 class="text-2xl">{title}</h1>
			<div class="mt-3 flex-1 text-sm text-gray-500">
				{@render children?.()}
			</div>

			<div class="mt-4 flex flex-row-reverse">
				{#if submitText}
					<button
						type="button"
						disabled={!submitEnabled}
						class={`ml-4 inline-flex justify-center rounded-md border border-transparent ${
							submitEnabled ? 'bg-indigo-600' : 'bg-grey-300'
						} px-4 py-2 text-sm font-medium text-indigo-100 ${
							submitEnabled
								? 'hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
								: ''
						} transition-all duration-300`}
						onmousedown={() => onSubmit()}
					>
						{submitText}
					</button>
				{/if}

				<button
					type="button"
					class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 transition-all duration-300 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
					onmousedown={onClose}
				>
					Close
				</button>
			</div>
		</div>
	{/if}
</dialog>
