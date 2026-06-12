/**
 * MetricsCounter.jsx
 * Animated stats bar for the About page.
 *
 * The count-up animation is self-contained in React (useEffect + rAF) rather
 * than driven by the vanilla ds-interactions.ts script — otherwise React
 * hydration clobbers the DOM the script mutates and the numbers freeze.
 * Because the island is mounted with client:visible, the effect runs exactly
 * when the block scrolls into view.
 *
 * Usage:
 *   import MetricsCounter from '../components/islands/MetricsCounter.jsx';
 *   <MetricsCounter client:visible />
 */

import { useEffect, useState } from 'react';

const METRICS = [
  { target: 7,   suffix: '+', label: 'Years in Cloud',  note: 'AWS & GCP' },
  { target: 200, suffix: '+', label: 'EC2 Instances',   note: 'Managed at IGT' },
  { target: 7,   suffix: '',  label: 'Certifications',  note: 'Active & verified' },
  { target: 40,  suffix: '%', label: 'Faster Patching', note: 'SSM Automation' },
];

function Counter({ target, suffix }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return;
    }
    let raf;
    const duration = 1800;
    const t0 = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round(easeOut(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <span className="ds-counter" aria-label={`${target}${suffix}`}>
      {val}{suffix}
    </span>
  );
}

export default function MetricsCounter() {
  return (
    <div className="ds-metrics" aria-label="Key metrics">
      {METRICS.map((m) => (
        <div key={m.label} className="ds-metric">
          <Counter target={m.target} suffix={m.suffix} />
          <span className="ds-metric-label">{m.label}</span>
          <span className="ds-metric-note">{m.note}</span>
        </div>
      ))}
    </div>
  );
}
