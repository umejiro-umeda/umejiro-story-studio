// No tracking, form submissions or external scripts.
const tabs = [...document.querySelectorAll('[data-panel]')];
const panels = [...document.querySelectorAll('.work-panel')];
if (tabs.length && panels.length) {
 document.documentElement.classList.add('has-js');
 document.querySelector('.work-tabs').setAttribute('role', 'tablist');
 function selectTab(tab, focus = false) {
  tabs.forEach(t => { const active = t === tab; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; });
  panels.forEach(p => { p.hidden = p.id !== tab.dataset.panel; });
  if (focus) tab.focus();
 }
 tabs.forEach((tab, index) => {
  tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', tab.dataset.panel);
  document.getElementById(tab.dataset.panel).setAttribute('role', 'tabpanel');
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', e => {
   let next;
   if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
   if (e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
   if (e.key === 'Home') next = 0;
   if (e.key === 'End') next = tabs.length - 1;
   if (next !== undefined) { e.preventDefault(); selectTab(tabs[next], true); }
  });
 });
 selectTab(tabs[0]);
}
const dialog = document.getElementById('comic-dialog');
if (dialog && typeof dialog.showModal === 'function') {
 const img = document.getElementById('dialog-image');
 const title = document.getElementById('dialog-title');
 document.querySelectorAll('.zoom-link').forEach(link => link.addEventListener('click', e => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); img.src = link.href; img.alt = link.dataset.comicTitle + '（上から下に読む4コマ漫画）'; title.textContent = link.dataset.comicTitle;
  dialog.showModal(); document.body.classList.add('modal-open'); dialog.querySelector('.dialog-scroll').scrollTop = 0;
 }));
 dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
 dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); img.removeAttribute('src'); });
}

// Keep the public /contact route usable in the local file preview.
if (location.protocol === "file:") {
 document.querySelectorAll('a[href="/contact"]').forEach(a => a.setAttribute("href", "contact.html"));
}
