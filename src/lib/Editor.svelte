<script lang="ts">
  import Quill, { Delta, type QuillOptions } from "quill";
  import "quill/dist/quill.snow.css";
  import { onMount } from "svelte";
  let { text } = $props();
  let quill;
  let delta;
  let editorOptions: QuillOptions = {
    theme: "snow",
    modules: {
      Editor: {
        scrollPastEdge: true,
      },
      toolbar: [
        [{ container: "#toolbar" }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        // [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        // [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
        ["link", "image", "video"],
      ],
    },
  };
  onMount(() => {
    quill = new Quill("#editor", editorOptions);
    delta = new Delta();
    delta.insert(text);
    quill.setContents(delta);
  });
</script>

<div id="toolbar" class="rounded-2xl"></div>
<div id="editor" class="rounded-3xl"></div>

<button>asd</button>
