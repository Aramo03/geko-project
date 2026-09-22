/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB606',
        secondary: '#2a4856',
        pseudo: '#ffffff',
        primaryDark: '#333333',
        primaryLight: '#f0f4fa',
        secondaryLight: '#8f908f',
        lightGreen: '#82d16f',
        lightBlue: '#4489f3',
        lightRed: '#dd4b39',
        color60: '#606060',
        color7C: '#7C7C7C',
        color85: '#858585',
        color86: '#868686',
        color66: '#666666',
        color99: '#999999',
        black: '#111111',
      },
      fontFamily: {
        sans: ['"Roboto"'],
        'sans-serif': ['sans-serif'],
        'roboto-slab': ['Roboto Slab'],
        'roboto-slab-sans': ['Roboto Slab', 'sans-serif'],
      },
      fontWeight: {
        'medium': 500,
        'bold': 700,
        'black': 900,
      },
      fontSize: {
        'xs': '0.75rem',  // Minimal 12.0px
        'sm': '0.875rem', // Small 14.0px
        'base': '1rem',    // Base font size 16.0px (default)
        'lg': '1.125rem',  // Large 18.0px
        'xl': '1.25rem',   // Extra large 20.0px
        '2xl': '1.5rem',   // 2x large 24.0px
        '3xl': '1.875rem', // 3x large 30.0px
        '4xl': '2.25rem',  // 4x large 36.0px
        '5xl': '3rem',     // 5x large 48.0px
        'custom-15': '0.9375rem',  // Custom 15px
        'custom-28': '1.75rem',   // Custom 28px
        'custom-80': '5rem',   // Custom 28px
      },
      zIndex: {
        '60': '60', // добавляем кастомный z-index
      },
    },
    screens: {
      max: '360px',
      sm500: '500px',
      sm: '640px',
      middle: '768px',
      mid: '780px',
      max920: { 'min': '400px', 'max': '920px' },
      md: '992px',
      mdLg: { 'min': '993px', 'max': '1279px' },
      center: '1200px',
      lg: '1280px',
      big: '1370px',
      xl: '1920px',
    },
  },
  plugins: [],
}

