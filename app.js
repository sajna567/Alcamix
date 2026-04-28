// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const pct = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (pct < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

// ===== INTERSECTION OBSERVER =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    // counters
    if (el.classList.contains('counter') || el.classList.contains('stat-num')) {
      animateCounter(el);
    }
    // impact bar fills
    el.querySelectorAll && el.querySelectorAll('.impact-bar-fill').forEach(bar => {
      bar.style.width = bar.style.getPropertyValue('--pct') || bar.style.cssText.match(/--pct:([^;]+)/)?.[1] || '0%';
    });
    io.unobserve(el);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.counter, .stat-num, .impact-card').forEach(el => io.observe(el));

// ===== LIVE TICKER =====
const listings = [
  { food: 'Biryani & Raita', qty: '~40 portions', loc: 'Banjara Hills, HYD', time: '45 min left', status: 'available' },
  { food: 'Wedding Buffet', qty: '~120 portions', loc: 'Koramangala, BLR', time: '1.5 hrs left', status: 'available' },
  { food: 'Dal & Roti', qty: '~25 portions', loc: 'Andheri, MUM', time: 'Claimed', status: 'claimed' },
  { food: 'Veg Thali', qty: '~60 portions', loc: 'Connaught Pl, DEL', time: '30 min left', status: 'available' },
  { food: 'Hostel Dinner', qty: '~35 portions', loc: 'Anna Nagar, CHN', time: '2 hrs left', status: 'available' },
  { food: 'Paneer Curry', qty: '~18 portions', loc: 'FC Road, PUN', time: 'Claimed', status: 'claimed' },
  { food: 'Event Snacks', qty: '~200 pieces', loc: 'Salt Lake, KOL', time: '1 hr left', status: 'available' },
  { food: 'Mixed Sabzi', qty: '~30 portions', loc: 'Jayanagar, BLR', time: '50 min left', status: 'available' },
];

const ticker = document.getElementById('stripTicker');
if (ticker) {
  listings.forEach(l => {
    const c = document.createElement('div');
    c.className = 'ticker-card';
    c.innerHTML = `<div class="ticker-food">${l.food}</div>
      <div class="ticker-meta">📦 ${l.qty} &nbsp;•&nbsp; 📍 ${l.loc}</div>
      <div class="ticker-meta">⏰ ${l.time}</div>
      <span class="ticker-status status-${l.status}">${l.status === 'available' ? '🟢 Available' : '✅ Claimed'}</span>`;
    ticker.appendChild(c);
  });
}

// ===== SMOOTH REVEAL FOR SECTIONS =====
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.hiw-step, .testi-card, .impact-card, .panel').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  revealIO.observe(el);
});
