import React from 'react';
import InfoCard from './InfoCard';

export default function SnapshotCards({ cards }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <InfoCard key={c.title} c={c} />
      ))}
    </div>
  );
}
