import React from 'react';
import MathLiveProvider from './components/MathLiveProvider';
import AssessmentPage from './pages/Assessment';
import { USER_DATA, EXAM_DATA } from './data/examData';

export default function App() {
  return (
    <MathLiveProvider>
      <div className="bg-gray-200">
        <AssessmentPage user={USER_DATA} exam={EXAM_DATA} />
      </div>
    </MathLiveProvider>
  );
}






