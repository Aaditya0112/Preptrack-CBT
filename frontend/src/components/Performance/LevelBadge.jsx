import React, { useState, useRef, useEffect } from 'react';

function LevelInfoRow({ title, subtitle, bullets, colorGradient }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-gray-500 mb-2">{subtitle}</div>
        <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
      <div
        style={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: colorGradient,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          ★
        </div>
      </div>
    </div>
  );
}

export default function LevelBadge({ avg = 73 }) {
  let level = 'BEGINNER';
  if (avg >= 85) level = 'MASTER';
  else if (avg >= 70) level = 'ADVANCED';

  const gradients = {
    BEGINNER: 'linear-gradient(90deg,#FFD54A,#FFC107,#FFB300)',
    MASTER: 'linear-gradient(90deg,#56F09C,#22C55E,#16A34A)',
    ADVANCED: 'linear-gradient(90deg,#B91C1C,#EF4444,#FB7185)',
  };

  const style = {
    backgroundImage: gradients[level],
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    fontWeight: 800,
    letterSpacing: '0.6px',
    display: 'inline-block',
  };

  const shineStyle = {
    position: 'absolute',
    left: '-40%',
    top: 0,
    height: '100%',
    width: '40%',
    transform: 'skewX(-20deg)',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.7), rgba(255,255,255,0.0))',
    animation: 'shine 2.2s linear infinite',
  };

  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef(null);
  const infoBtnRef = useRef(null);

  useEffect(() => {
    function handleDocClick(e) {
      if (!infoRef.current) return;
      if (infoRef.current.contains(e.target) || infoBtnRef.current?.contains(e.target)) return;
      setShowInfo(false);
    }
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  return (
    <div className="bg-white p-3 rounded shadow flex items-center justify-between relative">
      <div>
        <div className="flex items-center gap-3">
          <div style={{ fontSize: 14, color: '#6b7280' }}>Learning Level</div>
          <button
            ref={infoBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo((s) => !s);
            }}
            className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold"
          >
            i
          </button>
        </div>

        <div style={{ fontSize: 22, marginTop: 4 }}>
          <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', lineHeight: 1 }}>
            <span style={style}>{level}</span>
            <span style={shineStyle} aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <div className="mb-1 font-medium">Achievement</div>
        <div className="text-xs text-gray-500">Keep practicing to reach the next tier</div>
      </div>

      {showInfo && (
        <>
          <div className=" bg-black opacity-80 fixed inset-0 z-30" onClick={() => setShowInfo(false)} aria-hidden="true" />
          <div ref={infoRef} className="absolute z-40 right-0 top-full mt-3" style={{ minWidth: 320 }}>
            <div className="rounded-lg shadow-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ padding: 12 }} className="bg-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">Level Information</div>
                    <div className="text-xs text-gray-500">Eligibility & rewards</div>
                  </div>
                  <button onClick={() => setShowInfo(false)} className="text-sm text-gray-500 font-bold">✕</button>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="space-y-4">
                  <LevelInfoRow title="BEGINNER" subtitle="Entry level for new learners." bullets={["Average score below 70%"]} colorGradient="linear-gradient(90deg,#FFD54A,#FFC107,#FFB300)" />
                  <LevelInfoRow title="ADVANCED" subtitle="For high-performing learners." bullets={["Average score 70% - 84%"]} colorGradient="linear-gradient(90deg,#B91C1C,#EF4444,#FB7185)" />
                  <LevelInfoRow title="MASTER" subtitle="Top-tier mastery level." bullets={["Average score 85% and above"]} colorGradient="linear-gradient(90deg,#56F09C,#22C55E,#16A34A)" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes shine {0%{left:-40%}50%{left:120%}100%{left:120%}}`}</style>
    </div>
  );
}
