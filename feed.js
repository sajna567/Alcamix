// feed.js — backend connected
let FOODS = [];
let activeFilter = 'all';
let searchQuery = '';
let activeClaim = null;

async function loadListings() {
  const res = await fetch('/api/listings');
  FOODS = await res.json();
  renderFeed();
}

function filterListings() {
  return FOODS.filter(f => {
    const matchFilter =
      activeFilter === 'all' ||
      activeFilter === f.status ||
      (activeFilter === 'veg' && ['Veg', 'Vegetarian', 'Vegan'].includes(f.type)) ||
      (activeFilter === 'nonveg' && ['Non-Veg', 'Non-Vegetarian'].includes(f.type)) ||
      (activeFilter === 'new' && f.isUserPost);
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || [f.name, f.city, f.area, f.address, f.source, f.type]
      .some(v => String(v || '').toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });
}

function renderStats(data) {
  const avail = data.filter(f => f.status === 'available');
  const claimed = data.filter(f => f.status === 'claimed');
  document.getElementById('totalCount').textContent = data.length;
  document.getElementById('availCount').textContent = avail.length;
  document.getElementById('claimedCount').textContent = claimed.length;
  document.getElementById('portionsCount').textContent = avail.reduce((a, f) => a + Number(f.qty || 0), 0);
}

function renderFeed() {
  const data = filterListings();
  const grid = document.getElementById('feedGrid');
  renderStats(data);
  if (data.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted)">No listings found. Try adjusting filters.</div>';
    return;
  }
  grid.innerHTML = data.map(f => {
    const location = f.area && f.city ? `${f.area}, ${f.city}` : (f.address || f.city || f.area || '—');
    const newBadge = f.isUserPost ? '<div class="card-new-badge">🆕 Just Posted</div>' : '';
    const pickupTime = f.pickupFrom ? `${f.pickupFrom} – ${f.pickupTo}` : '';
    return `
    <div class="feed-card ${f.status === 'claimed' ? 'claimed-card' : ''} ${f.isUserPost ? 'user-post-card' : ''}" id="card-${f.id}">
      <div class="card-img">
        <span style="font-size:5rem">${f.emoji || '🍱'}</span>
        ${newBadge}
        <div class="card-badge ${f.status === 'available' ? 'badge-available' : 'badge-claimed'}">
          ${f.status === 'available' ? '🟢 Available' : '✅ Claimed'}
        </div>
        ${f.status === 'available' && f.mins > 0 ? `<div class="card-timer">⏰ ${f.mins} min left</div>` : ''}
      </div>
      <div class="card-body">
        <div class="card-food-name">${f.name}</div>
        <div class="card-meta">
          <span>📦 ~${f.qty} portions</span>
          <span>📍 ${location}</span>
          <span>🏷️ ${f.type}</span>
          <span>🏠 ${f.source}</span>
          ${pickupTime ? `<span>⏰ ${pickupTime}</span>` : ''}
          ${f.contact ? `<span>📞 ${f.contact.split('|')[0].trim()}</span>` : ''}
        </div>
        <div class="card-tags">${(f.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
        <div class="card-actions">
          <button class="card-btn-claim" ${f.status === 'claimed' ? 'disabled' : ''} onclick="openClaim('${f.id}')">
            ${f.status === 'claimed' ? 'Already Claimed' : 'Claim This Food'}
          </button>
          <button class="card-btn-share" onclick="shareListing('${f.id}')">📤</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

window.openClaim = function(id) {
  activeClaim = id;
  const f = FOODS.find(x => x.id == id);
  if (!f) return;
  const loc = f.area && f.city ? `${f.area}, ${f.city}` : (f.address || '');
  document.getElementById('modalTitle').textContent = f.name;
  document.getElementById('modalDesc').textContent = `~${f.qty} portions at ${loc}`;
  document.getElementById('claimModal').classList.remove('hidden');
  document.getElementById('claimName').value = '';
  document.getElementById('claimPhone').value = '';
};

window.shareListing = function(id) {
  const f = FOODS.find(x => x.id == id);
  const loc = f?.area && f?.city ? `${f.area}, ${f.city}` : '';
  const text = `${f?.qty} portions available at ${loc}`;
  if (navigator.share) navigator.share({ title: 'FoodBridge: ' + f?.name, text, url: window.location.href });
  else navigator.clipboard.writeText(window.location.href);
};

document.getElementById('modalClose')?.addEventListener('click', () => document.getElementById('claimModal').classList.add('hidden'));

document.getElementById('confirmClaim')?.addEventListener('click', async () => {
  const name = document.getElementById('claimName').value.trim();
  const phone = document.getElementById('claimPhone').value.trim();
  const claimType = document.getElementById('claimType').value;
  const nameEl = document.getElementById('claimName');
  const phoneEl = document.getElementById('claimPhone');
  nameEl.style.borderColor = name ? '' : 'var(--orange)';
  phoneEl.style.borderColor = phone ? '' : 'var(--orange)';
  if (!name || !phone) return;

  const res = await fetch(`/api/listings/${activeClaim}/claim`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, claimType })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Claim failed' }));
    alert(err.message);
    return;
  }
  document.getElementById('claimModal').classList.add('hidden');
  await loadListings();
});

document.getElementById('filterBar')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderFeed();
});

document.getElementById('searchInput')?.addEventListener('input', (e) => { searchQuery = e.target.value; renderFeed(); });
document.getElementById('hamburger')?.addEventListener('click', () => document.getElementById('navLinks')?.classList.toggle('open'));
setInterval(loadListings, 30000);
loadListings();
