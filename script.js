/* ═══════════════════════════════════════════════
   PPT SERVICE — script.js
   Navigation · Charts · Animations · Counter
   ═══════════════════════════════════════════════ */

/* ── DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initParticles();
  initHeroChart();
  initPerformanceChart();
  initScrollReveal();
  initCounters();
  initTickerLive();
  initBackTop();
  initNavActiveLink();
});

/* ══════════════════════════════════════════════
   NAVBAR — Scroll Shadow
══════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

/* ══════════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════════ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ══════════════════════════════════════════════
   PARTICLES (Hero Background)
══════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDuration = (6 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
    p.style.opacity = (0.2 + Math.random() * 0.5).toString();
    container.appendChild(p);
  }
}

/* ══════════════════════════════════════════════
   HERO CHART — Animated NIFTY Line
══════════════════════════════════════════════ */
function initHeroChart() {
  const canvas = document.getElementById('heroChart');
  if (!canvas || typeof Chart === 'undefined') return;

  // Generate realistic-looking NIFTY data
  const baseData = generateNiftyData(60, 23800, 24200);
  const labels = baseData.map((_, i) => i);

  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 180);
  grad.addColorStop(0, 'rgba(201,168,76,0.25)');
  grad.addColorStop(1, 'rgba(201,168,76,0)');

  const heroChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: baseData,
        borderColor: '#c9a84c',
        borderWidth: 2,
        backgroundColor: grad,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#c9a84c',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#0d1218',
        borderColor: '#c9a84c',
        borderWidth: 1,
        titleColor: '#9a9488',
        bodyColor: '#c9a84c',
        callbacks: {
          label: ctx => '₹ ' + ctx.parsed.y.toFixed(2)
        }
      }},
      scales: {
        x: { display: false },
        y: {
          display: true,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a5650', font: { size: 11 }, callback: v => '₹' + v.toLocaleString('en-IN') }
        }
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false }
    }
  });

  // Animate live — add new point every 2s
  let idx = baseData.length;
  let last = baseData[baseData.length - 1];
  setInterval(() => {
    last = last + (Math.random() - 0.48) * 18;
    last = Math.max(23600, Math.min(24600, last));
    heroChart.data.labels.push(idx++);
    heroChart.data.datasets[0].data.push(parseFloat(last.toFixed(2)));
    if (heroChart.data.labels.length > 80) {
      heroChart.data.labels.shift();
      heroChart.data.datasets[0].data.shift();
    }
    heroChart.update('none');

    // Update displayed price
    const priceEl = document.querySelector('.cf-price');
    if (priceEl) priceEl.textContent = last.toFixed(2);
    const buyEl = document.querySelector('.cf-buy');
    if (buyEl) {
      const diff = last - 23900;
      buyEl.textContent = diff >= 0 ? '▲ BUY Signal Active' : '▼ SELL Signal Active';
      buyEl.style.color = diff >= 0 ? '#22c55e' : '#ef4444';
    }
  }, 2000);
}

/* ══════════════════════════════════════════════
   PERFORMANCE CHART — Doughnut + Bar
══════════════════════════════════════════════ */
function initPerformanceChart() {
  const canvas = document.getElementById('performanceChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4'],
      datasets: [
        {
          label: 'Trades Completed',
          data: [22, 25, 24, 19],
          backgroundColor: [
            'rgba(201,168,76,0.7)',
            'rgba(201,168,76,0.85)',
            'rgba(201,168,76,0.75)',
            'rgba(201,168,76,0.5)',
          ],
          borderColor: '#c9a84c',
          borderWidth: 1.5,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Trade Distribution (90 Total Trades)',
          color: '#9a9488',
          font: { size: 13, family: 'DM Sans' },
          padding: { bottom: 20 }
        },
        tooltip: {
          backgroundColor: '#0d1218',
          borderColor: '#c9a84c',
          borderWidth: 1,
          titleColor: '#9a9488',
          bodyColor: '#c9a84c',
          callbacks: {
            afterLabel: () => 'Indicative data only'
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a5650', font: { size: 12 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a5650', font: { size: 12 }, stepSize: 5 },
          min: 0, max: 35
        }
      },
      animation: { duration: 1500, easing: 'easeOutQuart' }
    }
  });
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = 'true';
        animateCounter(e.target, parseInt(e.target.dataset.target));
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
  let start = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

/* ══════════════════════════════════════════════
   LIVE TICKER — Simulated Price Updates
══════════════════════════════════════════════ */
function initTickerLive() {
  const stocks = [
    { name: 'NIFTY 50', base: 24189.50 },
    { name: 'BANKNIFTY', base: 51432.20 },
    { name: 'SENSEX', base: 79843.00 },
    { name: 'RELIANCE', base: 2981.35 },
    { name: 'TCS', base: 3641.70 },
    { name: 'HDFC BANK', base: 1712.80 },
    { name: 'INFY', base: 1482.50 },
    { name: 'ITC', base: 432.90 },
    { name: 'WIPRO', base: 456.30 },
    { name: 'AXISBANK', base: 1067.55 },
    { name: 'MARUTI', base: 12340.00 },
  ];
  const prices = stocks.map(s => s.base);
  const tape = document.getElementById('tickerTape');
  if (!tape) return;

  setInterval(() => {
    const ticks = tape.querySelectorAll('.tick');
    let idx = 0;
    ticks.forEach(tick => {
      if (idx >= stocks.length) { idx = 0; return; }
      const delta = (Math.random() - 0.48) * prices[idx] * 0.002;
      prices[idx] = Math.max(prices[idx] * 0.97, prices[idx] + delta);
      const change = ((prices[idx] - stocks[idx].base) / stocks[idx].base * 100);
      const dir = change >= 0 ? '▲' : '▼';
      tick.textContent = `${stocks[idx].name} \u00a0${dir} ${prices[idx].toFixed(2)} \u00a0${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
      tick.className = 'tick ' + (change >= 0 ? 'up' : 'down');
      idx++;
    });
  }, 3000);
}

/* ══════════════════════════════════════════════
   BACK TO TOP BUTTON
══════════════════════════════════════════════ */
function initBackTop() {
  const btn = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  });
}

/* ══════════════════════════════════════════════
   NAV ACTIVE LINK — Scroll Spy
══════════════════════════════════════════════ */
function initNavActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════════════
   CONTACT FORM SUBMIT
══════════════════════════════════════════════ */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Submitting...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Submitted';
    btn.style.background = 'linear-gradient(135deg,#166534,#22c55e)';
    success.style.display = 'block';
    setTimeout(() => {
      e.target.reset();
      btn.textContent = 'Submit Enquiry';
      btn.disabled = false;
      btn.style.background = '';
      success.style.display = 'none';
    }, 5000);
  }, 1500);
}

/* ══════════════════════════════════════════════
   HELPER — Generate NIFTY-like Data
══════════════════════════════════════════════ */
function generateNiftyData(count, min, max) {
  const data = [];
  let val = (min + max) / 2;
  for (let i = 0; i < count; i++) {
    val += (Math.random() - 0.47) * 22;
    val = Math.max(min, Math.min(max, val));
    data.push(parseFloat(val.toFixed(2)));
  }
  return data;
}

/* ══════════════════════════════════════════════
   SMOOTH SCROLL for all anchor links
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
