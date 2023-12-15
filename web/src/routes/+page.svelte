<script>
  import { Button } from 'flowbite-svelte';
</script>

<form
    class="w-96 flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    action="?/login"
    method="POST"
>
  <div class="flex flex-col mb-8 gap-y-2 text-center">
    <h1 class="text-4xl font-bold">Bombay Bot</h1>
    <p class="font-light">Login to your Discord account</p>
  </div>
  <Button type="submit">Login account</Button>
</form>