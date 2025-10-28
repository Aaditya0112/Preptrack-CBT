import React, { useContext } from 'react';
import { AssessmentContext } from '../context/assessmentContext';

export default function SubmitButton() {
  const ctx = useContext(AssessmentContext);
  const state = ctx?.state;
  const dispatch = ctx?.dispatch;

  const handleSubmitClick = () => {
    if (!state || !dispatch) return;
    const isAnyAnswered = Object.values(state.answers).some(
      q => q.status === 'ANSWERED' || q.status === 'ANSWERED_AND_MARKED'
    );
    if (!isAnyAnswered) {
      dispatch({ type: 'SHOW_VALIDATION_ERROR' });
      return;
    }
    dispatch({ type: 'TOGGLE_SUMMARY' });
  };

  return (
    <div className="bg-sky-100 mt-3 flex items-center justify-center">
  <button onClick={handleSubmitClick} className="py-2 m-2 px-4 text-sm bg-blue-500 cursor-pointer text-white shadow-md  rounded-sm  hover:bg-blue-700 transition-colors">SUBMIT</button>
    </div>
  );
}
