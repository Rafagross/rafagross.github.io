/**
 * ds-interactions.ts — progressive-enhancement behaviour, runs once per page load.
 *
 *   • Fade-in observer  (.fade-in → .is-visible)
 *   • Card spotlight    (.ds-card mousemove → --mx / --my)
 *   • Stagger children  (.ds-stagger > * cascade fade-in)
 *   • Text reveal       (.ds-reveal — words illuminate on scroll)
 *   • Custom cursor     (dot + ring, pointer:fine only, hidden on touch)
 *
 * Note: the metrics count-up is self-contained in the MetricsCounter React
 * island (a vanilla version here fought React hydration and froze).
 */

/* ── 1. Fade-in on scroll ────────────────────────────────────────── */
function initFadeIn(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        // preserve any delay already set by initStagger
        if (!el.style.transitionDelay) {
          el.style.transitionDelay = `${Math.min(i * 80, 320)}ms`;
        }
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in:not(.is-visible)').forEach((el) => io.observe(el));

  // Failsafe: if the observer never fires for near-viewport content (some
  // browsers / View-Transition timings drop the first callback), reveal
  // anything within ~1.2 screens after a short delay so content can never
  // stay stuck at opacity 0. Far-below content still reveals on scroll.
  window.setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.fade-in:not(.is-visible)').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.2) {
        el.classList.add('is-visible');
      }
    });
  }, 1400);
}

/* ── 2. Card spotlight ───────────────────────────────────────────── */
function initSpotlight(): void {
  document.querySelectorAll<HTMLElement>('.ds-card').forEach((card) => {
    // avoid double-binding across navigations
    if ((card as any).__spotlightBound) return;
    (card as any).__spotlightBound = true;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

/* ── 3. Stagger children (.ds-stagger > *) ───────────────────────── */
function initStagger(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('.ds-stagger').forEach((parent) => {
    Array.from(parent.children).forEach((child, i) => {
      const el = child as HTMLElement;
      if (!el.classList.contains('fade-in')) {
        el.classList.add('fade-in');
      }
      el.style.transitionDelay = `${i * 65}ms`;
    });
  });
}

/* Metrics count-up lives inside the MetricsCounter React island (self-contained
   useEffect + rAF) — a vanilla version here fought React hydration and froze. */

/* ── 5. Text reveal (.ds-reveal) — word-by-word illumination ──────── */
function initTextReveal(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Split new (un-processed) elements
  document.querySelectorAll<HTMLElement>('.ds-reveal:not([data-revealed])').forEach((el) => {
    el.dataset.revealed = '1';
    const parts = el.textContent?.split(/(\s+)/) ?? [];
    el.innerHTML = parts
      .map((part) => (/\S/.test(part) ? `<span class="ds-word">${part}</span>` : part))
      .join('');
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const words = entry.target.querySelectorAll<HTMLElement>('.ds-word:not(.is-lit)');
        words.forEach((word, i) => {
          setTimeout(() => word.classList.add('is-lit'), i * 22);
        });
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.ds-reveal').forEach((el) => io.observe(el));
}

/* ── 6. Custom cursor (fine-pointer devices only, init once) ───────── */
let _cursorReady = false;

function initCursor(): void {
  if (_cursorReady || !matchMedia('(pointer: fine)').matches) return;
  _cursorReady = true;

  const dot  = document.getElementById('ds-cursor')      as HTMLElement | null;
  const ring = document.getElementById('ds-cursor-ring') as HTMLElement | null;
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let ringHalf = 14; // half of default ring size (28px)

  // Dot: immediate follow
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  // Ring: hover state expands
  document.addEventListener('mouseover', (e) => {
    const isInteractive = !!(e.target as HTMLElement).closest(
      'a, button, [role="button"], .ds-card, input, textarea, select, label'
    );
    ring.classList.toggle('is-hover', isInteractive);
    ringHalf = isInteractive ? 22 : 14;
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // Ring: lerp follow
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const animRing = () => {
    rx = lerp(rx, mx, 0.11);
    ry = lerp(ry, my, 0.11);
    ring.style.transform = `translate(${rx - ringHalf}px, ${ry - ringHalf}px)`;
    requestAnimationFrame(animRing);
  };
  animRing();
}

/* ── Main init ──────────────────────────────────────────────────── */
function init(): void {
  initStagger(); // must run BEFORE initFadeIn so stagger children get observed
  initFadeIn();
  initSpotlight();
  initTextReveal();
  initCursor(); // no-op after first call
}

init();
