// src/scripts/ds-interactions.ts — DS entry fade-in + card spotlight.
function initFadeIn() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        el.style.transitionDelay = `${Math.min(i * 80, 320)}ms`;
        el.classList.add('is-visible');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach((el) => io.observe(el));
}

function initSpotlight() {
  document.querySelectorAll<HTMLElement>('.ds-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

initFadeIn();
initSpotlight();
