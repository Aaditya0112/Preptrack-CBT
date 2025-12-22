import React, { useContext } from 'react';
import { AssessmentContext } from '../context/assessmentContext';
import QuestionRenderer from './QuestionRenderer';
import MCQOptions from './MCQOptions';
import Numpad from './Numpad';

export default function QuestionDisplay({ localAnswer, setLocalAnswer }) {
  const ctx = useContext(AssessmentContext);
  const state = ctx?.state;
  if (!state || !state.questions) return <div className="grow p-6 overflow-y-auto">Loading question...</div>;

  const { questions, currentQuestionIndex, answers } = state;
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return <div className="grow p-6 overflow-y-auto">No question available</div>;

  const questionNumber = currentQuestionIndex + 1;

  return (
    <div className="grow p-4 overflow-y-auto relative text-sm">
      <div className="flex justify-between items-center mb-2 pb-2 border-b">
        <h3 className=" font-bold text-gray-800">Question No. {questionNumber}</h3>
      </div>

      <div className="space-y-4 text-sm">
        <QuestionRenderer text={currentQuestion.questionText} />
        {currentQuestion.image && (
          <div className="my-4 flex justify-center">
            <img src={currentQuestion.image} alt="Question illustration" className="max-w-full h-auto rounded-lg shadow-md" onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/400x200?text=Image+Not+Found'}} />
          </div>
        )}
      </div>

      {currentQuestion.questionType === 'MCQ' && (
        <MCQOptions options={currentQuestion.options} selected={localAnswer} onChange={setLocalAnswer} />
      )}
      {currentQuestion.questionType === 'NUM' && (
        <Numpad value={localAnswer || ''} onChange={setLocalAnswer} />
      )}
    </div>
  );
}
