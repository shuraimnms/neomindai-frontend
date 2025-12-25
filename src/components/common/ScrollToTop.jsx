import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Fast, smooth scroll-to-top using requestAnimationFrame
const smoothScrollToTop = (duration = 150) => {
  const start = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
  if (start <= 0) return
  const startTime = performance.now()

  const step = (now) => {
    const elapsed = now - startTime
    const t = Math.min(1, elapsed / duration)
    // ease-out quad
    const ease = 1 - (1 - t) * (1 - t)
    const current = Math.round(start * (1 - ease))
    window.scrollTo(0, current)
    if (t < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

const ScrollToTop = ({ fastDuration = 150 }) => {
  const { pathname } = useLocation()
  const lastPathRef = useRef(pathname)

  useEffect(() => {
    // Only run when path actually changes
    if (lastPathRef.current !== pathname) {
      // use a very short smooth animation so page appears from top quickly
      smoothScrollToTop(fastDuration)
      lastPathRef.current = pathname
    }
  }, [pathname, fastDuration])

  return null
}

export default ScrollToTop
