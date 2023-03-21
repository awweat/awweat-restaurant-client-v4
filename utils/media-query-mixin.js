const mixin = {
  data() {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isWidescreen: false,
      // bootstrap breakpoints
      breakpoints: {
        mobile: 576,
        tablet: 768,
        desktop: 992,
        widescreen: 1200,
      },
    }
  },
  created() {
    // set the initial state of the media query mixin
    this.listeners()
  },
  mounted() {
    // listen screen resize
    window.addEventListener('resize', this.listeners)
  },
  beforeDestroy() {
    // remove listener
    window.removeEventListener('resize', this.listeners)
  },
  methods: {
    match(query) {
      if (!window) return false
      return window.matchMedia(query).matches
    },
    listeners() {
      this.isMobile = this.match(
        `(max-width: ${this.breakpoints.mobile}px) and (max-width: 767.98px)`
      )
      this.isTablet = this.match(
        `(min-width: ${this.breakpoints.tablet}px) and (max-width: 991.98px)`
      )
      this.isDesktop = this.match(
        `(min-width: ${this.breakpoints.desktop}px) and (max-width: 1199.98px)`
      )
      this.isWidescreen = this.match(
        `(min-width: ${this.breakpoints.widescreen}px)`
      )
    },
    isGreater(breakpoint) {
      return window.innerWidth > this.breakpoints[breakpoint]
    },
    isSmaller(breakpoint) {
      return !this.isGreater(breakpoint)
    },
    isBetween(breakpoint1, breakpoint2) {
      return this.isGreater(breakpoint1) && this.isSmaller(breakpoint2)
    },
  },
}

export default mixin
