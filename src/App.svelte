<script lang="ts">
	import { scale } from 'svelte/transition';
	import AudioManager from './lib/AudioManager.svelte';
	import SideBar from './lib/SideBar.svelte';
	import StatusBar from './lib/StatusBar.svelte';
	import Transcript from './lib/Transcript.svelte';
</script>

<StatusBar />
<SideBar />
<main transition:scale={{ duration: 1000 }} class="bg-gradient">
	<div class="container flex min-h-[100dvh] items-center justify-center">
		<div class=" flex flex-col items-center justify-center gap-4">
			<h1
				transition:scale={{ duration: 500 }}
				class="text-center text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl text-shadow"
			>
				Whisperess
			</h1>
			<h2
				class="text-1xl mb-5 mt-3 px-4 text-center font-semibold tracking-tight text-slate-900 sm:text-2xl"
			>
				ML-powered speech recognition directly in your browser
			</h2>
			<AudioManager />
			<Transcript />
		</div>
	</div>
</main>
