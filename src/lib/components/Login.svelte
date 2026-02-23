<script lang="ts">
  import { browser } from '$app/env';
  import { Signer } from '@decentralchain/signer';
  import { ProviderWeb } from '@waves.exchange/provider-web';
  import { walletStore } from '../stores/wallet';
  import LL from '../../i18n/i18n-svelte';

  let signer: Signer;
  let provider: ProviderWeb;

  const NODE_URL = 'https://mainnet-node.decentralchain.io';

  if (browser) {
    signer = new Signer({ NODE_URL });
    provider = new ProviderWeb('https://decentral.exchange/signer/');
    signer.setProvider(provider);
  }

  let loginButtonText = '';
  let isAuthenticated = false;
  let userAddress = '';
  let dccBalance = 0;
  let loading = false;

  $: loginButtonText = isAuthenticated
    ? $LL.login.logged({ address: truncateAddr(userAddress) })
    : $LL.login.login();

  function truncateAddr(addr: string): string {
    if (!addr) return '';
    return addr.slice(0, 8) + '...' + addr.slice(-6);
  }

  async function fetchBalances() {
    if (!userAddress) return;
    try {
      const res = await fetch(`${NODE_URL}/addresses/balance/details/${userAddress}`);
      const data = await res.json();
      dccBalance = data.available / 1e8;

      const assetsRes = await fetch(`${NODE_URL}/assets/balance/${userAddress}`);
      const assetsData = await assetsRes.json();
      const balances = assetsData.balances || [];

      walletStore.set({
        connected: true,
        address: userAddress,
        publicKey: '',
        dccBalance,
        balances,
        signer,
      });
    } catch (e) {
      console.error('Failed to fetch balances:', e);
    }
  }

  async function callSigner() {
    if (isAuthenticated) {
      try {
        await signer.logout();
      } catch (_) {}
      isAuthenticated = false;
      userAddress = '';
      dccBalance = 0;
      walletStore.set({
        connected: false,
        address: '',
        publicKey: '',
        dccBalance: 0,
        balances: [],
        signer: null,
      });
      return;
    }

    loading = true;
    loginButtonText = $LL.login.logging();

    try {
      const userData = await signer.login();
      userAddress = userData.address;
      isAuthenticated = true;
      await fetchBalances();
    } catch (error) {
      console.error('Login failed:', error);
      isAuthenticated = false;
    } finally {
      loading = false;
    }
  }
</script>

{#if isAuthenticated}
  <div class="flex items-center gap-3">
    <div class="flex flex-col items-end text-sm">
      <span class="text-xs text-gray-400">{$LL.login.balance()}</span>
      <span class="font-bold text-green-500">{dccBalance.toFixed(4)} DCC</span>
    </div>
    <button
      on:click={callSigner}
      class="
        px-4 py-2 rounded-lg border-none cursor-pointer
        bg-red-500 hover:bg-red-600
        text-sm text-white font-medium
        transition-all duration-200
      "
    >
      {$LL.login.logout()}
    </button>
  </div>
{:else}
  <button
    on:click={callSigner}
    disabled={loading}
    class="
      px-6 py-2 rounded-lg border-none cursor-pointer
      bg-sky-500 hover:bg-sky-600
      text-sm text-white font-medium
      transition-all duration-200
      disabled:opacity-50
    "
  >
    {#if loading}
      <span class="i-carbon-rotate inline-block animate-spin mr-1"></span>
    {/if}
    {loginButtonText}
  </button>
{/if}
