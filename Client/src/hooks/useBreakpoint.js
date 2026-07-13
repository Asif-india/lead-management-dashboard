// /**
//  * useBreakpoint Hook
//  * 
//  * A custom hook that provides responsive breakpoint information.
//  * Returns the current breakpoint and boolean helpers for common screen sizes.
//  * 
//  * @returns {Object} - Breakpoint information and helper booleans
//  */

// import { useState, useEffect } from 'react'
// import { BREAKPOINTS } from '../constants'

// export const useBreakpoint = () => {
//   const [windowSize, setWindowSize] = useState({
//     width: typeof window !== 'undefined' ? window.innerWidth : 0,
//     height: typeof window !== 'undefined' ? window.innerHeight : 0
//   })

//   useEffect(() => {
//     if (typeof window === 'undefined') return

//     const handleResize = () => {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight
//       })
//     }

//     window.addEventListener('resize', handleResize)
//     handleResize() // Call handler right away so state gets updated with initial window size

//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   const width = windowSize.width

//   // Determine current breakpoint
//   const getBreakpoint = () => {
//     if (width >= BREAKPOINTS.XXL) return 'xxl'
//     if (width >= BREAKPOINTS.XL) return 'xl'
//     if (width >= BREAKPOINTS.LG) return 'lg'
//     if (width >= BREAKPOINTS.MD) return 'md'
//     if (width >= BREAKPOINTS.SM) return 'sm'
//     return 'xs'
//   }

//   const breakpoint = getBreakpoint()

//   // Helper booleans
//   const is = {
//     xs: breakpoint === 'xs',
//     sm: breakpoint === 'sm',
//     md: breakpoint === 'md',
//     lg: breakpoint === 'lg',
//     xl: breakpoint === 'xl',
//     xxl: breakpoint === 'xxl',
//     mobile: width < BREAKPOINTS.MD,
//     tablet: width >= BREAKPOINTS.MD && width < BREAKPOINTS.LG,
//     desktop: width >= BREAKPOINTS.LG,
//     large: width >= BREAKPOINTS.XL
//   }

//   // Responsive value helper
//   const responsive = (values) => {
//     if (typeof values === 'string' || typeof values === 'number') {
//       return values
//     }

//     if (Array.isArray(values)) {
//       // Map array values to breakpoints: [xs, sm, md, lg, xl, xxl]
//       const breakpointIndex = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].indexOf(breakpoint)
//       const index = Math.min(breakpointIndex, values.length - 1)
//       return values[index] || values[values.length - 1]
//     }

//     if (typeof values === 'object') {
//       return values[breakpoint] || values.md || values.lg || Object.values(values)[0]
//     }

//     return values
//   }

//   return {
//     width,
//     height,
//     breakpoint,
//     is,
//     responsive
//   }
// }

// export default useBreakpoint


import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '../constants'

export const useBreakpoint = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    // Initial update
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const width = windowSize.width
  const height = windowSize.height

  // Determine current breakpoint
  const getBreakpoint = () => {
    if (width >= BREAKPOINTS.XXL) return 'xxl'
    if (width >= BREAKPOINTS.XL) return 'xl'
    if (width >= BREAKPOINTS.LG) return 'lg'
    if (width >= BREAKPOINTS.MD) return 'md'
    if (width >= BREAKPOINTS.SM) return 'sm'
    return 'xs'
  }

  const breakpoint = getBreakpoint()

  // Helper booleans
  const is = {
    xs: breakpoint === 'xs',
    sm: breakpoint === 'sm',
    md: breakpoint === 'md',
    lg: breakpoint === 'lg',
    xl: breakpoint === 'xl',
    xxl: breakpoint === 'xxl',
    mobile: width < BREAKPOINTS.MD,
    tablet: width >= BREAKPOINTS.MD && width < BREAKPOINTS.LG,
    desktop: width >= BREAKPOINTS.LG,
    large: width >= BREAKPOINTS.XL,
  }

  // Responsive helper
  const responsive = (values) => {
    if (
      typeof values === 'string' ||
      typeof values === 'number'
    ) {
      return values
    }

    if (Array.isArray(values)) {
      const breakpointIndex = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].indexOf(breakpoint)

      const index = Math.min(
        breakpointIndex,
        values.length - 1
      )

      return values[index] || values[values.length - 1]
    }

    if (typeof values === 'object' && values !== null) {
      return (
        values[breakpoint] ||
        values.md ||
        values.lg ||
        Object.values(values)[0]
      )
    }

    return values
  }

  return {
    width,
    height,
    breakpoint,
    is,
    responsive,
  }
}

export default useBreakpoint