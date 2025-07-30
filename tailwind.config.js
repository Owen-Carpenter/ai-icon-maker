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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        // Primary orange-coral palette (from image)
        'sunset': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // Base orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        
        // Rich coral palette
        'coral': {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E', // Base coral
          600: '#E11D48',
          700: '#BE185D',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },
        
        // Deep black-based palette (updated to be more black)
        'midnight': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937', // Dark gray-black
          900: '#111827', // Very dark black
          950: '#0A0A0A', // Almost pure black
        },
        
        // Vibrant purple palette
        'amethyst': {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7', // Base purple
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764',
        },
        
        // Gradient stop colors (updated for more black tones)
        'gradient': {
          'orange-start': '#FF8A65',
          'orange-mid': '#FF7043',
          'orange-end': '#FF5722',
          'purple-start': '#CE93D8',
          'purple-mid': '#AB47BC',
          'purple-end': '#8E24AA',
          'dark-start': '#1F2937', // More black-based
          'dark-mid': '#111827',   // Very dark
          'dark-end': '#0A0A0A',   // Almost black
        }
      },
      
      // Custom gradient configurations with more black tones
      backgroundImage: {
        'sunset-gradient': 'linear-gradient(135deg, #FF8A65 0%, #FF7043 50%, #8E24AA 100%)',
        'coral-gradient': 'linear-gradient(135deg, #FB7185 0%, #F43F5E 50%, #AB47BC 100%)',
        'midnight-gradient': 'linear-gradient(135deg, #1F2937 0%, #111827 50%, #0A0A0A 100%)',
        'aurora-gradient': 'linear-gradient(135deg, #FF8A65 0%, #CE93D8 50%, #8E24AA 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 138, 101, 0.1) 0%, rgba(171, 71, 188, 0.1) 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1F2937 0%, #111827 70%, #0A0A0A 100%)',
      },
      
      // Custom animations for scroll effects
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'fade-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'border': {
          'to': { '--border-angle': '360deg' }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-20px)'
          }
        }
      },
      
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.8s ease-out forwards',
        'border': 'border 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} 