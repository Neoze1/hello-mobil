<script lang="ts">
  // Demo iletişim formu: mesaj gönderilmez, yalnız bildirim gösterilir ve form temizlenir.
  // Metinler sayfanın diline göre seçilir (/iletisim, /en/iletisim, /ar/iletisim, /fa/iletisim).
  type Dil = "tr" | "en" | "ar" | "fa";
  const metinler: Record<Dil, { name: string; email: string; subject: string; message: string; demoSend: string; demoResult: string; demoNote: string }> = {
    "tr": {
      "name": "Ad soyad",
      "email": "E-posta",
      "subject": "Konu",
      "message": "Mesaj",
      "demoSend": "Demo mesajı hazırla",
      "demoResult": "Demo tamamlandı; mesaj gönderilmedi. Form temizlendi.",
      "demoNote": "Demo form: mesaj bu siteden gönderilmez. E-posta yapılandırılırsa kendi uygulamanda taslak açılır."
    },
    "en": {
      "name": "Full name",
      "email": "Email",
      "subject": "Subject",
      "message": "Message",
      "demoSend": "Prepare demo message",
      "demoResult": "Demo completed; no message was sent. The form was cleared.",
      "demoNote": "Demo form: this site does not send messages. If email is configured, a draft opens in your own mail app."
    },
    "ar": {
      "name": "الاسم الكامل",
      "email": "البريد الإلكتروني",
      "subject": "الموضوع",
      "message": "الرسالة",
      "demoSend": "إعداد رسالة تجريبية",
      "demoResult": "اكتملت التجربة دون إرسال رسالة. تم مسح النموذج.",
      "demoNote": "نموذج تجريبي: لا يرسل الموقع رسائل. عند إعداد البريد تُفتح مسودة في تطبيق بريدك."
    },
    "fa": {
      "name": "نام و نام خانوادگی",
      "email": "ایمیل",
      "subject": "موضوع",
      "message": "پیام",
      "demoSend": "آماده‌سازی پیام آزمایشی",
      "demoResult": "آزمایش پایان یافت؛ پیامی ارسال نشد و فرم پاک شد.",
      "demoNote": "فرم آزمایشی: سایت پیام ارسال نمی‌کند. اگر ایمیل تنظیم شده باشد پیش‌نویس در برنامه ایمیل شما باز می‌شود."
    }
  };

  let { dil = "tr" }: { dil?: Dil } = $props();
  const m = $derived(metinler[dil] ?? metinler.tr);
  let gonderildi = $state(false);

  function gonder(e: SubmitEvent) {
    e.preventDefault();
    gonderildi = true;
    (e.currentTarget as HTMLFormElement).reset();
  }
</script>

<form class="iletisim" onsubmit={gonder}>
  <p class="not">{m.demoNote}</p>
  <label>{m.name}<input name="ad" required autocomplete="name" /></label>
  <label>{m.email}<input name="eposta" type="email" required autocomplete="email" dir="ltr" /></label>
  <label>{m.subject}<input name="konu" required /></label>
  <label>{m.message}<textarea name="mesaj" rows="5" required></textarea></label>
  <button class="btn" type="submit">{m.demoSend}</button>
  {#if gonderildi}<p class="sonuc" role="status">{m.demoResult}</p>{/if}
</form>

<style>
  .iletisim { display: flex; flex-direction: column; gap: 14px; }
  .not { margin: 0; color: var(--yazi-soluk); font-size: 14px; }
  label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; font-size: 14px; }
  input, textarea { padding: 12px; border: 1px solid var(--kenar); border-radius: 10px; background: var(--zemin); color: var(--yazi); font: inherit; }
  input:focus-visible, textarea:focus-visible { outline: 2px solid var(--renk-ana); outline-offset: 2px; }
  .sonuc { margin: 0; padding: 12px; border: 1px solid var(--kenar); border-radius: 10px; background: var(--kart); font-weight: 600; }
</style>
