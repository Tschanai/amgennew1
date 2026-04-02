/* ─────────────────────────────────────────
   AMGEN.CH — REDESIGN  |  main.js
   ───────────────────────────────────────── */

'use strict';

/* ── HEADER SCROLL EFFECT ── */
(function () {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();

/* ── NOTICE BANNER CLOSE ── */
(function () {
  const btn = document.getElementById('noticeBannerClose');
  const banner = document.getElementById('noticeBanner');
  if (!btn || !banner) return;
  btn.addEventListener('click', () => {
    banner.style.maxHeight = banner.offsetHeight + 'px';
    requestAnimationFrame(() => {
      banner.style.transition = 'max-height .35s ease, padding .35s ease, border .35s ease';
      banner.style.maxHeight = '0';
      banner.style.padding = '0 40px';
      banner.style.borderBottom = 'none';
      banner.style.overflow = 'hidden';
    });
  });
})();

/* ── SEARCH TOGGLE ── */
(function () {
  const toggleBtn = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  if (!toggleBtn || !searchBar) return;

  toggleBtn.addEventListener('click', () => {
    const open = searchBar.classList.toggle('open');
    if (open && searchInput) searchInput.focus();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchBar.classList.contains('open')) {
      searchBar.classList.remove('open');
    }
  });
})();

/* ── EXTERNAL LINK MODAL ── */
(function () {
  const overlay  = document.getElementById('modalOverlay');
  const cancelBtn = document.getElementById('modalCancel');
  const confirmBtn = document.getElementById('modalConfirm');
  if (!overlay) return;

  let pendingHref = '';

  // Intercept external links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-external]');
    if (!link) return;
    e.preventDefault();
    pendingHref = link.dataset.external || link.href;
    overlay.classList.add('active');
  });

  function closeModal() {
    overlay.classList.remove('active');
    pendingHref = '';
  }

  if (cancelBtn)  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (pendingHref) window.open(pendingHref, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }
})();

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── INTERSECTION OBSERVER — fade-in on scroll ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
    .fade-in-delay-1 { transition-delay: .1s; }
    .fade-in-delay-2 { transition-delay: .2s; }
    .fade-in-delay-3 { transition-delay: .3s; }
    .fade-in-delay-4 { transition-delay: .4s; }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        observer.unobserve(el.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();
