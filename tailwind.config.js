/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        foreground: '#e6edf3',
        border: '#30363d',
        primary: {
          50: '#f0f6ff',
          100: '#c9d1d9',
          200: '#b1bac4',
          300: '#8b949e',
          400: '#6e7681',
          500: '#484f58',
          600: '#30363d',
          700: '#21262d',
          800: '#161b22',
          900: '#0d1117',
        },
        accent: {
          50: '#ddf4ff',
          100: '#b6e3ff',
          200: '#80ccff',
          300: '#54aeff',
          400: '#218bff',
          500: '#0969da',
          600: '#0550ae',
          700: '#033a86',
          800: '#0a3069',
          900: '#002155',
        },
        success: '#238636',
        warning: '#d29922',
        danger: '#f85149',
        terminal: {
          bg: '#0d1117',
          text: '#c9d1d9',
          prompt: '#7ee787',
          path: '#79c0ff',
          error: '#f85149',
          success: '#7ee787'
        }
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'monospace', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"'],
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'confetti': 'confetti 5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}