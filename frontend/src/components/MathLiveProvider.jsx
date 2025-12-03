import React, { useState, useEffect } from 'react';
import { MathLiveContext } from '../context/assessmentContext';

export default function MathLiveProvider({ children }) {
  // Helper to detect whether the mathlive custom element is registered
  const isMathLiveRegistered = () => {
    try {
      if (typeof customElements !== 'undefined' && customElements.get && customElements.get('math-field')) return true
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') {
      if (window.mathVirtualKeyboard) return true
      if (window.MathfieldElement) return true
      if (window.MathLive) return true
    }
    return false
  }

  const [isMathLiveReady, setIsMathLiveReady] = useState(isMathLiveRegistered())

  useEffect(() => {
    if (isMathLiveReady) return

    // If a mathlive script tag already exists, poll for the custom element registration
    if (document.querySelector('script[src="https://unpkg.com/mathlive"]') || document.querySelector('script[src*="mathlive"]')) {
      const interval = setInterval(() => {
        if (isMathLiveRegistered()) { setIsMathLiveReady(true); clearInterval(interval); }
      }, 100)
      return () => clearInterval(interval)
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/mathlive'
    script.async = true
    script.onload = () => setTimeout(() => { if (isMathLiveRegistered()) setIsMathLiveReady(true) }, 0)
    document.head.appendChild(script)
  }, [isMathLiveReady])

  return (
    <MathLiveContext.Provider value={{ isMathLiveReady }}>
      {children}
    </MathLiveContext.Provider>
  )
}
