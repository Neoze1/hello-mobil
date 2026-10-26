<script lang="ts">let {mesaj,tekrarMetni='Tekrar dene',onclick}:{mesaj:string;tekrarMetni?:string;onclick?:()=>void}=$props();</script>
<section role="alert" class="hata"><p>{mesaj}</p>{#if onclick}<button {onclick}>{tekrarMetni}</button>{/if}</section>
<style>.hata{padding:var(--bosluk);border:1px solid var(--renk-hata);border-radius:var(--radius)}button{background:var(--renk-ana);color:var(--renk-ana-ustu);padding:var(--bosluk);border:0;border-radius:var(--radius)}</style>
