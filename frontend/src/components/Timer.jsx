import React, { useContext, useEffect } from 'react';
import { AssessmentContext } from '../context/assessmentContext';

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
}

export default function Timer() {
  const ctx = useContext(AssessmentContext);
  const state = ctx?.state;
  const dispatch = ctx?.dispatch;

  useEffect(() => {
    if (!dispatch) return;
    const timerInterval = setInterval(() => {
      dispatch({ type: 'TICK_TIME' });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [dispatch]);

  if (!state) {
    return (
      <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow-inner">
        <span className="text-gray-600">Loading timer...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow-inner">
      <span className="text-lg font-semibold text-gray-800">Time Left:</span>
      <span className="text-lg font-bold text-red-600 tabular-nums">{formatTime(state.timeLeft)}</span>
    </div>
  );
}
