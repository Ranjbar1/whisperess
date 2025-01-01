<script lang="ts">
	let { progress }: { progress: string } = $props();
</script>

<div class="h-1 w-full rounded-full bg-gray-200">
	<div
		class="h-1 rounded-full bg-blue-600 transition-all duration-100"
		style:width={progress}
	></div>
</div>
