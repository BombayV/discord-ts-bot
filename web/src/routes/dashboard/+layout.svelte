<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';

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
</script>

<div class="relative px-8">
  <Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b">
    <NavBrand href="/">
      <img src="https://flowbite-svelte.com/images/flowbite-svelte-icon-logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
    </NavBrand>
    <div class="flex items-center md:order-2">
      <Avatar id="avatar-menu" class="cursor-pointer" src="https://cdn.discordapp.com/attachments/760985469151346720/1103432104517308477/IMG_3606.png?ex=6567ac3a&is=6555373a&hm=0613d7d806c9a54848a9328eee6596549b02be6cebeef4b39d4673dd90cb375a&" />
      <NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
      <DropdownHeader>
        <span class="block text-sm">Bonnie Green</span>
        <span class="block truncate text-sm font-medium">name@flowbite.com</span>
      </DropdownHeader>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Earnings</DropdownItem>
      <DropdownDivider />
      <form class="w-full" method="POST" action="?/logout" use:enhance={handleSignOut}>
        <DropdownItem type="submit">
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
        <DropdownItem href="/dashboard/">Register</DropdownItem>
        <DropdownItem href="/dashboard/">Consult</DropdownItem>
        <DropdownItem href="/dashboard/">Data Update</DropdownItem>
        <DropdownItem href="/dashboard/">Service Payment</DropdownItem>
      </Dropdown>
    </NavUl>
  </Navbar>
  <div style="height:800px;" class="overflow-scroll pb-16">
    <Skeleton class="mt-16 mb-8" />
    <ImagePlaceholder class="my-8" />
    <TextPlaceholder class="my-8" />
  </div>
  <slot/>
</div>