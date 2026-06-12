/* Nav.jsx — fixed top navigation bar (React island) */

import React, { useState, useEffect } from 'react';
import { NAV, NAV_HREFS, getLang, setLang as setLangStore, onLangChange } from '../../lib/i18n.js';

function NavLinkInline({ href, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      style={{
        position: 'relative',
        textDecoration: 'none',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        letterSpacing: 'var(--tracking-tight)',
        color: hov ? 'var(--text)' : 'var(--text-muted)',
        transition: 'color var(--duration-fast) var(--ease-default)',
        paddingBottom: 2,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 1,
          background: 'var(--accent)',
          width: hov ? '100%' : '0%',
          transition: 'width var(--duration-normal) var(--ease-default)',
        }}
      />
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState(getLang());
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => onLangChange(setLang), []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
    setIsDark(!isDark);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        background: scrolled ? 'var(--overlay)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition:
          'background var(--duration-normal) var(--ease-default), border-color var(--duration-normal) var(--ease-default)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '0 clamp(20px,4vw,48px)',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Monogram */}
        <a href="/" style={{ textDecoration: 'none', color: 'var(--text)', flexShrink: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            ERG
          </span>
        </a>

        {/* Nav links (hidden on mobile via .ds-nav-links CSS rule) */}
        <div
          className="ds-nav-links"
          style={{ display: 'flex', gap: 28, flex: 1, justifyContent: 'center' }}
        >
          {NAV[lang].map((label, i) => (
            <NavLinkInline key={i} href={NAV_HREFS[i]}>
              {label}
            </NavLinkInline>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Language toggle */}
          <button
            onClick={() => setLangStore(lang === 'en' ? 'es' : 'en')}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '5px 10px',
              transition: 'border-color var(--duration-fast) var(--ease-default)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>

          {/* Theme toggle */}
          <button
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition:
                'border-color var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {isDark ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
