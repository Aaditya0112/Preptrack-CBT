import React, { useContext, useEffect, useRef } from 'react';
import { MathLiveContext } from '../context/assessmentContext';

export default function MathField({ latex }) {
  const mathFieldRef = useRef(null);
  const { isMathLiveReady } = useContext(MathLiveContext);

  useEffect(() => {
    if (isMathLiveReady && mathFieldRef.current && typeof mathFieldRef.current.setValue === 'function') {
      mathFieldRef.current.setValue(latex, { suppressChangeNotifications: true });
    }
  }, [latex, isMathLiveReady]);

  return (
    <math-field ref={mathFieldRef} read-only key={`${latex}-${isMathLiveReady}`}>
      {latex}
    </math-field>
  );
}
