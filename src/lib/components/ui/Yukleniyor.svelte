<script lang="ts">let {metin='Yükleniyor…'}:{metin?:string}=$props();</script>
<div role="status" aria-live="polite" class="yukleniyor"><span>{metin}</span><div class="iskelet"></div><div class="iskelet"></div></div>
<style>.yukleniyor{padding:var(--bosluk);color:var(--yazi-soluk)}.iskelet{height:48px;margin-top:var(--bosluk);background:var(--kenar);border-radius:var(--radius);animation:nabiz 1.2s infinite alternate}@keyframes nabiz{to{opacity:.4}}@media(prefers-reduced-motion:reduce){.iskelet{animation:none}}</style>
