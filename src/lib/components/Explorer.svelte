<script lang="ts">
  import LL from '../../i18n/i18n-svelte';

  const NODE_URL = 'https://mainnet-node.decentralchain.io';

  let searchQuery = '';
  let searchResult: any = null;
  let searching = false;
  let searchError = '';

  let recentBlocks: any[] = [];
  let loadingBlocks = true;

  async function fetchRecentBlocks() {
    try {
      const heightRes = await fetch(`${NODE_URL}/blocks/height`);
      const { height } = await heightRes.json();
      const from = Math.max(1, height - 4);
      const res = await fetch(`${NODE_URL}/blocks/headers/seq/${from}/${height}`);
      const blocks = await res.json();
      recentBlocks = blocks.reverse();
      loadingBlocks = false;
    } catch (e) {
      loadingBlocks = false;
    }
  }

  fetchRecentBlocks();

  function truncateAddr(addr: string): string {
    if (!addr) return '';
    return addr.slice(0, 8) + '...' + addr.slice(-6);
  }

  async function searchBlockchain() {
    if (!searchQuery.trim()) return;

    searching = true;
    searchResult = null;
    searchError = '';

    const query = searchQuery.trim();

    try {
      // Try as address first (starts with 3)
      if (query.startsWith('3') && query.length > 30) {
        const res = await fetch(`${NODE_URL}/addresses/balance/details/${query}`);
        if (res.ok) {
          const data = await res.json();
          searchResult = { type: 'address', data: { ...data, address: query } };
          searching = false;
          return;
        }
      }

      // Try as transaction ID
      const txRes = await fetch(`${NODE_URL}/transactions/info/${query}`);
      if (txRes.ok) {
        const data = await txRes.json();
        searchResult = { type: 'transaction', data };
        searching = false;
        return;
      }

      // Try as block height (number)
      if (/^\d+$/.test(query)) {
        const blockRes = await fetch(`${NODE_URL}/blocks/at/${query}`);
        if (blockRes.ok) {
          const data = await blockRes.json();
          searchResult = { type: 'block', data };
          searching = false;
          return;
        }
      }

      searchError = $LL.explorer.notFound();
    } catch (e) {
      searchError = $LL.explorer.searchError();
    } finally {
      searching = false;
    }
  }
</script>

<section class="w-full max-w-4xl mx-auto mt-8 px-4">
  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
    <span class="i-carbon-search text-sky-500"></span>
    {$LL.explorer.title()}
  </h2>

  <!-- Search Bar -->
  <div class="flex gap-2 mb-6">
    <input
      bind:value={searchQuery}
      on:keydown={(e) => e.key === 'Enter' && searchBlockchain()}
      placeholder={$LL.explorer.searchPlaceholder()}
      class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-700 text-sm
        focus:outline-none focus:ring-2 focus:ring-sky-500"
    />
    <button
      on:click={searchBlockchain}
      disabled={searching}
      class="px-4 py-2 rounded-lg border-none cursor-pointer
        bg-sky-500 hover:bg-sky-600 text-white text-sm
        disabled:opacity-50"
    >
      {#if searching}
        <span class="i-carbon-rotate inline-block animate-spin"></span>
      {:else}
        <span class="i-carbon-search"></span>
      {/if}
    </button>
  </div>

  <!-- Search Results -->
  {#if searchError}
    <div class="rounded-xl p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm mb-6">
      {searchError}
    </div>
  {/if}

  {#if searchResult}
    <div class="rounded-xl p-5 bg-gray-100 dark:bg-gray-800 mb-6">
      {#if searchResult.type === 'address'}
        <div class="text-xs uppercase text-gray-500 mb-2">{$LL.explorer.addressInfo()}</div>
        <div class="font-mono text-sm break-all">{searchResult.data.address}</div>
        <div class="grid grid-cols-2 gap-4 mt-3">
          <div>
            <div class="text-xs text-gray-500">{$LL.explorer.regular()}</div>
            <div class="font-bold">{(searchResult.data.regular / 1e8).toFixed(4)} DCC</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">{$LL.explorer.available()}</div>
            <div class="font-bold">{(searchResult.data.available / 1e8).toFixed(4)} DCC</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">{$LL.explorer.effective()}</div>
            <div class="font-bold">{(searchResult.data.effective / 1e8).toFixed(4)} DCC</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">{$LL.explorer.generating()}</div>
            <div class="font-bold">{(searchResult.data.generating / 1e8).toFixed(4)} DCC</div>
          </div>
        </div>
        <a
          href="https://decentralscan.com/address/{searchResult.data.address}"
          target="_blank"
          class="inline-block mt-3 text-xs text-sky-500 hover:underline no-underline"
        >
          {$LL.wallet.viewOnExplorer()} →
        </a>

      {:else if searchResult.type === 'transaction'}
        <div class="text-xs uppercase text-gray-500 mb-2">{$LL.explorer.transactionInfo()}</div>
        <div class="font-mono text-xs break-all text-sky-500">{searchResult.data.id}</div>
        <div class="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div class="text-gray-500">Type</div>
          <div>{searchResult.data.type}</div>
          <div class="text-gray-500">Height</div>
          <div>{searchResult.data.height}</div>
          <div class="text-gray-500">Sender</div>
          <div class="font-mono text-xs">{truncateAddr(searchResult.data.sender)}</div>
          {#if searchResult.data.amount != null}
            <div class="text-gray-500">Amount</div>
            <div>{(searchResult.data.amount / 1e8).toFixed(4)}</div>
          {/if}
        </div>
        <a
          href="https://decentralscan.com/tx/{searchResult.data.id}"
          target="_blank"
          class="inline-block mt-3 text-xs text-sky-500 hover:underline no-underline"
        >
          {$LL.wallet.viewOnExplorer()} →
        </a>

      {:else if searchResult.type === 'block'}
        <div class="text-xs uppercase text-gray-500 mb-2">{$LL.explorer.blockInfo()}</div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="text-gray-500">Height</div>
          <div class="font-bold">{searchResult.data.height}</div>
          <div class="text-gray-500">Transactions</div>
          <div>{searchResult.data.transactionCount || searchResult.data.transactions?.length || 0}</div>
          <div class="text-gray-500">Generator</div>
          <div class="font-mono text-xs">{truncateAddr(searchResult.data.generator)}</div>
          <div class="text-gray-500">Time</div>
          <div class="text-xs">{new Date(searchResult.data.timestamp).toLocaleString()}</div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Recent Blocks -->
  <h3 class="text-lg font-semibold mb-3">{$LL.explorer.recentBlocks()}</h3>
  {#if loadingBlocks}
    <div class="flex justify-center py-8">
      <span class="i-carbon-rotate text-2xl text-sky-500 animate-spin"></span>
    </div>
  {:else}
    <div class="space-y-2">
      {#each recentBlocks as block}
        <div class="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="i-carbon-cube text-sky-500 text-lg"></span>
            <div>
              <div class="font-bold text-sm">#{block.height.toLocaleString()}</div>
              <div class="text-xs text-gray-400">
                {new Date(block.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm">{block.transactionCount} txs</div>
            <div class="text-xs text-gray-400 font-mono">
              {truncateAddr(block.generator)}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
