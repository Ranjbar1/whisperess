<script lang="ts">
  import { fly } from "svelte/transition";
  import AudioManager from "./lib/AudioManager.svelte";
  import Transcript from "./lib/Transcript.svelte";
</script>

<main>
  <div class="flex justify-center items-center min-h-[100dvh]">
    <div class="container flex flex-col justify-center items-center gap-4">
      <h1
        class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl text-center"
      >
        Whisperess
        <!-- <span class="animate-pulse">🎤</span> -->
      </h1>
      <h2
        class="mt-3 mb-5 px-4 text-center text-1xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
      >
        ML-powered speech recognition directly in your browser
      </h2>
      <AudioManager />
      <Transcript />
    </div>

    <!-- <div class="absolute bottom-4">
      Made with 
      <a class="underline" href="https://github.com/xenova/transformers.js">
        🤗 Transformers.js
      </a>
    </div> -->
  </div>
</main>
