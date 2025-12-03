import React, { useReducer, useEffect, useRef, useState } from 'react';
import { AssessmentContext, QUESTION_STATUS } from '../context/assessmentContext';
import assessmentReducer from '../utils/assessmentReducer';
import Header from '../components/Header';
import LeftSection from '../components/LeftSection';
import RightSection from '../components/RightSection';
import SummaryPage from '../components/SummaryPage';
import AlertModal from '../components/AlertModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useLocation, useNavigate } from 'react-router-dom';
import EXAMS from '../data/examsList';

// Default initialState is defined inside the reducer util

export default function AssessmentPage({ user, exam, onExit }) {
  const [state, dispatch] = useReducer(assessmentReducer, null);
  // ref to track last active timestamp for per-question timing
  const lastActiveRef = useRef(Date.now());
  const location = useLocation();
  const navigate = useNavigate();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // derive exam selection: prefer prop, then location.state.exam (object), then location.state.examId or query param
  const examObjFromState = location?.state?.exam;
  const examIdFromState = location?.state?.examId;
  const searchParams = new URLSearchParams(location.search);
  const examIdFromQuery = searchParams.get('examId');
  const examId = examIdFromState || examIdFromQuery;
  const selectedExam = exam || examObjFromState || EXAMS.find((e) => e.id === examId)?.exam;

  useEffect(() => {
    if (!selectedExam) {
      // nothing to run — redirect back to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [selectedExam, navigate]);

  // wrapped dispatch to collect elapsed time for current question before navigation-like actions
  async function wrappedDispatch(action) {
    const navActions = new Set(['GO_TO_QUESTION', 'SAVE_AND_NEXT', 'GO_TO_PREVIOUS', 'MARK_AND_NEXT', 'TOGGLE_SUMMARY']);
    const now = Date.now();
    const delta = Math.round((now - (lastActiveRef.current || now)) / 1000);

    // record per-question elapsed time before navigation or submit
    if (state?.questions?.length && (navActions.has(action.type) || action.type === 'FINAL_SUBMIT')) {
      const currentQ = state.questions[state.currentQuestionIndex];
      if (currentQ && delta > 0) {
        dispatch({ type: 'ADD_TIME', payload: { questionId: currentQ.id, delta } });
      }
      lastActiveRef.current = now;
    }

    if (action.type === 'FINAL_SUBMIT') {
      try {
        const timeSpentUpdated = { ...(state.timeSpent || {}) };
        const currentQId = state.questions?.[state.currentQuestionIndex]?.id;
        if (currentQId && delta > 0) {
          timeSpentUpdated[currentQId] = (timeSpentUpdated[currentQId] || 0) + delta;
        }

        const payload = {
          examTitle: state.examTitle,
          answers: state.answers,
          timeSpent: timeSpentUpdated,
          timeLeft: state.timeLeft,
          elapsedSeconds: (state.elapsedSeconds || 0) + ((state.initialDuration || 0) === 0 ? delta : 0),
          initialDuration: state.initialDuration || 0,
        };

        try {
          // send to backend
          // await fetch('/api/submit', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(payload),
          // });
          console.log('Submission payload sent', payload);
        } catch (e) {
          console.warn('Submission endpoint unavailable, payload logged to console', payload);
        }
      } catch (err) {
        console.error('Error during submit:', err);
      } finally {
        dispatch(action);
        // navigate to analysis page after final submit
        try {
          navigate('/analysis');
        } catch (e) {
          console.warn('Navigation to analysis failed', e);
        }
      }
    } else {
      dispatch(action);
    }
  }

  // initialize exam into reducer when selectedExam becomes available
  useEffect(() => {
    if (selectedExam) {
      dispatch({ type: 'INITIALIZE_EXAM', payload: { questions: selectedExam.questions, sections: selectedExam.sections, durationInSeconds: selectedExam.durationInSeconds, examTitle: selectedExam.examTitle } });
      lastActiveRef.current = Date.now();
    }
  }, [selectedExam]);

  useEffect(() => {
    const onBeforeUnload = () => {
      if (!state || !state.questions || state.questions.length === 0) return;
      const now = Date.now();
      const delta = Math.round((now - (lastActiveRef.current || now)) / 1000);
      if (delta > 0) dispatch({ type: 'ADD_TIME', payload: { questionId: state.questions[state.currentQuestionIndex].id, delta } });
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [state]);

  const handleBackClick = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    if (onExit) {
      onExit();
    } else {
      navigate('/dashboard');
    }
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  return (
    <AssessmentContext.Provider value={{ state, dispatch: wrappedDispatch }}>
      <div className="h-screen w-screen flex flex-col font-sans">
        <Header examTitle={state?.examTitle || ''} onBack={handleBackClick} />
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
        {showExitConfirmation && (
          <ConfirmationModal
            title="End Test"
            message="Are you sure you want to end the test? Your progress will be saved, but you won't be able to continue from where you left off."
            onConfirm={handleConfirmExit}
            onCancel={handleCancelExit}
          />
        )}
      </div>
    </AssessmentContext.Provider>
  );
}
