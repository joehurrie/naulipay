/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5F00',
          'orange-light': '#FF7A1A',
          'orange-dark': '#CC4A00',
          charcoal: '#1A1D20',
          'charcoal-light': '#2C3036',
          'charcoal-mid': '#3D4349',
          neutral: '#F8F9FA',
          'neutral-dark': '#E9ECEF',
          muted: '#6C757D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulseGlow 3s ease-in-out infinite',
        'ping-slow': 'pingSlowAnim 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'marquee': 'scrollMarquee 28s linear infinite',
        'scanner': 'scannerLine 3s ease-in-out infinite',
        'orbit-spin': 'orbitSpin 10s linear infinite',
        'orbit-spin-rev': 'orbitSpin 15s linear infinite reverse',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        pingSlowAnim: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        scrollMarquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scannerLine: {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        orbitSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #000000 0%, #1A1D20 50%, #000000 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,107,0,0.08) 0%, rgba(255,107,0,0.03) 100%)',
        'orange-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)',
      },
    },
  },
  plugins: [],
}
