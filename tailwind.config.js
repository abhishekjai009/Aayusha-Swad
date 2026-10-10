/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDF0C6',
          300: '#FCE49B',
          400: '#FAD46B',
          500: '#F59E0B', // Primary Warm Yellow / Amber
          600: '#D97706', // Golden Amber
          700: '#B45309', // Dark Golden
          800: '#92400E',
          900: '#78350F',
        },
        accent: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C', // Light Orange
          500: '#F97316', // Vibrant Orange
          600: '#EA580C', // Deep Orange accent
          700: '#C2410C',
        },
        warm: {
          light: '#FAFAF7',
          cream: '#FFFBF2',
          card: '#FFFFFF',
          border: '#F3EDE2',
          muted: '#78716C',
          dark: '#292524',
        }
      },
      fontFamily: {
        serif: ['Outfit', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(245, 158, 11, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 30px -5px rgba(217, 119, 6, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'elevated': '0 20px 40px -10px rgba(180, 83, 9, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
