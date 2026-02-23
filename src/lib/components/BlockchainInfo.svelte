<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import LL from '../../i18n/i18n-svelte';

  const NODE_URL = 'https://mainnet-node.decentralchain.io';

  let blockHeight = 0;
  let lastBlockTime = '';
  let lastBlockTxCount = 0;
  let lastBlockGenerator = '';
  let lastBlockSize = 0;
  let totalDCC = 0;
  let currentReward = 0;
  let loading = true;
  let error = '';
  let interval: ReturnType<typeof setInterval>;

  function truncateAddr(addr: string): string {
    if (!addr) return '';
    return addr.slice(0, 8) + '...' + addr.slice(-6);
  }

  function formatTimestamp(ts: number): string {
    return new Date(ts).toLocaleString();
  }

  async function fetchBlockchainData() {
    try {
      const [heightRes, lastBlockRes, rewardRes] = await Promise.all([
        fetch(`${NODE_URL}/blocks/height`),
        fetch(`${NODE_URL}/blocks/last`),
        fetch(`${NODE_URL}/blockchain/rewards`),
      ]);

      const heightData = await heightRes.json();
      const lastBlock = await lastBlockRes.json();
      const rewardData = await rewardRes.json();

      blockHeight = heightData.height;
      lastBlockTime = formatTimestamp(lastBlock.timestamp);
      lastBlockTxCount = lastBlock.transactionCount || 0;
      lastBlockGenerator = lastBlock.generator || '';
      lastBlockSize = lastBlock.blocksize || 0;
      totalDCC = (rewardData.totalDecentralCoinsAmount || 0) / 1e8;
      currentReward = (rewardData.currentReward || 0) / 1e8;

      loading = false;
      error = '';
    } catch (e) {
      error = 'Failed to fetch blockchain data';
      loading = false;
    }
  }

  onMount(() => {
    fetchBlockchainData();
    interval = setInterval(fetchBlockchainData, 15000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<section class="w-full max-w-4xl mx-auto mt-8 px-4">
  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
    <span class="i-carbon-cube text-sky-500"></span>
    {$LL.blockchain.title()}
  </h2>

  {#if loading}
    <div class="flex justify-center py-8">
      <span class="i-carbon-rotate text-2xl text-sky-500 animate-spin"></span>
    </div>
  {:else if error}
    <p class="text-red-500 text-center py-4">{error}</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 transition-colors">
        <div class="text-xs text-gray-500 uppercase tracking-wide">{$LL.blockchain.height()}</div>
        <div class="text-2xl font-bold text-sky-500 mt-1">{blockHeight.toLocaleString()}</div>
      </div>

      <div class="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 transition-colors">
        <div class="text-xs text-gray-500 uppercase tracking-wide">{$LL.blockchain.lastBlock()}</div>
        <div class="text-sm font-medium mt-1">{lastBlockTime}</div>
        <div class="text-xs text-gray-400 mt-1">
          {lastBlockTxCount} txs &middot; {(lastBlockSize / 1024).toFixed(1)} KB
        </div>
      </div>

      <div class="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 transition-colors">
        <div class="text-xs text-gray-500 uppercase tracking-wide">{$LL.blockchain.generator()}</div>
        <div class="text-sm font-mono mt-1">
          <a
            href="https://decentralscan.com/address/{lastBlockGenerator}"
            target="_blank"
            class="text-sky-500 hover:underline no-underline"
          >
            {truncateAddr(lastBlockGenerator)}
          </a>
        </div>
      </div>

      <div class="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 transition-colors">
        <div class="text-xs text-gray-500 uppercase tracking-wide">{$LL.blockchain.blockReward()}</div>
        <div class="text-2xl font-bold text-green-500 mt-1">{currentReward} DCC</div>
      </div>

      <div class="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 transition-colors">
        <div class="text-xs text-gray-500 uppercase tracking-wide">{$LL.blockchain.totalSupply()}</div>
        <div class="text-lg font-bold mt-1">{totalDCC.toLocaleString()} DCC</div>
      </div>

      <div class="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 transition-colors">
        <div class="text-xs text-gray-500 uppercase tracking-wide">{$LL.blockchain.consensus()}</div>
        <div class="text-sm font-medium mt-1">LPoS</div>
        <div class="text-xs text-gray-400 mt-1">{$LL.blockchain.lpos()}</div>
      </div>
    </div>
  {/if}
</section>
