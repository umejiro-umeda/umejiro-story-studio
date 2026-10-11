(() => {
 const form = document.getElementById('inquiry-form');
 const button = document.getElementById('send-inquiry');
 const status = document.getElementById('form-status');
 const endpoint = window.UMEJIRO_CONTACT?.endpoint || '';
 const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
 let busy = false;
 if (location.protocol === 'file:') {
  document.querySelectorAll('[data-home]').forEach(a => a.href = 'index.html' + new URL(a.href).hash);
 }
 function report(message, type) { status.textContent = message; status.dataset.state = type; status.focus(); }
 document.getElementById('setup-note').hidden = configured;
 if (configured) { form.action = endpoint; button.disabled = false; }
 form.addEventListener('submit', async e => {
  e.preventDefault();
  if (busy) return;
  if (!configured) { report('現在フォームから送信できません。InstagramのDMまたはメールをご利用ください。', 'error'); return; }
  for (const name of ['name', 'email', 'message']) {
   const input = form.elements.namedItem(name);
   input.setCustomValidity(input.value.trim() ? '' : 'この項目を入力してください。');
  }
  if (!form.reportValidity()) return;
  busy = true; button.disabled = true; button.textContent = '送信しています…'; form.setAttribute('aria-busy','true');
  status.textContent = '送信しています。そのままお待ちください。'; status.dataset.state = 'pending';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
   const payload = new FormData(form);
   for (const name of ['name','email','message']) payload.set(name, payload.get(name).trim());
   const response = await fetch(endpoint, { method:'POST', body:payload, headers:{Accept:'application/json'}, signal:controller.signal });
   const data = await response.json();
   if (!response.ok || data.ok !== true) throw new Error('rejected');
   form.reset();
   report('ご相談を送信しました。ありがとうございます。ご入力のメールアドレスへ返信いたします。', 'success');
  } catch (error) {
   report(error.name === 'AbortError' ? '通信がタイムアウトしたため、送信結果を確認できませんでした。入力内容は残しています。再送すると重複する可能性があるため、お急ぎの場合はDMまたはメールでお問い合わせください。' : '送信を完了できませんでした。入力内容は残しています。時間をおいて再度お試しいただくか、DMまたはメールでお問い合わせください。', 'error');
  } finally {
   clearTimeout(timeout); busy = false; button.disabled = false; button.textContent = '無料で相談を送信する'; form.removeAttribute('aria-busy');
  }
 });
 form.addEventListener('input', e => { if (typeof e.target.setCustomValidity === 'function') e.target.setCustomValidity(''); });
})();
