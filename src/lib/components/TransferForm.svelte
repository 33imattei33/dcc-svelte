<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import LL from '../../i18n/i18n-svelte';

  export let signer: any = null;
  export let isAuthenticated = false;
  export let senderAddress = '';

  const dispatch = createEventDispatcher();

  let recipient = '';
  let amount = '';
  let attachment = '';
  let sending = false;
  let txResult: any = null;
  let txError = '';

  async function sendTransfer() {
    if (!signer || !recipient || !amount) return;

    sending = true;
    txResult = null;
    txError = '';

    try {
      const amountInDecentralites = Math.round(parseFloat(amount) * 1e8);
      const [tx] = await signer
        .transfer({
          recipient,
          amount: amountInDecentralites,
          attachment,
        })
        .broadcast();

      txResult = tx;
      dispatch('transfer', tx);
      recipient = '';
      amount = '';
      attachment = '';
    } catch (e: any) {
      txError = e?.message || 'Transfer failed';
    } finally {
      sending = false;
    }
  }
</script>

<section class="w-full max-w-4xl mx-auto mt-8 px-4">
  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
    <span class="i-carbon-send-alt text-sky-500"></span>
    {$LL.transfer.title()}
  </h2>

  {#if !isAuthenticated}
    <div class="rounded-xl p-8 bg-gray-100 dark:bg-gray-800 text-center">
      <span class="i-carbon-locked text-4xl text-gray-400 mb-2"></span>
      <p class="text-gray-400">{$LL.transfer.loginRequired()}</p>
    </div>
  {:else}
    <div class="rounded-xl p-5 bg-gray-100 dark:bg-gray-800">
      <div class="space-y-4">
        <div>
          <label for="recipient" class="block text-xs text-gray-500 uppercase tracking-wide mb-1">
            {$LL.transfer.recipient()}
          </label>
          <input
            id="recipient"
            bind:value={recipient}
            placeholder="3P..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 text-sm font-mono
              focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label for="amount" class="block text-xs text-gray-500 uppercase tracking-wide mb-1">
            {$LL.transfer.amount()} (DCC)
          </label>
          <input
            id="amount"
            bind:value={amount}
            type="number"
            step="0.0001"
            min="0"
            placeholder="0.0000"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 text-sm
              focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label for="attachment" class="block text-xs text-gray-500 uppercase tracking-wide mb-1">
            {$LL.transfer.attachment()}
          </label>
          <input
            id="attachment"
            bind:value={attachment}
            placeholder={$LL.transfer.attachmentPlaceholder()}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 text-sm
              focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div class="text-xs text-gray-400">
          {$LL.transfer.fee()}: 0.001 DCC
        </div>

        <button
          on:click={sendTransfer}
          disabled={sending || !recipient || !amount}
          class="w-full px-6 py-3 rounded-lg border-none cursor-pointer
            bg-sky-500 hover:bg-sky-600 text-white font-medium
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if sending}
            <span class="i-carbon-rotate inline-block animate-spin mr-1"></span>
            {$LL.transfer.sending()}
          {:else}
            {$LL.transfer.send()}
          {/if}
        </button>
      </div>

      {#if txResult}
        <div class="mt-4 rounded-lg p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
          <div class="text-sm font-medium text-green-700 dark:text-green-300">
            {$LL.transfer.success()}
          </div>
          <a
            href="https://decentralscan.com/tx/{txResult.id}"
            target="_blank"
            class="text-xs text-sky-500 hover:underline no-underline font-mono"
          >
            {txResult.id}
          </a>
        </div>
      {/if}

      {#if txError}
        <div class="mt-4 rounded-lg p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <div class="text-sm text-red-700 dark:text-red-300">{txError}</div>
        </div>
      {/if}
    </div>
  {/if}
</section>
