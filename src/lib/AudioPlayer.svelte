<script lang="ts">
  let props: {
    audioUrl: string;
    mimeType: string;
  } = $props();
  let audioPlayer: HTMLAudioElement;
  let audioSource: HTMLSourceElement;

  // Updates src when url changes
  $effect(() => {
    if (audioPlayer && audioSource) {
      audioSource.src = props.audioUrl;
      audioPlayer.load();
    }
  });
</script>

<div class="flex relative z-10 p-4 w-full">
  <audio
    bind:this={audioPlayer}
    controls
    class="w-full h-14 rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
  >
    <source bind:this={audioSource} type={props.mimeType} />
  </audio>
</div>
