/**
 * useDebounce Hook
 * 
 * A custom hook that debounces a value, delaying the update of the returned value
 * until after the specified delay has elapsed since the last time the value changed.
 * 
 * @param {*} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {*} - The debounced value
 */

import { useState, useEffect } from 'react'

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
