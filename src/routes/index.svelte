<!-- Hero Section -->
<section class="text-center py-16">
  <h1 class="text-5xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
    {$LL.messages.title()}
  </h1>
  <p class="mt-2 text-xl text-gray-500 dark:text-gray-400">
    {$LL.messages.subtitle()}
  </p>
  <p class="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
    {$LL.messages.description()}
  </p>

  <!-- Quick Links -->
  <div class="flex flex-wrap justify-center gap-3 mt-8">
    <a
      href="https://decentralchain.io"
      target="_blank"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-white no-underline text-sm font-medium hover:bg-sky-600 transition-colors"
    >
      <span class="i-carbon-globe"></span>
      Website
    </a>
    <a
      href="https://decentral.exchange"
      target="_blank"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 no-underline text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <span class="i-carbon-currency"></span>
      Exchange
    </a>
    <a
      href="https://decentralscan.com"
      target="_blank"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 no-underline text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <span class="i-carbon-search"></span>
      Explorer
    </a>
    <a
      href="https://docs.decentralchain.io"
      target="_blank"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 no-underline text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <span class="i-carbon-document"></span>
      Docs
    </a>
  </div>
</section>

<!-- Features -->
<section class="py-8">
  <h2 class="text-xl font-bold text-center mb-6">{$LL.messages.features()}</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="rounded-xl p-5 bg-gray-50 dark:bg-gray-800/50 text-center">
      <span class="i-carbon-lightning text-3xl text-sky-500 mb-2 block"></span>
      <p class="text-sm text-gray-600 dark:text-gray-300">{$LL.messages.featureLpos()}</p>
    </div>
    <div class="rounded-xl p-5 bg-gray-50 dark:bg-gray-800/50 text-center">
      <span class="i-carbon-code text-3xl text-green-500 mb-2 block"></span>
      <p class="text-sm text-gray-600 dark:text-gray-300">{$LL.messages.featureRide()}</p>
    </div>
    <div class="rounded-xl p-5 bg-gray-50 dark:bg-gray-800/50 text-center">
      <span class="i-carbon-arrows-horizontal text-3xl text-purple-500 mb-2 block"></span>
      <p class="text-sm text-gray-600 dark:text-gray-300">{$LL.messages.featureDex()}</p>
    </div>
    <div class="rounded-xl p-5 bg-gray-50 dark:bg-gray-800/50 text-center">
      <span class="i-carbon-tree text-3xl text-emerald-500 mb-2 block"></span>
      <p class="text-sm text-gray-600 dark:text-gray-300">{$LL.messages.featureCarbon()}</p>
    </div>
  </div>
</section>

<!-- Blockchain Info -->
<div id="blockchain">
  <BlockchainInfo />
</div>

<!-- Explorer -->
<div id="explorer">
  <Explorer />
</div>

<!-- Wallet Dashboard (shown when logged in) -->
{#if walletConnected}
  <div id="wallet">
    <WalletDashboard
      address={walletAddress}
      dccBalance={walletDccBalance}
      balances={walletBalances}
    />
  </div>
{/if}

<!-- Transfer Form -->
<div id="transfer">
  <TransferForm
    {signer}
    isAuthenticated={walletConnected}
    senderAddress={walletAddress}
  />
</div>

<script lang="ts">
  import LL from '../i18n/i18n-svelte';
  import BlockchainInfo from '../lib/components/BlockchainInfo.svelte';
  import Explorer from '../lib/components/Explorer.svelte';
  import WalletDashboard from '../lib/components/WalletDashboard.svelte';
  import TransferForm from '../lib/components/TransferForm.svelte';
  import { walletStore } from '../lib/stores/wallet';

  $: walletAddress = $walletStore.address;
  $: walletDccBalance = $walletStore.dccBalance;
  $: walletBalances = $walletStore.balances;
  $: walletConnected = $walletStore.connected;
  $: signer = $walletStore.signer;
</script>