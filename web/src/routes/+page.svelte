<script lang="ts">
  import { onMount } from 'svelte';
  let isConnected: boolean = false;
  let ws: WebSocket | null = null;
  let messages: string[] = [];

  onMount(() => {
    ws = new WebSocket('ws://obliged-noel-bombay.koyeb.app/ws');

    ws.onmessage = (event) => {
      if (!isConnected && event.data) {
        isConnected = true;
        console.log('connected');
      } else {
        messages = [...messages, event.data as string];
      }
    };

    ws.onclose = () => {
      console.log('disconnected');
      isConnected = false;
    };
  });
</script>

<div>
  {#if isConnected}
    <p>Connected</p>
  {:else}
    <p>Not connected</p>
  {/if}
</div>
{#if ws && isConnected}
  {#each messages as message}
    <p>{message}</p>
  {/each}
  <button on:click={() => ws?.close()}>Disconnect</button>
{/if}