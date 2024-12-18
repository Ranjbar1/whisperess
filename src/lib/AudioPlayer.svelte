<script lang="ts">
  import WaveSurfer from "wavesurfer.js";

  let props: {
    audioUrl: string;
    mimeType: string;
  } = $props();
  let audioPlayer: HTMLAudioElement;
  let audioSource: HTMLSourceElement;

  let wavesurfer: WaveSurfer;
  // Updates src when url changes
  $effect(() => {
    // if (audioPlayer && audioSource) {
    //   audioSource.src = props.audioUrl;
    //   audioPlayer.load();
    // }
    if (wavesurfer) {
      wavesurfer.destroy();
    }
    wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "white",
      progressColor: "cyan",
      barGap: 4,
      barWidth: 2,
      // mediaControls: true,
      autoCenter: true,
      barRadius: 3,
      normalize: true,
      url: props.audioUrl,
    });
    wavesurfer.on("interaction", () => {
      wavesurfer.playPause();
    });
  });
</script>

<div
  id="waveform"
  class="w-96 bg-slate-700 relative rounded-md p-5 border-cyan-400 border-2"
>
  <!-- <audio
    bind:this={audioPlayer}
    controls
    class="w-full h-14 rounded-lg bg-white shadow-xl ring-1 ring-slate-700/10"
  >
    <source bind:this={audioSource} type={props.mimeType} />
  </audio> -->
</div>
