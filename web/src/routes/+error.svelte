<script>
  import { page } from '$app/stores';
  import { Button } from "flowbite-svelte";
</script>

<div class="h-screen flex flex-col items-center justify-center">
  <h1 class="text-9xl">{$page.status}</h1>
  <p class="text-2xl mt-3">{$page.error.message}</p>
  <Button href="/dashboard" class="mt-5">Go back</Button>
</div>