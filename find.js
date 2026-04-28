// find.js — backend connected
let NEARBY = [];
let sortKey = 'distance';

async function loadNearby() {
  const res = await fetch('/api/listings?status=available');
  NEARBY = await res.json();
  renderResults();
}

function getSorted() {
  return [...NEARBY].sort((a, b) => {
    if (sortKey === 'distance') return Number(a.dist || 999) - Number(b.dist || 999);
    if (sortKey === 'qty') return Number(b.qty || 0) - Number(a.qty || 0);
    if (sortKey === 'time') return Number(a.mins || 999) - Number(b.mins || 999);
    return 0;
  });
}

function renderResults() {
  const list = document.getElementById('resultList');
  const data = getSorted();
  document.getElementById('resultCount').textContent = `Showing ${data.length} listings`;
  if (data.length === 0) {
    list.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted)">No available food found right now.</div>';
    return;
  }
  list.innerHTML = data.map(f => {
    const loc = f.area || f.address || f.city || '—';
    const pickupTime = f.pickupFrom ? ` &nbsp;•&nbsp; ⏱️ ${f.pickupFrom}–${f.pickupTo}` : '';
    const newBadge = f.isUserPost ? '<span class="ri-new-badge">🆕 Just Posted</span>' : '';
    const contactLine = f.contact ? `<span>📞 ${f.contact.split('|')[0].trim()}</span>` : '';
    return `
    <div class="result-item ${f.isUserPost ? 'user-post-item' : ''}">
      <div class="ri-emoji">${f.emoji || '🍱'}</div>
      <div class="ri-body">
        <div class="ri-name">${f.name} ${newBadge}</div>
        <div class="ri-meta">
          <span>📦 ~${f.qty} portions</span>
          <span>📍 ${loc}</span>
          <span>⏰ ${f.mins || 0} min left${pickupTime}</span>
          <span>🏠 ${f.source}</span>
          ${contactLine}
        </div>
        <div class="ri-tags"><span class="ri-tag">${f.type}</span><span class="ri-tag">🟢 Available</span></div>
      </div>
      <div class="ri-right">
        <span class="ri-dist">${f.dist || '—'} km</span>
        <button class="ri-claim-btn" onclick="claimResult('${f.id}', this)">Claim →</button>
      </div>
    </div>`;
  }).join('');
}

window.claimResult = async function(id, btn) {
  const name = prompt('Enter your name / organisation');
  const phone = prompt('Enter phone number');
  if (!name || !phone) return;
  btn.disabled = true;
  btn.textContent = 'Claiming...';
  const res = await fetch(`/api/listings/${id}/claim`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, claimType: document.getElementById('findUserType')?.value || 'Individual' })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Claim failed' }));
    alert(err.message);
    btn.disabled = false;
    btn.textContent = 'Claim →';
    return;
  }
  btn.textContent = '✅ Claimed';
  await loadNearby();
};

document.getElementById('sortBy')?.addEventListener('change', (e) => { sortKey = e.target.value; renderResults(); });
document.getElementById('radiusSlider')?.addEventListener('input', (e) => document.getElementById('radiusVal').textContent = e.target.value + ' km');
document.getElementById('findGeoBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('findGeoBtn');
  if (!navigator.geolocation) { btn.textContent = '❌ Not supported'; return; }
  btn.textContent = '📡 Locating…';
  navigator.geolocation.getCurrentPosition(
    () => { btn.textContent = '✅ Location Detected'; document.getElementById('findLocation').value = 'Current Location'; },
    () => { btn.textContent = '❌ Failed'; }
  );
});
document.getElementById('findBtn')?.addEventListener('click', loadNearby);

document.getElementById('registerAlertBtn')?.addEventListener('click', () => document.getElementById('alertModal').classList.remove('hidden'));
document.getElementById('alertModalClose')?.addEventListener('click', () => document.getElementById('alertModal').classList.add('hidden'));
document.getElementById('confirmAlert')?.addEventListener('click', async () => {
  const name = document.getElementById('alertName').value.trim();
  const phone = document.getElementById('alertPhone').value.trim();
  document.getElementById('alertName').style.borderColor = name ? '' : 'var(--orange)';
  document.getElementById('alertPhone').style.borderColor = phone ? '' : 'var(--orange)';
  if (!name || !phone) return;
  const res = await fetch('/api/alerts', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      phone,
      email: document.getElementById('alertEmail').value.trim(),
      alertType: document.getElementById('alertType').value,
      location: document.getElementById('findLocation').value.trim()
    })
  });
  if (!res.ok) return alert('Could not register alert');
  document.getElementById('alertModal').classList.add('hidden');
  const rp = document.querySelector('.register-panel');
  if (rp) rp.innerHTML = '<div class="rp-icon">✅</div><h3>Alerts Enabled!</h3><p>You\'ll be notified when food becomes available near you.</p>';
});
document.getElementById('hamburger')?.addEventListener('click', () => document.getElementById('navLinks')?.classList.toggle('open'));
loadNearby();
