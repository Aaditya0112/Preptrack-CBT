import React from 'react';

export default function Recommendations() {
  const recs = [
    'Revise Integration techniques — 30 min',
    'Practice 20 Mechanics MCQs — 45 min',
    'Attempt medium-level Algebra set — 30 min',
  ];
  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="font-medium mb-2">Suggested Next Steps</div>
      <ol className="list-decimal list-inside text-sm space-y-2">
        {recs.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ol>
    </div>
  );
}
