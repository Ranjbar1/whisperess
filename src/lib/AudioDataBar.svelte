<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	let { progress }: { progress?: number } = $props();
</script>


<ProgressBar progress={`${Math.round(Number(progress) * 100)}%`} />
