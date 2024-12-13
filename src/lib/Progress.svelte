<script lang="ts">
  let {
    text,
    percentage,
  }: {
    text: string;
    percentage: number;
  } = $props();
  percentage = percentage ?? 0;
</script>

<div
  class="mt-0.5 w-full relative text-sm text-white background-bg-cyan-400 bg-gray-200 border-1 border-gray-400 rounded-lg text-left overflow-hidden"
>
  <div
    class="top-0 h-full bg-blue-500 whitespace-nowrap px-2"
    style:width={`${percentage}%`}
  >
    {text}
    {`${percentage.toFixed(2)}%`}
  </div>
</div>
