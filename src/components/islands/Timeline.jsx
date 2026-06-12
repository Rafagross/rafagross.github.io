/**
 * Timeline.jsx
 * Animated experience timeline for About / Resume pages.
 * Each entry uses .fade-in which ds-interactions.ts activates on scroll.
 *
 * Usage in .astro file:
 *   import Timeline from '../components/islands/Timeline.jsx';
 *   <Timeline client:visible />
 */

const EXPERIENCE = [
  {
    role: 'Cloud Operations Engineer',
    company: 'International Game Technology (IGT)',
    location: 'Las Vegas, NV',
    period: 'Mar 2025 – Apr 2026',
    highlights: [
      'Managed multi-account AWS environments supporting gaming infrastructure at 99.9%+ availability.',
      'Automated patch compliance across 200+ Linux & Windows EC2 instances — ~40% faster via SSM Patch Manager.',
      'Led zero-downtime EKS version upgrades using Golden AMI strategy with post-upgrade CloudWatch validation.',
      'Reduced MTTD with custom CloudWatch alarms, log-based alerting, and Container Insights dashboards.',
      'Conducted AWS Well-Architected reviews across 2 HRI lenses, remediating 6 critical risk gaps.',
    ],
  },
  {
    role: 'Pre-Sales Cloud Engineer',
    company: 'CODESA (IT & Cloud Consulting)',
    location: 'Lima, Peru',
    period: 'Apr 2021 – Nov 2024',
    highlights: [
      'Architected production-ready GCP solutions using Cloud Run, Pub/Sub, BigQuery, and IAM.',
      'Reduced time-to-close on technical evaluations by ~30% through end-to-end PoCs.',
      'Designed real-time data pipeline architectures (Pub/Sub → BigQuery) for enterprise proposals.',
    ],
  },
  {
    role: 'Cloud Support Engineer',
    company: 'Zeta Ltd',
    location: 'Lima, Peru',
    period: '2019 – 2021',
    highlights: [
      'Monitored cloud infrastructure health, triaging incidents across compute, networking, and IAM.',
      'Managed access provisioning and security posture reviews with least-privilege enforcement.',
    ],
  },
];

export default function Timeline() {
  return (
    <div className="ds-timeline">
      {EXPERIENCE.map((exp, idx) => (
        <div key={exp.company} className="ds-timeline-entry fade-in">
          <div className="ds-timeline-header">
            <div>
              <p className="ds-timeline-role">{exp.role}</p>
              <p className="ds-timeline-company">
                {exp.company}
                <span style={{ color: 'var(--text-faint)', margin: '0 6px' }}>·</span>
                {exp.location}
              </p>
            </div>
            <span className="ds-timeline-period">{exp.period}</span>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0, listStyle: 'none' }}>
            {exp.highlights.map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-muted)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                <span style={{ flexShrink: 0, marginTop: '1px', color: 'var(--text-faint)' }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
