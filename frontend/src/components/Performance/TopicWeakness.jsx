import React from 'react';

export default function TopicWeakness() {
  // dummy topics
  let topics = [
    { topicId: 't1', topicName: 'Kinematics', attempts: 12, correct: 4, accuracyPct: 33, avgTime: 45 },
    { topicId: 't2', topicName: 'Integration', attempts: 10, correct: 3, accuracyPct: 30, avgTime: 60 },
    { topicId: 't3', topicName: 'Electrostatics', attempts: 8, correct: 3, accuracyPct: 37, avgTime: 40 },
    { topicId: 't4', topicName: 'Organic Chemistry', attempts: 9, correct: 4, accuracyPct: 44, avgTime: 30 },
    { topicId: 't5', topicName: 'Matrices', attempts: 6, correct: 2, accuracyPct: 33, avgTime: 50 },
  ];
  topics = topics.sort((a, b) => b.accuracyPct - a.accuracyPct);

  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="flex justify-between">
        <div className="font-medium mb-2">Top Weak Topics</div>
        <div className="font-medium mb-2">Accuracy</div>
      </div>
      <ol className="list-decimal list-inside space-y-1 text-sm">
        {topics.map((t) => (
          <li key={t.topicId} className="flex justify-between">
            <div>{t.topicName}</div>
            <div className="text-gray-500">{t.accuracyPct}%</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
