import React, { useReducer, useEffect } from 'react';
import { AssessmentContext, QUESTION_STATUS } from '../context/assessmentContext';
import assessmentReducer from '../utils/assessmentReducer';
import Header from '../components/Header';
import LeftSection from '../components/LeftSection';
import RightSection from '../components/RightSection';
import SummaryPage from '../components/SummaryPage';
import AlertModal from '../components/AlertModal';

// Default initialState is defined inside the reducer util

export default function AssessmentPage({ user, exam }) {
  const [state, dispatch] = useReducer(assessmentReducer, null);

  useEffect(() => {
    if (exam) {
      dispatch({ type: 'INITIALIZE_EXAM', payload: { questions: exam.questions, sections: exam.sections, durationInSeconds: exam.durationInSeconds, examTitle: exam.examTitle } });
    }
  }, [exam]);

  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      <div className="h-screen w-screen flex flex-col font-sans">
        <Header examTitle={state?.examTitle || ''} />
        <main className="grow grid grid-cols-1 lg:grid-cols-4 h-full pt-16 ">
          <div className="lg:col-span-3 h-[calc(100vh-64px)] ">
            <LeftSection />
          </div>
          <div className=" lg:col-span-1 h-[calc(100vh-64px)]">
            <RightSection user={user} />
          </div>
        </main>
        {state?.showSummary && <SummaryPage />}
        {state?.showValidationError && <AlertModal message="You must answer at least one question before submitting." onClose={() => dispatch({ type: 'HIDE_VALIDATION_ERROR' })} />}
      </div>
    </AssessmentContext.Provider>
  );
}
