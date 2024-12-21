<script lang="ts">
	import Quill, { Delta, type QuillOptions } from 'quill';
	import 'quill/dist/quill.snow.css';
	import { transcript } from './hooks/transcriber.svelte';

	import { onMount } from 'svelte';
	let transcribedData = $derived($transcript);
	let chunks = $derived(transcribedData?.chunks ?? []);
	let text = $derived.by(() =>
		chunks
			.map((chunk) => chunk.text)
			.join('')
			.trim()
	);
	let quill: Quill;
	let delta;
	let editorOptions: QuillOptions = {
		theme: 'snow',
		modules: {
			toolbar: [
				[{ container: '#toolbar' }],
				['bold', 'italic', 'underline', 'strike'],
				['blockquote', 'code-block'],
				// [{ header: 1 }, { header: 2 }],
				[{ list: 'ordered' }, { list: 'bullet' }],
				// [{ script: "sub" }, { script: "super" }],
				[{ indent: '-1' }, { indent: '+1' }],
				[{ direction: 'rtl' }],
				[{ size: ['small', false, 'large', 'huge'] }],
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				[{ color: [] }, { background: [] }],
				[{ font: [] }],
				[{ align: [] }],
				['clean'],
				['link', 'image', 'video']
			]
		}
	};
	onMount(() => {
		quill = new Quill('#editor', editorOptions);
		delta = new Delta();
		delta.insert(text);
		quill.setContents(delta);
	});
</script>

<div class="container flex flex-col items-center justify-center gap-4">
	<div id="toolbar"></div>
	<div id="editor"></div>
	<!-- <button></button> -->
</div>
