import React, { useReducer, useEffect, useRef, useState } from 'react';
import { AssessmentContext, QUESTION_STATUS } from '../context/assessmentContext.jsx';
import assessmentReducer from '../utils/assessmentReducer.js';
import Header from '../components/Header.jsx';
import LeftSection from '../components/LeftSection.jsx';
import RightSection from '../components/RightSection.jsx';
import SummaryPage from '../components/SummaryPage.jsx';
import AlertModal from '../components/AlertModal.jsx';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import EXAMS from '../data/examsList.js';
import { submitAnswers } from '../api/index.js';

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

  const attemptIdFromState = location?.state?.attemptId;

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
      const qId = currentQ?.questionId ?? currentQ?.id;
      if (qId && delta > 0) {
        // console.log('Dispatching ADD_TIME', { questionId: qId, delta });
        dispatch({ type: 'ADD_TIME', payload: { questionId: qId, delta } });
      }
      lastActiveRef.current = now;
    }

    if (action.type === 'FINAL_SUBMIT') {
      let resJson = null;
      try {
        const timeSpentUpdated = { ...(state.timeSpent || {}) };
        const currentQId = state.questions?.[state.currentQuestionIndex]?.questionId ?? state.questions?.[state.currentQuestionIndex]?.id;
        if (currentQId && delta > 0) {
          timeSpentUpdated[currentQId] = (timeSpentUpdated[currentQId] || 0) + delta;
        }


        const payload = Object.keys(state.answers).map(questionId => {
          const {answer, status} = state.answers[questionId];
          const question = state.questions.find(q => q.questionId.toString() === questionId.toString());
          const time_spent = timeSpentUpdated[questionId] || 0;


          const answerData = {
            exam_attempt: attemptIdFromState || null,
            question: questionId,
            time_spent: time_spent,
            answer_status : status,
          };

          if (question?.questionType === 'MCQ') {
            answerData.selected_option_identifier = answer;
            answerData.numerical_answer = null;
          } else if (question?.questionType === 'NUM') {
            answerData.selected_option_identifier = null;
            answerData.numerical_answer = answer;
          } else {
            // Fallback for unknown question types, if any
            answerData.selected_option_identifier = answer;
            answerData.numerical_answer = null;
          }

          return answerData;
        });


        
        try {
          // send to backend and capture response body for debugging
          console.log('Submitting payload to server:', payload);
          const res = await submitAnswers(JSON.stringify(payload));
          console.log('Server response:', res);
          // const res = await fetch('http://127.0.0.1:8000/api/performance/submit/', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(payload),
          // });
          resJson = res.data;
          if (res.status === 201) {
            console.log('Submission success', res.status, resJson);
            dispatch(action);
             try {
              navigate('/analysis', { state: { submissionResult: resJson } });
            } catch (e) {
              console.warn('Navigation to analysis failed', e);
            }

            // console.error('Server response (stringified):', JSON.stringify(resJson, null, 2));
          } else {
            console.error('Submission failed', res.status, res);
           
          }
        } catch (e) {
          console.warn('Submission endpoint unavailable, payload logged to console', e);
        }
      } catch (err) {
        console.error('Error during submit:', err);
      }
    } else {
      dispatch(action);
    }
  }

  // initialize exam into reducer when selectedExam becomes available
  useEffect(() => {
    if (selectedExam) {
      dispatch({ type: 'INITIALIZE_EXAM', payload: { questions: selectedExam.questions, sections: selectedExam.sections, durationInSeconds: selectedExam.durationInSeconds, examTitle: selectedExam.examTitle, assessmentType : selectedExam.assessmentType, examId : selectedExam.examId, practiceId: selectedExam.practiceId} });
      lastActiveRef.current = Date.now();
    }
  }, [selectedExam]);

  useEffect(() => {
    const onBeforeUnload = () => {
      if (!state || !state.questions || state.questions.length === 0) return;
      const now = Date.now();
      const delta = Math.round((now - (lastActiveRef.current || now)) / 1000);
      const q = state.questions[state.currentQuestionIndex];
      const qId = q?.questionId ?? q?.id;
      if (delta > 0 && qId) {
        // console.log('Dispatching ADD_TIME (beforeunload)', { questionId: qId, delta });
        dispatch({ type: 'ADD_TIME', payload: { questionId: qId, delta } });
      }

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
