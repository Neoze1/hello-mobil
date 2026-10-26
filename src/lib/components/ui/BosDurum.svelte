<script lang="ts">let {baslik,aciklama,dugmeMetni,onclick}:{baslik:string;aciklama:string;dugmeMetni?:string;onclick?:()=>void}=$props();</script>
<section class="durum"><h2>{baslik}</h2><p>{aciklama}</p>{#if dugmeMetni && onclick}<button {onclick}>{dugmeMetni}</button>{/if}</section>
<style>.durum{padding:var(--bosluk);border:1px solid var(--kenar);border-radius:var(--radius);background:var(--kart)}p{color:var(--yazi-soluk)}button{background:var(--renk-ana);color:var(--renk-ana-ustu);border:0;border-radius:var(--radius);padding:var(--bosluk)}</style>
