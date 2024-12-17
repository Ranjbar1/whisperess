<script lang="ts">
  import type { Snippet } from "svelte";
  import Tile from "./Tile.svelte";
  import UrlModal from "./UrlModal.svelte";
  let props: {
    icon: Snippet;
    text: string;
    onUrlUpdate: (url: string) => void;
  } = $props();
  let showModal: boolean = $state(false);

  const onClick = () => {
    showModal = true;
  };

  const onClose = () => {
    showModal = false;
  };

  const onSubmit = (url: string) => {
    props.onUrlUpdate(url);
    onClose();
  };
</script>

<Tile icon={props.icon} text={props.text} {onClick} />
<UrlModal  show={showModal} {onSubmit} {onClose} />
