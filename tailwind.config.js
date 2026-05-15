/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Replace the default palette so generic blue/indigo/violet tokens
    // are not even available — keeps the project visually disciplined.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      bg: '#F4F1EA',
      surface: '#FBF9F4',
      ink: '#1A1A1A',
      muted: '#6B6356',
      rule: '#D9D2C5',
      accent: '#A8412B',
      warn: '#C9962B',
      good: '#4A6B3A',
    },
    fontFamily: {
      serif: ['Fraunces', 'EB Garamond', 'Georgia', 'serif'],
      sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
    },
    extend: {
      borderRadius: {
        // Sharp corners by default; allow a tiny softening when needed.
        none: '0',
        sm: '2px',
      },
      letterSpacing: {
        tightish: '-0.01em',
      },
      backgroundImage: {
        // Graph-paper dot grid, drawn at low opacity over cream.
        'paper-dots':
          'radial-gradient(circle, rgba(26,26,26,0.10) 1px, transparent 1px)',
      },
      backgroundSize: {
        'paper-dots': '22px 22px',
      },
    },
  },
  plugins: [],
}
