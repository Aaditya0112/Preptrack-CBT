import React, { useState, useEffect } from 'react';
import { MathLiveContext } from '../context/assessmentContext';

export default function MathLiveProvider({ children }) {
  const [isMathLiveReady, setIsMathLiveReady] = useState(!!window.mathVirtualKeyboard);

  useEffect(() => {
    if (isMathLiveReady) return;
    if (document.querySelector('script[src="https://unpkg.com/mathlive"]')) {
      const interval = setInterval(() => {
        if (window.mathVirtualKeyboard) { setIsMathLiveReady(true); clearInterval(interval); }
      }, 100);
      return () => clearInterval(interval);
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/mathlive';
    script.async = true;
    script.onload = () => setTimeout(() => setIsMathLiveReady(true), 0);
    document.head.appendChild(script);
  }, [isMathLiveReady]);

  return (
    <MathLiveContext.Provider value={{ isMathLiveReady }}>
      {children}
    </MathLiveContext.Provider>
  );
}
