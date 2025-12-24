import React, { useContext, useEffect, useState } from 'react';
import { AssessmentContext } from '../context/assessmentContext';
import Timer from './Timer';
import SectionTabs from './SectionTabs';
import QuestionDisplay from './QuestionDisplay';
import ActionButtons from './ActionButtons';

export default function LeftSection() {
  // Hooks must be called in the same order on every render.
  const ctx = useContext(AssessmentContext);
  const [localAnswer, setLocalAnswer] = useState(null);

  // State may be null while reducer initializes; safely read values with defaults.
  const state = ctx?.state;
  const { questions = [], currentQuestionIndex = 0, answers = {} } = state || {};
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Only update localAnswer when currentQuestion is available
    if (!currentQuestion || !answers) return;
    const newAnswerState = answers[currentQuestion.questionId];
    if (newAnswerState) {
      setLocalAnswer(newAnswerState.answer || (currentQuestion.questionType === 'NUM' ? '' : null));
    } else {
      setLocalAnswer(currentQuestion.questionType === 'NUM' ? '' : null);
    }
  }, [currentQuestionIndex, answers, questions, currentQuestion]);

  if (!state) {
    return (
      <div className="lg:col-span-2 bg-gray-100 h-full flex items-center justify-center">
        <div className="text-gray-600">Loading assessment...</div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-gray-100 h-full  flex flex-col relative">
      <div className="shrink-0">
        <div className="flex justify-end mb-4">
          <Timer />
        </div>
        {state.sections.length > 0 && <SectionTabs />}
      </div>
      <div className='flex justify-end items-center p-1 text-sm bg-blue-400'>
        <div className="flex items-center space-x-2">
          <span className="text-white">View in:</span>
          <select className="border bg-white border-gray-300  p-1">
            <option>English</option>
          </select>
        </div>
      </div>
      <div className="grow flex flex-col overflow-hidden rounded-lg shadow-lg">
        <div className="bg-white grow flex flex-col overflow-hidden">
          <QuestionDisplay localAnswer={localAnswer} setLocalAnswer={setLocalAnswer} />
          <div className="shrink-0">
            <ActionButtons localAnswer={localAnswer} setLocalAnswer={setLocalAnswer} currentQuestion={currentQuestion} />
          </div>
        </div>
      </div>
    </div>
  );
}
