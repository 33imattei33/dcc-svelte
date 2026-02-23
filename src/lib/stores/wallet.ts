import { writable } from 'svelte/store';

export const walletStore = writable({
  connected: false,
  address: '',
  publicKey: '',
  dccBalance: 0,
  balances: [] as any[],
  signer: null as any,
});
