<script lang="ts">
  import type { DiscordUser } from "$lib/typings/DiscordUser";
  import type {DiscordGuild} from "$lib/typings/DiscordGuild";
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import {writable} from "svelte/store";
  import { setContext } from 'svelte';

  export let data;

  const user = writable<DiscordUser | null>(null);
  const servers = writable<DiscordGuild[]>([]);

  $: user.set(data.props.user)
  $: servers.set(data.props.servers)
  $: activeUrl = $page.url.pathname;

  let loading = false;
  const handleSignOut = () => {
    loading = true;
    // @ts-ignore
    return async ({ update }) => {
      loading = false;
      update();
    }
  }

  setContext('user', user)
  setContext('servers', servers)
</script>

<div class="relative">
  <Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b">
    <NavBrand href="/dashboard" class="px-6 gap-x-4">
      <img src="/images/bot.png" class="h-8 sm:h-10" alt="Flowbite Logo" />
      <span class="self-center whitespace-nowrap text-xl font-semibold text-text-800">Bombay Bot</span>
    </NavBrand>
    <div class="flex items-center md:order-2">
      <Avatar id="avatar-menu" class="cursor-pointer" src={$user?.avatar} alt="Avatar" />
      <NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
      <DropdownHeader>
        {#if $user?.username && $user?.email}
          <span class="block text-sm">{$user.username}</span>
          <span class="block truncate text-sm font-medium">{$user.email}</span>
        {/if}
      </DropdownHeader>
      <form class="w-full" method="POST" action="?/logout" use:enhance={handleSignOut}>
        <DropdownItem type="submit" disabled={loading}>
          Logout
        </DropdownItem>
      </form>
    </Dropdown>
    <NavUl {activeUrl}>
      <NavLi href="/dashboard" active={true}>Home</NavLi>
      <NavLi class="cursor-pointer">
        Servers
        <ChevronDownOutline class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" />
      </NavLi>
      <Dropdown class="w-44 z-20">
        {#each $servers as server (server.id)}
          <DropdownItem class="flex items-center justify-between w-full" href={server.bot_in_guild ? `/dashboard/${server.id}` : `https://discord.com/oauth2/authorize?client_id=777055108013752320&permissions=1204972162066&scope=bot&guild_id=${server.id}`}>
            <div class="flex items-center w-5/6 relative overflow-hidden">
              <Avatar class="mr-2 w-8 h-8" src={server.icon} alt="Avatar" />
              <span
                  class={`pr-2 overflow-ellipsis w-full overflow-hidden ${activeUrl === `/dashboard/${server.id}` ? 'text-primary-700' : ''}`}
              >{server.name}</span>
            </div>
            <span class="w-1/6 flex items-center justify-center">
              {#if !server.bot_in_guild}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-[1.15rem] h-[1.15rem]">
                <path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            {/if}
            </span>
          </DropdownItem>
        {/each}
      </Dropdown>
    </NavUl>
  </Navbar>
  <slot/>
</div>