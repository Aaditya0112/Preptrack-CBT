import React, { useContext } from 'react';
import { AssessmentContext } from '../context/assessmentContext.jsx';

export default function ActionButtons({ localAnswer, setLocalAnswer, currentQuestion }) {
  const ctx = useContext(AssessmentContext);
  const state = ctx?.state;
  const dispatch = ctx?.dispatch;

  if (!state || !dispatch) return <div className="p-6 border-t bg-white rounded-b-lg">Loading actions...</div>;

  const { currentQuestionIndex, questions, currentSectionId } = state;

  if (!currentQuestion) return <div className="p-6 border-t bg-white rounded-b-lg"></div>;

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const isFirstQuestionInSection = isFirstQuestion || questions[currentQuestionIndex - 1].sectionId !== currentSectionId;

  const handleSaveNext = () => dispatch({ type: 'SAVE_AND_NEXT', payload: { answer: localAnswer } });
  const handlePrevious = () => dispatch({ type: 'GO_TO_PREVIOUS' });
  const handleMarkNext = () => dispatch({ type: 'MARK_AND_NEXT', payload: { answer: localAnswer } });
  const handleClear = () => {
    const clearValue = currentQuestion.type === 'NUMERICAL' ? '' : null;
    setLocalAnswer(clearValue);
    dispatch({ type: 'CLEAR_RESPONSE' });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between border-t bg-white rounded-b-lg">
      <div className="flex flex-wrap gap-2">
        <button onClick={handleMarkNext} className="py-2 m-2 px-4 text-sm cursor-pointer text-gray-500 shadow-md border border-gray-500 rounded-sm">
          {isLastQuestion ? 'Mark for Review' : 'Mark for Review & Next'}
        </button>
        <button onClick={handleClear} className="py-2 m-2 px-4 text-sm cursor-pointer text-gray-500 shadow-md border border-gray-500 rounded-sm">Clear Response</button>
      </div>
      <div>
        {!isFirstQuestionInSection && (
          <button onClick={handlePrevious} className="py-2 m-2 px-4 text-sm cursor-pointer text-white bg-blue-500 shadow-md  rounded-sm">Previous</button>
        )}
        <button onClick={handleSaveNext} className="py-2 m-2 px-4 text-sm cursor-pointer text-white bg-blue-500 shadow-md  rounded-sm">{isLastQuestion ? 'Save' : 'Save & Next'}</button>
      </div>
    </div>
  );
}
