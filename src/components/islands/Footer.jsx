/* Footer.jsx — minimal footer (React island) */

import React, { useState, useEffect } from 'react';
import { getLang, onLangChange } from '../../lib/i18n.js';

const T_FOOT = {
  en: {
    built: 'Designed and built by Elvis Rafael Gross.',
    role: 'CloudOps · Platform · SRE',
    links: ['GitHub', 'LinkedIn', 'Email'],
  },
  es: {
    built: 'Diseñado y construido por Elvis Rafael Gross.',
    role: 'CloudOps · Plataforma · SRE',
    links: ['GitHub', 'LinkedIn', 'Correo'],
  },
};

const LINK_HREFS = ['https://github.com/Rafagross', 'https://linkedin.com/in/rafagross', 'mailto:rafagross15@gmail.com'];

function FooterLink({ href, children, external }) {
  const [hov, setHov] = useState(false);
  const extraProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};
  return (
    <a
      href={href}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        color: hov ? 'var(--text)' : 'var(--text-muted)',
        textDecoration: 'none',
        transition: 'color var(--duration-fast) var(--ease-default)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      {...extraProps}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [lang, setLang] = useState('en'); // 'en' matches SSR; real value read on mount
  useEffect(() => {
    setLang(getLang());
    return onLangChange(setLang);
  }, []);

  const t = T_FOOT[lang];
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'clamp(40px,6vw,64px) clamp(20px,4vw,48px)',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text)',
              marginBottom: 6,
            }}
          >
            ERG
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
            }}
          >
            {t.built}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-faint)',
              marginTop: 4,
              letterSpacing: '0.06em',
            }}
          >
            {t.role}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {t.links.map((label, i) => (
            <FooterLink key={label} href={LINK_HREFS[i]} external={i < 2}>
              {label}
            </FooterLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
