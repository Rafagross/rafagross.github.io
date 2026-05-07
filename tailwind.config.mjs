/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — these map to CSS variables for theme switching
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        code: {
          bg: 'var(--color-code-bg)',
          text: 'var(--color-code-text)',
        },
        status: {
          active: '#16a34a',
          progress: '#d97706',
          deprecated: '#dc2626',
          draft: '#6b7280',
          p1: '#dc2626',
          p2: '#d97706',
          p3: '#2563eb',
          p4: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.6' }],
        base: ['1rem', { lineHeight: '1.7' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },
      maxWidth: {
        prose: '72ch',
        content: '1200px',
        article: '720px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 var(--shadow-color), 0 1px 2px -1px var(--shadow-color)',
        'card-hover': '0 4px 6px -1px var(--shadow-color), 0 2px 4px -2px var(--shadow-color)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: 'var(--color-text-primary)',
            a: {
              color: 'var(--color-accent)',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            code: {
              backgroundColor: 'var(--color-code-bg)',
              color: 'var(--color-code-text)',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.375rem',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: '400',
              fontSize: '0.875em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            h1: { color: 'var(--color-text-primary)', letterSpacing: '-0.02em' },
            h2: { color: 'var(--color-text-primary)', letterSpacing: '-0.01em' },
            h3: { color: 'var(--color-text-primary)' },
            strong: { color: 'var(--color-text-primary)' },
            blockquote: {
              borderLeftColor: 'var(--color-accent)',
              color: 'var(--color-text-secondary)',
            },
          },
        },
      }),
    },
  },
  plugins: [],
};
