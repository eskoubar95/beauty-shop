const path = require("path")

module.exports = {
  darkMode: ["class", "class"],
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		boxShadow: {
  			'hero': '0_28px_70px_rgba(5,21,55,0.18)',
  			'product-card': '0_22px_60px_rgba(5,21,55,0.08)',
  			'card': '0_15px_30px_-12px_rgba(0,0,0,0.1),0_4px_12px_-8px_rgba(0,0,0,0.1)',
  			'menu': '0_20px_60px_rgba(5,21,55,0.18)',
  			'dropdown': '0_24px_60px_rgba(5,21,55,0.1)',
  		},
  		transitionProperty: {
  			width: 'width margin',
  			height: 'height',
  			bg: 'background-color',
  			display: 'display opacity',
  			visibility: 'visibility',
  			padding: 'padding-top padding-right padding-bottom padding-left'
  		},
  		colors: {
  			// Grey scale (beholdt for backward compatibility)
  			grey: {
  				'0': '#FFFFFF',
  				'5': '#F9FAFB',
  				'10': '#F3F4F6',
  				'20': '#E5E7EB',
  				'30': '#D1D5DB',
  				'40': '#9CA3AF',
  				'50': '#6B7280',
  				'60': '#4B5563',
  				'70': '#374151',
  				'80': '#1F2937',
  				'90': '#111827'
  			},
  			// Primary colors (Navy) - Godkendt palette
  			primary: {
  				DEFAULT: '#051537',
  				dark: '#08152D',
  				darker: '#08152D',
  				light: '#0B2142',
  				darkest: '#030D1F'
  			},
  			// Accent color - Godkendt: #f1433a
  			accent: {
  				DEFAULT: '#f1433a',
  				dark: '#d12e25',
  				light: '#ff5c52'
  			},
  			// Gray scale (beholdt for backward compatibility)
  			gray: {
  				light: '#F2F2F2',
  				medium: '#CCCCCC',
  				dark: '#A5A5A5'
  			},
  			// Background colors - Godkendt palette med nuancer
  			background: {
  				DEFAULT: '#eef1f2',
  				light: '#f5f7f8',
  				lighter: '#fafbfc',
  				white: '#ffffff',
  				dark: '#e3e6e8',
  				darker: '#d8dce0'
  			},
  			// Border colors - Nuancer baseret på background
  			border: {
  				DEFAULT: '#d8dce0',
  				light: '#e3e6e8',
  				lighter: '#e8ebed',
  				dark: '#c8cdd2',
  				accent: '#f1433a',
  				primary: '#051537'
  			},
  			// Text colors
  			text: {
  				primary: '#051537',
  				secondary: '#051537',
  				tertiary: '#051537',
  				muted: '#051537',
  				accent: '#f1433a',
  				white: '#ffffff',
  				inverse: '#eef1f2'
  			},
  			// Image placeholder colors
  			image: {
  				placeholder: '#e3e6e8',
  				border: '#d8dce0'
  			}
  		},
  		borderRadius: {
  			none: '0px',
  			soft: '2px',
  			base: '4px',
  			rounded: '8px',
  			large: '16px',
  			circle: '9999px'
  		},
  		maxWidth: {
  			'8xl': '100rem'
  		},
  		screens: {
  			'2xsmall': '320px',
  			xsmall: '512px',
  			small: '1024px',
  			medium: '1280px',
  			large: '1440px',
  			xlarge: '1680px',
  			'2xlarge': '1920px'
  		},
		fontSize: {
			'3xl': '2rem',
			// H1 (Hero, Main headings) - 1.2x modular scale
			'heading-1-mobile': ['30px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
			'heading-1-tablet': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
			'heading-1-desktop': ['44px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
			// H2 (Section headings) - Standard section headings
			'heading-2-mobile': ['32px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
			'heading-2-tablet': ['40px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
			'heading-2-desktop': ['48px', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
			// H2 CTA (Call to action headings) - Mindre end section headings
			'heading-2-cta-mobile': ['28px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
			'heading-2-cta-tablet': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
			'heading-2-cta-desktop': ['36px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
			// H3 (Card titles, Product titles) - Konsolideret, justeret for bedre separation fra H2
			'heading-3-mobile': ['20px', { lineHeight: '1.2' }],
			'heading-3-tablet': ['24px', { lineHeight: '1.2' }],
			'heading-3-desktop': ['28px', { lineHeight: '1.2' }],
			// Price - Matcher H3 størrelse for konsistens
			'price-mobile': ['24px', { lineHeight: '1', letterSpacing: '-0.01em' }],
			'price-tablet': ['28px', { lineHeight: '1', letterSpacing: '-0.01em' }],
			'price-desktop': ['32px', { lineHeight: '1', letterSpacing: '-0.01em' }],
			// Body large - Justeret for klarere forskel fra standard body
			'body-large': ['18px', { lineHeight: '1.6' }],
			// UI elements - Justeret for bedre læsbarhed og WCAG compliance
			'button-lg': ['16px', { lineHeight: '1.5' }],
			'badge': ['12px', { lineHeight: '1' }],
			// Backward compatibility aliases (deprecated - brug heading-* tokens)
			'hero-mobile': ['30px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
			'hero-tablet': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
			'hero-desktop': ['44px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
			'section-mobile': ['32px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
			'section-tablet': ['40px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
			'section-desktop': ['48px', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
			'cta-mobile': ['28px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
			'cta-tablet': ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
			'cta-desktop': ['36px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
			'card-title-mobile': ['20px', { lineHeight: '1.2' }],
			'card-title-tablet': ['24px', { lineHeight: '1.2' }],
			'product-title-mobile': ['20px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
			'product-title-tablet': ['24px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Ubuntu',
  				'sans-serif'
  			],
  			mono: [
  				'IBM Plex Mono',
  				'monospace'
  			]
  		},
  		keyframes: {
  			ring: {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			},
  			'fade-in-right': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			'fade-in-top': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-out-top': {
  				'0%': {
  					height: '100%'
  				},
  				'99%': {
  					height: '0'
  				},
  				'100%': {
  					visibility: 'hidden'
  				}
  			},
  			'accordion-slide-up': {
  				'0%': {
  					height: 'var(--radix-accordion-content-height)',
  					opacity: '1'
  				},
  				'100%': {
  					height: '0',
  					opacity: '0'
  				}
  			},
  			'accordion-slide-down': {
  				'0%': {
  					'min-height': '0',
  					'max-height': '0',
  					opacity: '0'
  				},
  				'100%': {
  					'min-height': 'var(--radix-accordion-content-height)',
  					'max-height': 'none',
  					opacity: '1'
  				}
  			},
  			enter: {
  				'0%': {
  					transform: 'scale(0.9)',
  					opacity: 0
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: 1
  				}
  			},
  			leave: {
  				'0%': {
  					transform: 'scale(1)',
  					opacity: 1
  				},
  				'100%': {
  					transform: 'scale(0.9)',
  					opacity: 0
  				}
  			},
  			'slide-in': {
  				'0%': {
  					transform: 'translateY(-100%)'
  				},
  				'100%': {
  					transform: 'translateY(0)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			ring: 'ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
  			'fade-in-right': 'fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards',
  			'fade-in-top': 'fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
  			'fade-out-top': 'fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
  			'accordion-open': 'accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards',
  			'accordion-close': 'accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards',
  			enter: 'enter 200ms ease-out',
  			'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
  			leave: 'leave 150ms ease-in forwards',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-radix")()],
}
