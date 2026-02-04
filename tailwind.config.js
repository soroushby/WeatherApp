/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom color palette for WeatherNow
      colors: {
        // Primary purple theme
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Dark backgrounds
        dark: {
          900: '#0a0a0f',
          800: '#131318',
          700: '#1a1a22',
          600: '#22222d',
          500: '#2a2a38',
        },
        // Weather condition accent colors
        weather: {
          sunny: '#f59e0b',
          sunnyLight: '#fbbf24',
          rainy: '#3b82f6',
          rainyLight: '#60a5fa',
          cloudy: '#6b7280',
          cloudyLight: '#9ca3af',
          snowy: '#60a5fa',
          snowyLight: '#93c5fd',
          stormy: '#8b5cf6',
          stormyLight: '#a78bfa',
        },
        // Air quality index colors
        aqi: {
          good: '#22c55e',
          moderate: '#eab308',
          unhealthy: '#f97316',
          veryUnhealthy: '#ef4444',
          hazardous: '#7c2d12',
        },
      },
      // Custom font family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Custom shadows with glow effects
      boxShadow: {
        'glow-sm': '0 0 10px rgba(139, 92, 246, 0.3)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.5)',
        'glow-sunny': '0 0 20px rgba(245, 158, 11, 0.4)',
        'glow-rainy': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-snowy': '0 0 20px rgba(96, 165, 250, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      // Animation keyframes
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'weather-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(2deg)' },
          '75%': { transform: 'translateY(-3px) rotate(-2deg)' },
        },
      },
      // Animation utilities
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'weather-float': 'weather-float 4s ease-in-out infinite',
      },
      // Custom border radius
      borderRadius: {
        '4xl': '2rem',
      },
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
