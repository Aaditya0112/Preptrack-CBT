const QUESTION_STATUS = {
  NOT_VISITED: 'NOT_VISITED',
  NOT_ANSWERED: 'NOT_ANSWERED',
  ANSWERED: 'ANSWERED',
  MARKED_FOR_REVIEW: 'MARKED_FOR_REVIEW',
  ANSWERED_AND_MARKED: 'ANSWERED_AND_MARKED',
};

const initialState = {
  questions: [],
  sections: [],
  answers: {},
  currentQuestionIndex: 0,
  currentSectionId: null,
  timeLeft: 0,
  showSummary: false,
  examTitle: "",
  showValidationError: false,
  timeSpent: {}, // per-question seconds
  initialDuration: 0,
  elapsedSeconds: 0, // total elapsed for untimed exams
};

export default function assessmentReducer(state = initialState, action) {
  switch (action.type) {
    case 'INITIALIZE_EXAM': {
      const { questions, sections, durationInSeconds, examTitle, assessmentType} = action.payload;
      const initialAnswers = {};
      questions.forEach(q => { initialAnswers[q.questionId] = { answer: null, status: QUESTION_STATUS.NOT_VISITED }; });
      if (questions.length > 0) initialAnswers[questions[0].questionId].status = QUESTION_STATUS.NOT_ANSWERED;
      // initialize timeSpent map
      const timeSpent = {};
      questions.forEach(q => { timeSpent[q.questionId] = 0; });
      return { ...initialState, questions, sections, answers: initialAnswers, timeLeft: durationInSeconds, initialDuration: durationInSeconds, examTitle, currentSectionId: sections[0]?.id || null, currentQuestionIndex: 0, timeSpent, elapsedSeconds: 0, assessmentType };
    }
    case 'ADD_TIME': {
      // payload: { questionId, delta } where delta is seconds to add
      const { questionId, delta } = action.payload || {};
      if (!questionId || !delta) return state;
      const timeSpent = { ...(state.timeSpent || {}) };
      timeSpent[questionId] = (timeSpent[questionId] || 0) + delta;
      return { ...state, timeSpent };
    }
    case 'GO_TO_QUESTION': {
      const newIndex = action.payload;
      if (newIndex < 0 || newIndex >= state.questions.length) return state;
      const currentQuestionId = state.questions[state.currentQuestionIndex].questionId;
      const newQuestionId = state.questions[newIndex].questionId;
      const newAnswers = { ...state.answers };
      if (newAnswers[currentQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[currentQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      if (newAnswers[newQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[newQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      return { ...state, currentQuestionIndex: newIndex, currentSectionId: state.questions[newIndex].sectionId, answers: newAnswers };
    }
    case 'SAVE_AND_NEXT': {
      const { answer } = action.payload;
      const currentQuestionId = state.questions[state.currentQuestionIndex].questionId;
      const newAnswers = { ...state.answers };
      const hasAnswer = answer !== null && answer !== undefined && answer !== '';
      newAnswers[currentQuestionId] = { answer: answer, status: hasAnswer ? QUESTION_STATUS.ANSWERED : QUESTION_STATUS.NOT_ANSWERED };
      const nextIndex = Math.min(state.currentQuestionIndex + 1, state.questions.length - 1);
      if (nextIndex !== state.currentQuestionIndex) {
        const nextQuestionId = state.questions[nextIndex].questionId;
        if (newAnswers[nextQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[nextQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      }
      return { ...state, answers: newAnswers, currentQuestionIndex: nextIndex, currentSectionId: state.questions[nextIndex].sectionId };
    }
    case 'GO_TO_PREVIOUS': {
      const currentQuestionId = state.questions[state.currentQuestionIndex].questionId;
      const newAnswers = { ...state.answers };
      const prevIndex = Math.max(state.currentQuestionIndex - 1, 0);
      if (newAnswers[currentQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[currentQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      const prevQuestionId = state.questions[prevIndex].questionId;
      if (newAnswers[prevQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[prevQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      return { ...state, currentQuestionIndex: prevIndex, currentSectionId: state.questions[prevIndex].sectionId, answers: newAnswers };
    }
    case 'MARK_AND_NEXT': {
      const { answer } = action.payload;
      const currentQuestionId = state.questions[state.currentQuestionIndex].questionId;
      const newAnswers = { ...state.answers };
      const hasAnswer = answer !== null && answer !== undefined && answer !== '';
      newAnswers[currentQuestionId] = { answer: answer, status: hasAnswer ? QUESTION_STATUS.ANSWERED_AND_MARKED : QUESTION_STATUS.MARKED_FOR_REVIEW };
      const nextIndex = Math.min(state.currentQuestionIndex + 1, state.questions.length - 1);
      if (nextIndex !== state.currentQuestionIndex) {
        const nextQuestionId = state.questions[nextIndex].questionId;
        if (newAnswers[nextQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[nextQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      }
      return { ...state, answers: newAnswers, currentQuestionIndex: nextIndex, currentSectionId: state.questions[nextIndex].sectionId };
    }
    case 'CLEAR_RESPONSE': {
      const currentQuestionId = state.questions[state.currentQuestionIndex].questionId;
      const newAnswers = { ...state.answers };
      newAnswers[currentQuestionId] = { answer: null, status: QUESTION_STATUS.NOT_ANSWERED };
      return { ...state, answers: newAnswers };
    }
    case 'TICK_TIME': {
      // If exam is untimed (initialDuration === 0) increment elapsedSeconds so user can see how much time they've spent
      if ((state.initialDuration || 0) === 0) {
        return { ...state, elapsedSeconds: (state.elapsedSeconds || 0) + 1 };
      }
      if (state.timeLeft <= 0) return { ...state, showSummary: true };
      return { ...state, timeLeft: state.timeLeft - 1 };
    }
    case 'TOGGLE_SUMMARY': return { ...state, showSummary: !state.showSummary };
    case 'FINAL_SUBMIT': console.log('Exam Submitted!', state.answers); return { ...state, timeLeft: 0 };
    case 'SHOW_VALIDATION_ERROR': return { ...state, showValidationError: true };
    case 'HIDE_VALIDATION_ERROR': return { ...state, showValidationError: false };
    default: return state;
  }
}
