import React, { useState, useRef, useEffect } from 'react';

export default function InfoCard({ c }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function handleDocClick(e) {
      if (!tooltipRef.current) return;
      if (tooltipRef.current.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setShowTooltip(false);
    }
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  return (
    <div className="relative bg-white p-3 rounded shadow">
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">{c.title}</div>
        {c.requiresInfo && (
          <button
            ref={btnRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip((s) => !s);
            }}
            className="ml-2 text-xs text-gray-500 font-bold hover:text-gray-600 border-2 rounded-full w-6 h-6 flex items-center justify-center"
          >
            i
          </button>
        )}
      </div>
      <div className="font-semibold text-lg mt-1">{c.value}</div>

      {c.requiresInfo && showTooltip && (
        <div ref={tooltipRef} className="absolute left-0.5 z-20 right-3 w-64 bg-white border rounded shadow p-3 text-sm">
          <div className="font-semibold mb-1">{c.title}</div>
          <div className="text-gray-600">{c.Info}</div>
        </div>
      )}
    </div>
  );
}
