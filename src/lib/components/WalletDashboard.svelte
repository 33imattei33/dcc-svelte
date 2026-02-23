<script lang="ts">
  import LL from '../../i18n/i18n-svelte';

  export let address = '';
  export let dccBalance = 0;
  export let balances: any[] = [];

  const NODE_URL = 'https://mainnet-node.decentralchain.io';

  let recentTxs: any[] = [];
  let loadingTxs = false;
  let activeTab: 'overview' | 'assets' | 'transactions' = 'overview';

  function truncateAddr(addr: string): string {
    if (!addr) return '';
    return addr.slice(0, 10) + '...' + addr.slice(-8);
  }

  function truncateId(id: string): string {
    if (!id) return '';
    return id.slice(0, 12) + '...';
  }

  function formatAmount(amount: number, decimals = 8): string {
    return (amount / Math.pow(10, decimals)).toFixed(Math.min(decimals, 4));
  }

  function getTxTypeLabel(type: number): string {
    const types: Record<number, string> = {
      1: 'Genesis',
      3: 'Issue',
      4: 'Transfer',
      5: 'Reissue',
      6: 'Burn',
      7: 'Exchange',
      8: 'Lease',
      9: 'Lease Cancel',
      10: 'Alias',
      11: 'Mass Transfer',
      12: 'Data',
      13: 'Set Script',
      14: 'Sponsor Fee',
      15: 'Set Asset Script',
      16: 'Invoke Script',
      17: 'Update Asset Info',
    };
    return types[type] || `Type ${type}`;
  }

  async function fetchTransactions() {
    if (!address) return;
    loadingTxs = true;
    try {
      const res = await fetch(`${NODE_URL}/transactions/address/${address}/limit/10`);
      const data = await res.json();
      recentTxs = data[0] || [];
    } catch (e) {
      console.error('Failed to fetch transactions:', e);
    } finally {
      loadingTxs = false;
    }
  }

  $: if (address) fetchTransactions();

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
</script>

<section class="w-full max-w-4xl mx-auto mt-8 px-4">
  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
    <span class="i-carbon-wallet text-sky-500"></span>
    {$LL.wallet.title()}
  </h2>

  <!-- Address Card -->
  <div class="rounded-xl p-5 bg-gradient-to-r from-sky-500 to-blue-600 text-white mb-4">
    <div class="text-xs uppercase tracking-wide opacity-80">{$LL.wallet.yourAddress()}</div>
    <div class="flex items-center gap-2 mt-1">
      <span class="font-mono text-sm md:text-base break-all">{address}</span>
      <button
        on:click={() => copyToClipboard(address)}
        class="i-carbon-copy text-lg opacity-70 hover:opacity-100 bg-transparent border-none text-white cursor-pointer flex-shrink-0"
        title="Copy"
      ></button>
    </div>
    <div class="mt-3 flex items-baseline gap-2">
      <span class="text-3xl font-bold">{dccBalance.toFixed(4)}</span>
      <span class="text-lg opacity-80">DCC</span>
    </div>
    <a
      href="https://decentralscan.com/address/{address}"
      target="_blank"
      class="inline-block mt-2 text-xs text-white opacity-70 hover:opacity-100 no-underline"
    >
      {$LL.wallet.viewOnExplorer()} →
    </a>
  </div>

  <!-- Tabs -->
  <div class="flex gap-1 mb-4 border-b border-gray-200 dark:border-gray-700">
    <button
      on:click={() => (activeTab = 'overview')}
      class="px-4 py-2 text-sm font-medium border-none cursor-pointer transition-colors
        {activeTab === 'overview'
        ? 'text-sky-500 bg-sky-50 dark:bg-sky-900/30 rounded-t-lg'
        : 'text-gray-500 bg-transparent hover:text-gray-700 dark:hover:text-gray-300'}"
    >
      {$LL.wallet.overview()}
    </button>
    <button
      on:click={() => (activeTab = 'assets')}
      class="px-4 py-2 text-sm font-medium border-none cursor-pointer transition-colors
        {activeTab === 'assets'
        ? 'text-sky-500 bg-sky-50 dark:bg-sky-900/30 rounded-t-lg'
        : 'text-gray-500 bg-transparent hover:text-gray-700 dark:hover:text-gray-300'}"
    >
      {$LL.wallet.assets()} ({balances.length})
    </button>
    <button
      on:click={() => (activeTab = 'transactions')}
      class="px-4 py-2 text-sm font-medium border-none cursor-pointer transition-colors
        {activeTab === 'transactions'
        ? 'text-sky-500 bg-sky-50 dark:bg-sky-900/30 rounded-t-lg'
        : 'text-gray-500 bg-transparent hover:text-gray-700 dark:hover:text-gray-300'}"
    >
      {$LL.wallet.transactions()}
    </button>
  </div>

  <!-- Overview Tab -->
  {#if activeTab === 'overview'}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="rounded-xl p-4 bg-gray-100 dark:bg-gray-800">
        <div class="text-xs text-gray-500 uppercase">{$LL.wallet.dccBalance()}</div>
        <div class="text-xl font-bold text-green-500 mt-1">{dccBalance.toFixed(8)} DCC</div>
      </div>
      <div class="rounded-xl p-4 bg-gray-100 dark:bg-gray-800">
        <div class="text-xs text-gray-500 uppercase">{$LL.wallet.tokenCount()}</div>
        <div class="text-xl font-bold mt-1">{balances.length}</div>
      </div>
    </div>

  <!-- Assets Tab -->
  {:else if activeTab === 'assets'}
    {#if balances.length === 0}
      <p class="text-gray-400 text-center py-8">{$LL.wallet.noAssets()}</p>
    {:else}
      <div class="space-y-2">
        {#each balances as asset}
          <div class="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
            <div>
              <div class="font-medium text-sm">{asset.issueTransaction?.name || 'Unknown'}</div>
              <div class="text-xs text-gray-400 font-mono">{truncateId(asset.assetId)}</div>
            </div>
            <div class="text-right">
              <div class="font-bold text-sm">
                {formatAmount(asset.balance, asset.issueTransaction?.decimals || 0)}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}

  <!-- Transactions Tab -->
  {:else if activeTab === 'transactions'}
    {#if loadingTxs}
      <div class="flex justify-center py-8">
        <span class="i-carbon-rotate text-2xl text-sky-500 animate-spin"></span>
      </div>
    {:else if recentTxs.length === 0}
      <p class="text-gray-400 text-center py-8">{$LL.wallet.noTransactions()}</p>
    {:else}
      <div class="space-y-2">
        {#each recentTxs as tx}
          <div class="rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
            <div class="flex justify-between items-start">
              <div>
                <span class="inline-block px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                  {getTxTypeLabel(tx.type)}
                </span>
                <a
                  href="https://decentralscan.com/tx/{tx.id}"
                  target="_blank"
                  class="block text-xs font-mono text-sky-500 hover:underline no-underline mt-1"
                >
                  {truncateId(tx.id)}
                </a>
              </div>
              <div class="text-right">
                {#if tx.amount != null}
                  <div class="text-sm font-bold {tx.sender === address ? 'text-red-500' : 'text-green-500'}">
                    {tx.sender === address ? '-' : '+'}{formatAmount(tx.amount)}
                  </div>
                {/if}
                <div class="text-xs text-gray-400">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
            {#if tx.fee}
              <div class="text-xs text-gray-400 mt-1">
                Fee: {formatAmount(tx.fee)} DCC
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</section>
