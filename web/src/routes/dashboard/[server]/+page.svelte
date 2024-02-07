<script lang="ts">
  import {getContext, onMount} from "svelte";
  import { NewWS } from "$lib/utils/NewWS";
  import {Button, Input } from "flowbite-svelte";
  import type {DiscordMessage} from "$lib/typings/DiscordMessage";
  import type {PanelOption} from "$lib/typings/PanelOption";
  import {fetcher} from "$lib/utils/fetcher";
  import { page } from "$app/stores";

  export let data;

  const serverOptions: Array<PanelOption> = [
    {
      value: "moderation",
      label: "Moderation",
      description: "Moderate your server with ease. Setup filters, rules, and more.",
      icon: (`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fill-primary-950 min-w-[2rem] min-h-[1rem] h-8 w-8">
          <path d="M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 0 1 2.25 0v10.937a4.505 4.505 0 0 0-3.25 2.373 8.963 8.963 0 0 1 4-.935A.75.75 0 0 0 18 15v-2.266a3.368 3.368 0 0 1 .988-2.37 1.125 1.125 0 0 1 1.591 1.59 1.118 1.118 0 0 0-.329.79v3.006h-.005a6 6 0 0 1-1.752 4.007l-1.736 1.736a6 6 0 0 1-4.242 1.757H10.5a7.5 7.5 0 0 1-7.5-7.5V6.375a1.125 1.125 0 0 1 2.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 0 1 2.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875Z" />
        </svg>
      `)
    },
    {
      value: "logs",
      label: "Logs",
      description: "Keep track of everything that happens in your server.",
      icon: (`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fill-primary-950 min-w-[2rem] min-h-[1rem] h-8 w-8">
          <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
        </svg>
      `)
    },
    {
      value: "commands",
      label: "Commands",
      description: "Modify existing commands or create new ones. The possibilities are endless.",
      icon: (`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fill-primary-950 min-w-[2rem] min-h-[1rem] h-8 w-8">
          <path fill-rule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
        </svg>
      `)
    },
    {
      value: "polls",
      label: "Polls",
      description: "Create polls for your server members to vote on such as what game to play next.",
      icon: (`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fill-primary-950 min-w-[2rem] min-h-[1rem] h-8 w-8">
          <path fill-rule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clip-rule="evenodd" />
          <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
        </svg>
      `)
    },
    {
      value: "music",
      label: "Music",
      description: "Play and control music from the comfort of the panel. Queue songs, skip, and more.",
      icon: (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fill-primary-950 min-w-[2rem] min-h-[1rem] h-8 w-8">
          <path fill-rule="evenodd" d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z" clip-rule="evenodd" />
        </svg>`
      )
    }
  ]



  let currentData;
  $: data,  (()=>{
    // and here you do the update (its like watch in vuejs)
    // document.title = `Page ${data.title}`;
    console.log(data)
    currentData = data;
  })();

  let ws: WebSocket | null = null;
  let isConnected = false;
  let currentMessages: DiscordMessage[] = [];
  $: currentNickname = "";
  $: currentDefaultData = {
    membersSize: 0,
    textChannelsSize: 0,
    voiceChannelsSize: 0,
    rolesSize: 0
  }
  const user = getContext("user");
  const servers = getContext("servers");
  $: currentServer = $servers.find(s => s.id === currentData.server);

  const postNickname = async () => {
    const resp = await fetcher('/setNickname', {
      nickname: currentNickname,
      server_id: currentData.server
    })

    if (resp.status === 200) {
      console.log("Nickname updated");
    }
  }

  onMount(() => {
    ws = NewWS() as WebSocket;
    if (!ws) return;

    ws.onopen = () => {
      console.log("connected");
      isConnected = true;
      if (ws) {
        ws.send(JSON.stringify({
          type: "server_id",
          data: {
            server_id: data.server
          }
        }))
      }
    }

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "message") {
        currentMessages = [...currentMessages, data.data];
      } else if (data.type === 'default_data') {
        currentDefaultData = {
          membersSize: data.data.membersSize,
          textChannelsSize: data.data.textChannelsSize,
          voiceChannelsSize: data.data.voiceChannelsSize,
          rolesSize: data.data.rolesSize
        }
        currentNickname = data.data.nickname;
      }
    }

    ws.onclose = () => {
      console.log("disconnected");
      isConnected = false;
      if (ws) {
        ws.send(JSON.stringify({
          type: "disconnect",
          data: {
            server_id: data.server
          }
        }))
      }
    }

    return () => {
      if (ws) {
        ws.close();
        isConnected = false;
      }
    }
  })
</script>

<div class="pt-28 pb-16 px-8 grid grid-cols-1 gap-y-4 w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto">
  <div class="flex items-center gap-x-4 bg-glass-secondary px-5 py-4 rounded-lg justify-between">
    <img src={currentServer.icon} alt="server icon" class="w-14 h-14 rounded-full ring-[4px] ring-accent-400">
    <h1 class="font-bold text-3xl">{currentServer.name}</h1>
    <Button href="/dashboard">
      Back
    </Button>
  </div>
  <div class="grid gap-y-4 lg:grid-cols-2 lg:gap-x-4">
    <div class="flex flex-col gap-y-4">
      <div class="bg-glass-primary rounded-lg px-5 py-4 gap-y-1 flex flex-col text-sm">
        <p class="uppercase font-semibold tracking-widest mb-2">Server Info</p>
        <p class="flex justify-between gap-x-2">Members: <span>{currentDefaultData.membersSize || 0}</span></p>
        <p class="flex justify-between gap-x-2">Text Channels: <span>{currentDefaultData.textChannelsSize || 0}</span></p>
        <p class="flex justify-between gap-x-2">Voice Channels: <span>{currentDefaultData.voiceChannelsSize || 0}</span></p>
        <p class="flex justify-between gap-x-2">Roles: <span>{currentDefaultData.rolesSize || 0}</span></p>
      </div>
      <div class="bg-glass-primary rounded-lg px-5 py-4 gap-y-1 flex flex-col text-sm">
        <p class="uppercase font-semibold tracking-widest mb-2">Bot Settings</p>
        <div class="flex flex-col gap-y-2">
          <p class="text-sm">Nickname</p>
          <Input type="text" id="bot_name" placeholder="Bombay Bot" size="sm" value={currentNickname} on:input={(e) => currentNickname = e.target.value} />
        </div>
        <Button class="w-16 mt-2" size="xs"
          on:click={postNickname}
        >Save</Button>
      </div>
    </div>
    <div class="bg-glass-primary rounded-lg px-5 py-4 max-h-[22rem] min-h-40 overflow-y-auto flex flex-col h-full">
      <div class="flex justify-between">
        <p class="uppercase text-sm font-semibold tracking-widest">Active Chat</p>
        {#if isConnected}
          <p class="uppercase text-sm font-semibold tracking-widest">Connected</p>
        {/if}
      </div>
      <div class="flex flex-col items-center overflow-y-auto grow justify-center mt-1">
        {#if isConnected && currentMessages.length > 0}
          <div class="grow w-full">
            {#each currentMessages as message}
              <div class="flex flex-col w-full items-start h-fit bg-accent-50 px-2 py-2 rounded-lg mt-2">
                <div class="flex justify-between items-center w-full text-sm font-medium">
                  <p>{message.author}</p>
                  <a class="underline" target="_blank" href={`https://discord.com/channels/1087498133359054889/${message.channelId}/${message.id}`}>#{message.channelName}</a>
                </div>
                <p class="text-sm">{message.content}</p>
              </div>
            {/each}
          </div>
        {:else if isConnected && currentMessages.length === 0}
          <p class="text-2xl font-light">No messages</p>
        {:else}
          <p class="text-2xl font-light">Disconnected</p>
        {/if}
      </div>
    </div>
  </div>
  <div class="bg-glass-primary rounded-lg px-5 py-4 gap-y-1 flex flex-col text-sm">
    <p class="uppercase font-semibold tracking-widest mb-2">Modules</p>
    <div class="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-2 h-full">
      {#each serverOptions as option}
        <div class="flex justify-between items-center bg-glass-white px-3 py-2 gap-x-6">
          <div>
            <p class="text-base font-medium">{option.label}</p>
            <p class="text-sm font-light">{option.description}</p>
          </div>
          {@html option.icon}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  ::-webkit-scrollbar {
    width: 0px;
  }
</style>