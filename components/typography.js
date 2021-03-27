import Typography from 'typography'

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.55,
  headerFontFamily: ['Inter Light', 'sans-serif'],
  bodyFontFamily: ['Inter Regular', 'sans-serif'],
  headerColor: 'hsla(0,0%,0%,0.9)',
  bodyColor: 'hsl(0,0%,0%,0.8)',
  overrideStyles: ({rhythm}, options) => {
    return {
      h1: {
        fontFamily: 'Inter Light',
        color: 'hsla(0,0%,0%,0.75)',
      },
      h2: {
        color: 'hsla(0,0%,0%,0.775)',
        fontFamily: 'Inter Semibold',
      },
      'h1,h2,h3': {
        letterSpacing: '-0.04rem',
      },
      'h1,h2,h3,h4': {
        marginTop: rhythm(1),
        marginBottom: rhythm(1 / 2),
      },
    }
  },
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
