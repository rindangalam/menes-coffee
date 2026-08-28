/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from logo (blue) - single accent color per design-taste-frontend
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Warm neutrals for coffee shop feel (not terracotta/orange)
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Muted sage for success/available states
        sage: {
          50: '#f6f7f6',
          100: '#ecefec',
          200: '#d9dfda',
          300: '#bccfc5',
          400: '#9abfa0',
          500: '#79a07b',
          600: '#618262',
          700: '#4e664e',
          800: '#405340',
          900: '#364236',
          950: '#1e241e',
        },
        // Ink for text (off-black, not pure black)
        ink: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Paper for backgrounds (off-white)
        paper: {
          50: '#fdfdfd',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#eaeaea',
          400: '#dcdcdc',
          500: '#cacaca',
        },
        // Accent gold for featured/popular (subtle)
        accent: {
          gold: '#c9a962',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        'token-sm': '4px',
        'token-md': '8px',
        'token-lg': '12px',
        'token-full': '9999px',
      },
      spacing: {
        'token-xs': '4px',
        'token-sm': '8px',
        'token-md': '16px',
        'token-lg': '24px',
        'token-xl': '32px',
        'token-2xl': '48px',
        'token-3xl': '64px',
        'token-4xl': '96px',
      },
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1440px',
      },
      transitionDuration: {
        'token-fast': '150ms',
        'token-base': '200ms',
        'token-slow': '300ms',
      },
      boxShadow: {
        'token-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'token-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'token-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'token-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}