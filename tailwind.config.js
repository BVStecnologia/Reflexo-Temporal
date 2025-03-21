/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#dce6ff',
          200: '#c1d3ff',
          300: '#97b5fe',
          400: '#6b8cfa',
          500: '#4a67f5',
          600: '#3a4ae8',
          700: '#2f3cd2',
          800: '#2a34aa',
          900: '#283285',
          950: '#1a1f4c',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ebe8ff',
          200: '#d9d5ff',
          300: '#bfb3fe',
          400: '#a087fc',
          500: '#8658f7',
          600: '#773eec',
          700: '#682fd7',
          800: '#5728af',
          900: '#48268c',
          950: '#2d1a5c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'waves': "url('/src/assets/wave-bg.svg')",
      },
      animation: {
        'wave': 'wave 10s ease-in-out infinite',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
