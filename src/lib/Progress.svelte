<script lang="ts">
	let {
		text,
		percentage
	}: {
		text: string;
		percentage: number;
	} = $props();
	percentage = percentage ?? 0;
</script>

<div
	class="background-bg-cyan-400 border-1 relative mt-0.5 w-full overflow-hidden rounded-lg border-gray-400 bg-gray-200 text-left text-sm text-white"
>
	<div
		class="top-0 h-full whitespace-nowrap bg-blue-500 px-2"
		style:width={`${percentage}%`}
	>
		{text}
		{`${percentage.toFixed(2)}%`}
	</div>
</div>
