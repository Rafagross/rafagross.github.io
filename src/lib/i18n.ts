// src/lib/i18n.ts — client-side language store + UI string dictionary.
// Static body content is NOT translated; only UI chrome strings live here.
export type Lang = 'en' | 'es';

export function getLang(): Lang {
  if (typeof document === 'undefined') return 'en';
  return (document.documentElement.getAttribute('data-lang') as Lang) || 'en';
}

export function setLang(lang: Lang): void {
  document.documentElement.setAttribute('data-lang', lang);
  try { localStorage.setItem('lang', lang); } catch {}
  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

export function onLangChange(cb: (lang: Lang) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent).detail as Lang);
  window.addEventListener('langchange', handler);
  return () => window.removeEventListener('langchange', handler);
}

// Nav link labels + hrefs (real routes, not anchors). Order is canonical.
export const NAV = {
  en: ['Projects', 'Runbooks', 'Writing', 'About', 'Resume', 'Contact'],
  es: ['Proyectos', 'Runbooks', 'Escritura', 'Sobre mí', 'Currículum', 'Contacto'],
} as const;
export const NAV_HREFS = ['/projects', '/runbooks', '/writing', '/about', '/resume', '/contact'];
