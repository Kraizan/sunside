module.exports = {
  theme: {
    extend: {
      animation: {
        fade: 'fade 0.5s ease-in-out',
        fly: 'fly 3s ease-in-out infinite',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fly: {
          '0%, 100%': { 
            transform: 'translateX(-200%) translateY(0) rotate(-45deg)',
          },
          '50%': { 
            transform: 'translateX(200%) translateY(0) rotate(-45deg)',
          },
        },
      },
    },
  },
  variants: {},
  plugins: [],
}
