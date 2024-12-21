<script lang="ts">
	import WaveSurfer from 'wavesurfer.js';

	let props: {
		audioUrl: string;
		mimeType: string;
	} = $props();

	let wavesurfer: WaveSurfer;
	// Updates src when url changes
	$effect(() => {
		if (wavesurfer) {
			wavesurfer.destroy();
		}
		wavesurfer = WaveSurfer.create({
			container: '#waveform',
			waveColor: 'white',
			progressColor: 'cyan',
			barGap: 4,
			barWidth: 2,
			autoCenter: true,
			barRadius: 3,
			normalize: true,
			url: props.audioUrl
		});
		wavesurfer.on('interaction', () => {
			wavesurfer.playPause();
		});
	});
</script>

<div
	id="waveform"
	class="relative w-96 rounded-md border-2 border-cyan-400 bg-slate-700 p-5"
></div>
