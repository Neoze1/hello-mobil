<script lang="ts">
 import type { KartGirdisi } from '../../types/ui';
 let {baslik,altMetin,gorsel,etiket,etiketTuru='bilgi',href}:KartGirdisi = $props();
</script>
{#snippet icerik()}
 {#if gorsel}<img class="kart-gorsel" src={gorsel} alt={baslik} loading="lazy" />{:else}<div class="kart-gorsel yedek" aria-hidden="true">OTOİZ</div>{/if}
 <div class="kart-icerik">{#if etiket}<span class="etiket" data-tur={etiketTuru}>{etiket}</span>{/if}<h3>{baslik}</h3>{#if altMetin}<p>{altMetin}</p>{/if}</div>
{/snippet}
{#if href}<a class="otoiz-kart" {href}>{@render icerik()}</a>{:else}<article class="otoiz-kart">{@render icerik()}</article>{/if}
<style>
 .otoiz-kart{display:block;overflow:hidden;background:var(--kart);border:1px solid var(--kenar);border-radius:var(--radius);color:var(--yazi);text-decoration:none}
 a.otoiz-kart:focus-visible{outline:3px solid var(--renk-ana);outline-offset:3px}
 .kart-gorsel{display:flex;width:100%;height:130px;object-fit:cover;align-items:center;justify-content:center;background:var(--zemin);color:var(--yazi-soluk)}
 .kart-icerik{padding:var(--bosluk, 16px);overflow-wrap:anywhere}
 h3{margin:0 0 8px}p{margin:0;color:var(--yazi-soluk)}
 .etiket{display:inline-block;margin-bottom:8px;padding:4px 8px;border-radius:var(--radius);background:var(--zemin);color:var(--renk-ana)}
 .etiket[data-tur='hata']{color:var(--renk-hata)}.etiket[data-tur='uyari']{color:var(--renk-uyari)}.etiket[data-tur='basari']{color:var(--renk-basari)}
</style>
