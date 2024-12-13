<script lang="ts">
  let { progress }: { progress: string } = $props();
</script>

<div class="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
  <div
    class="bg-blue-600 h-1 rounded-full transition-all duration-100"
    style:width={progress}
  ></div>
</div>
