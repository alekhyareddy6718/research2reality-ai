/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        purpleBrand: {
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        darkBg: '#0b0f17',
        darkSurface: '#131b2e',
        darkCard: '#1a243b',
        darkBorder: '#263454'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'dark-glass': 'linear-gradient(135deg, rgba(19, 27, 46, 0.7), rgba(26, 36, 59, 0.5))',
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
