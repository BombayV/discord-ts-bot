<script lang="ts">
  import {getContext} from "svelte";
  export let data;

  const user = getContext("user");
</script>

<p>{JSON.stringify(data.server)}</p>