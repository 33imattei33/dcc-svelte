<svelte:head>
  <title>DecentralChain — Blockchain Explorer & Wallet</title>
  <meta name="description" content="DecentralChain blockchain explorer, wallet, and dApp platform. Powered by LPoS consensus." />
</svelte:head>

<!-- Navigation -->
<nav class="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
  <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
    <div class="flex items-center gap-4">
      <a href="/" class="flex items-center gap-2 no-underline text-black dark:text-white font-bold text-lg">
        <img
          alt="DCC"
          src="https://raw.githubusercontent.com/jourlez/ride/master/examples/03/public/favicon.ico"
          class="w-6"
        />
        DCC
      </a>
      <div class="hidden md:flex items-center gap-1 ml-4">
        <a
          href="#blockchain"
          class="px-3 py-1.5 rounded-lg text-sm no-underline text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {$LL.nav.explorer()}
        </a>
        <a
          href="#wallet"
          class="px-3 py-1.5 rounded-lg text-sm no-underline text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {$LL.nav.wallet()}
        </a>
        <a
          href="#transfer"
          class="px-3 py-1.5 rounded-lg text-sm no-underline text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {$LL.nav.transfer()}
        </a>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <LanguageSwitcher />
      <DarkToggle />
      <a href="https://github.com/jourlez/dcc-svelte" target="_blank" class="text-sky-500 i-carbon-logo-github text-xl" />
      <Login />
    </div>
  </div>
</nav>

<!-- Main Content -->
<main class="max-w-6xl mx-auto px-4 pb-24">
  <slot />
</main>

<Footer />

<script lang="ts">
  import 'uno.css';
  import LanguageSwitcher from '../lib/components/LanguageSwitcher.svelte';
  import DarkToggle from '../lib/components/DarkToggle.svelte';
  import Login from '../lib/components/Login.svelte';
  import Footer from '../lib/components/Footer.svelte';
  import LL from '../i18n/i18n-svelte';
</script>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    transition: background-color 0.3s, color 0.3s;
  }
  :global(body.dark) {
    background: #111827;
    color: #f3f4f6;
  }
  :global(*) {
    box-sizing: border-box;
  }
</style>