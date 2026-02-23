<footer
    class="fixed bottom-0 left-0 w-full py-3 flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-t border-gray-200 dark:border-gray-800 z-40"
>
		{$LL.footer.poweredby()}
    <a
    class="
        flex
        items-center
        gap-2
        no-underline
        font-semibold
        text-black
        dark:text-white
    "
    href="https://decentralchain.io/"
    target="_blank"
    >
    <img
        alt="DCC"
        src="https://raw.githubusercontent.com/jourlez/ride/master/examples/03/public/favicon.ico"
        class="w-5"
    />
		{$LL.footer.decentralchain()}
    </a>
    <span class="text-gray-400 mx-2">|</span>
    <a href="https://decentralscan.com" target="_blank" class="text-xs text-gray-400 hover:text-sky-500 no-underline">DecentralScan</a>
    <span class="text-gray-400 mx-1">&middot;</span>
    <a href="https://decentral.exchange" target="_blank" class="text-xs text-gray-400 hover:text-sky-500 no-underline">Exchange</a>
    <span class="text-gray-400 mx-1">&middot;</span>
    <a href="https://docs.decentralchain.io" target="_blank" class="text-xs text-gray-400 hover:text-sky-500 no-underline">Docs</a>
</footer>
  
<script>
	import LL from '../../i18n/i18n-svelte'
</script>