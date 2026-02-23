<p align="center">
<img src="https://raw.githubusercontent.com/jourlez/dcc-svelte/main/static/preview.png" width="600"/>
</p>

<h1 align="center">
DecentralChain + Svelte
</h1><br>

<p align="center">
A comprehensive <a href="https://kit.svelte.dev/" target="_blank">SvelteKit</a> application for the <a href="https://decentralchain.io/" target="_blank">DecentralChain</a> blockchain ecosystem. Features a real-time blockchain explorer, wallet integration via <a href="https://decentral.exchange/" target="_blank">Decentral.Exchange</a>, token management, and DCC transfers — all built on DecentralChain's LPoS (Leased Proof of Stake) consensus protocol.
</p>

<br>
<h2 align="center">
<a href="https://dcc-svelte.netlify.app/" target="_blank">🖥 Online Preview</a>
<br>
</h2>

## Features

- 🔗 **DecentralChain Integration** — Connect to DecentralChain mainnet (`mainnet-node.decentralchain.io`)
- 📊 **Blockchain Explorer** — Real-time block height, block rewards, total supply, recent blocks
- 🔍 **Search** — Search by address, transaction ID, or block height
- 👛 **Wallet Dashboard** — View DCC balance, token holdings, and recent transactions
- 💸 **DCC Transfers** — Send DecentralCoin with the built-in transfer form
- 💚 **[SvelteKit](https://kit.svelte.dev/)** — SSR, file-based routing, API endpoints
- ⚡️ **[Vite](https://vitejs.dev/)** + **[svelte-hmr](https://github.com/sveltejs/svelte-hmr)** — Instant HMR
- 🎨 **[UnoCSS](https://github.com/antfu/unocss)** — Atomic CSS engine with icon support
- 🌙 **Dark mode** — via [svelte-dark-mode](https://github.com/metonym/svelte-dark-mode)
- 🚩 **Localization (i18n)** — English & Spanish via [typesafe-i18n](https://typesafe-i18n.pages.dev)
- 🦾 **TypeScript**

## DecentralChain Ecosystem

| Service | URL |
|---------|-----|
| Website | [decentralchain.io](https://decentralchain.io) |
| Documentation | [docs.decentralchain.io](https://docs.decentralchain.io) |
| Exchange | [decentral.exchange](https://decentral.exchange) |
| Block Explorer | [decentralscan.com](https://decentralscan.com) |
| Mainnet Node | `https://mainnet-node.decentralchain.io` |
| Testnet Node | `https://testnet-node.decentralchain.io` |

## API Endpoints Used

- `GET /blocks/height` — Current blockchain height
- `GET /blocks/last` — Latest block data
- `GET /blockchain/rewards` — Block reward & total supply info
- `GET /blocks/headers/seq/{from}/{to}` — Block headers sequence
- `GET /addresses/balance/details/{address}` — DCC balance details
- `GET /assets/balance/{address}` — All token balances
- `GET /transactions/address/{address}/limit/{limit}` — Recent transactions
- `GET /transactions/info/{id}` — Transaction by ID

## Variations

- <a href="https://github.com/jourlez/dcc-nuxt3" target="_blank">Nuxt 3</a> — Nuxt 3 version
- <a href="https://github.com/jourlez/dcc-solidjs" target="_blank">SolidJS</a> — SolidJS version

## Try it now!

### Online

<a href="https://stackblitz.com/github/jourlez/dcc-svelte" target="_blank"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt=""></a>

### GitHub Template

[Create a repo from this template on GitHub](https://github.com/jourlez/dcc-svelte/generate).

### Clone to local

```bash
git clone https://github.com/jourlez/dcc-svelte
cd dcc-svelte
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.
