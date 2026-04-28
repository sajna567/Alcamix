// donate.js — multi-step form logic
const steps = [
  document.getElementById('formStep1'),
  document.getElementById('formStep2'),
  document.getElementById('formStep3'),
  document.getElementById('formSuccess')
];
const psEls = [
  document.getElementById('ps1'),
  document.getElementById('ps2'),
  document.getElementById('ps3')
];
const lines = document.querySelectorAll('.ps-line');

function goTo(idx) {
  steps.forEach((s, i) => s.classList.toggle('active', i === idx));
  psEls.forEach((p, i) => {
    p.classList.toggle('active', i === idx);
    p.classList.toggle('done', i < idx);
  });
  lines.forEach((l, i) => l.classList.toggle('done', i < idx));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Inline error helper ──────────────────────────────────────────────────────
function showError(inputId, msg) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.classList.add('input-error');
  let err = el.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'field-error';
    el.parentElement.appendChild(err);
  }
  err.textContent = msg;
}
function clearErrors() {
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  document.querySelectorAll('.field-error').forEach(el => el.remove());
}

// ── Step 1 → 2 ───────────────────────────────────────────────────────────────
document.getElementById('step1Next')?.addEventListener('click', () => {
  clearErrors();
  let valid = true;
  const name = document.getElementById('foodName').value.trim();
  const qty  = document.getElementById('foodQty').value;
  const type = document.getElementById('foodType').value;
  const src  = document.getElementById('foodSource').value;
  if (!name) { showError('foodName', 'Food name is required'); valid = false; }
  if (!qty)  { showError('foodQty',  'Portions count is required'); valid = false; }
  if (!type) { showError('foodType', 'Please select a food type'); valid = false; }
  if (!src)  { showError('foodSource','Please select a source'); valid = false; }
  if (!valid) return;
  goTo(1);
});

// ── Step 2 → 3 ───────────────────────────────────────────────────────────────
document.getElementById('step2Next')?.addEventListener('click', () => {
  clearErrors();
  let valid = true;
  const addr  = document.getElementById('address').value.trim();
  const city  = document.getElementById('city').value.trim();
  const from  = document.getElementById('pickupFrom').value;
  const to    = document.getElementById('pickupTo').value;
  const cname = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  if (!addr)  { showError('address',     'Pickup address is required'); valid = false; }
  if (!city)  { showError('city',        'City is required'); valid = false; }
  if (!from)  { showError('pickupFrom',  'Set pickup start time'); valid = false; }
  if (!to)    { showError('pickupTo',    'Set pickup end time'); valid = false; }
  if (!cname) { showError('contactName', 'Contact name is required'); valid = false; }
  if (!phone) { showError('contactPhone','Phone number is required'); valid = false; }
  if (!valid) return;
  buildReview();
  goTo(2);
});

document.getElementById('step2Back')?.addEventListener('click', () => goTo(0));
document.getElementById('step3Back')?.addEventListener('click', () => goTo(1));

function buildReview() {
  const rc = document.getElementById('reviewCard');
  const rows = [
    ['Food',          document.getElementById('foodName').value],
    ['Portions',      document.getElementById('foodQty').value],
    ['Type',          document.getElementById('foodType').value],
    ['Source',        document.getElementById('foodSource').value],
    ['Pickup Address',document.getElementById('address').value + ', ' + document.getElementById('city').value],
    ['Pickup Window', document.getElementById('pickupFrom').value + ' – ' + document.getElementById('pickupTo').value],
    ['Contact',       document.getElementById('contactName').value + ' | ' + document.getElementById('contactPhone').value],
  ];
  rc.innerHTML = rows.map(([k, v]) => `
    <div class="review-row">
      <span class="review-key">${k}</span>
      <span class="review-val">${v || '—'}</span>
    </div>`).join('');
}

// ── Submit & Save to Backend ─────────────────────────────────────────────
document.getElementById('submitBtn')?.addEventListener('click', async () => {
  clearErrors();

  const termsCheck = document.getElementById('termsCheck');
  const termsWrap  = termsCheck?.closest('.terms-check');
  if (!termsCheck.checked) {
    let err = termsWrap?.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      termsWrap?.appendChild(err);
    }
    err.textContent = '⚠️ You must confirm before posting.';
    termsWrap?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Posting...';

  const donation = {
    name: document.getElementById('foodName').value.trim(),
    qty: parseInt(document.getElementById('foodQty').value),
    type: document.getElementById('foodType').value,
    source: document.getElementById('foodSource').value,
    address: document.getElementById('address').value.trim(),
    city: document.getElementById('city').value.trim(),
    area: document.getElementById('address').value.trim(),
    pincode: document.getElementById('pincode').value.trim(),
    pickupFrom: document.getElementById('pickupFrom').value,
    pickupTo: document.getElementById('pickupTo').value,
    contactName: document.getElementById('contactName').value.trim(),
    contactPhone: document.getElementById('contactPhone').value.trim(),
    contactEmail: document.getElementById('contactEmail').value.trim(),
    allergens: document.getElementById('allergens').value.trim(),
    desc: document.getElementById('foodDesc').value.trim()
  };

  try {
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donation)
    });
    const listing = await res.json();
    if (!res.ok) throw new Error(listing.message || 'Could not post donation');

    document.getElementById('listingId').textContent = listing.id;
    document.getElementById('notifiedCount').textContent = Math.floor(20 + Math.random() * 60);
    goTo(3);
  } catch (err) {
    alert(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '🚀 Post Food Now';
  }
});

// ── Photo upload ──────────────────────────────────────────────────────────────
const uploadZone  = document.getElementById('uploadZone');
const photoInput  = document.getElementById('photoInput');
const previewImg  = document.getElementById('previewImg');
const uploadInner = document.getElementById('uploadInner');

uploadZone?.addEventListener('click', (e) => {
  if (e.target === previewImg) return;
  photoInput.click();
});
photoInput?.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (file) {
    previewImg.src = URL.createObjectURL(file);
    previewImg.classList.remove('hidden');
    uploadInner.classList.add('hidden');
  }
});
uploadZone?.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag'));
uploadZone?.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    previewImg.src = URL.createObjectURL(file);
    previewImg.classList.remove('hidden');
    uploadInner.classList.add('hidden');
  }
});

// ── Geolocation ───────────────────────────────────────────────────────────────
document.getElementById('geoBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('geoBtn');
  if (!navigator.geolocation) {
    btn.textContent = '❌ Geolocation not supported';
    return;
  }
  btn.textContent = '📡 Locating…';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      document.getElementById('address').value =
        `Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`;
      btn.textContent = '✅ Location Set';
    },
    () => { btn.textContent = '❌ Could not get location'; }
  );
});

// ── Hamburger ─────────────────────────────────────────────────────────────────
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('open');
});
