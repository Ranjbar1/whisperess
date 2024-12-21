<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import AudioManager from './lib/AudioManager.svelte';
	import StatusBar from './lib/StatusBar.svelte';
	import Transcript from './lib/Transcript.svelte';
</script>

<StatusBar  />

<main transition:scale={{ duration: 1000 }} class="bg-gradient">
	<div class="container flex min-h-[100dvh] items-center justify-center">
		<div class=" flex flex-col items-center justify-center gap-4">
			<h1
				transition:scale={{ duration: 500 }}
				class="text-center text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl"
			>
				Whisperess
				<!-- <span class="animate-pulse">🎤</span> -->
			</h1>
			<h2
				class="text-1xl mb-5 mt-3 px-4 text-center font-semibold tracking-tight text-slate-900 sm:text-2xl"
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
