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
};

export default function assessmentReducer(state = initialState, action) {
  switch (action.type) {
    case 'INITIALIZE_EXAM': {
      const { questions, sections, durationInSeconds, examTitle } = action.payload;
      const initialAnswers = {};
      questions.forEach(q => { initialAnswers[q.id] = { answer: null, status: QUESTION_STATUS.NOT_VISITED }; });
      if (questions.length > 0) initialAnswers[questions[0].id].status = QUESTION_STATUS.NOT_ANSWERED;
      return { ...initialState, questions, sections, answers: initialAnswers, timeLeft: durationInSeconds, examTitle, currentSectionId: sections[0]?.id || null, currentQuestionIndex: 0 };
    }
    case 'GO_TO_QUESTION': {
      const newIndex = action.payload;
      if (newIndex < 0 || newIndex >= state.questions.length) return state;
      const currentQuestionId = state.questions[state.currentQuestionIndex].id;
      const newQuestionId = state.questions[newIndex].id;
      const newAnswers = { ...state.answers };
      if (newAnswers[currentQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[currentQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      if (newAnswers[newQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[newQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      return { ...state, currentQuestionIndex: newIndex, currentSectionId: state.questions[newIndex].sectionId, answers: newAnswers };
    }
    case 'SAVE_AND_NEXT': {
      const { answer } = action.payload;
      const currentQuestionId = state.questions[state.currentQuestionIndex].id;
      const newAnswers = { ...state.answers };
      const hasAnswer = answer !== null && answer !== undefined && answer !== '';
      newAnswers[currentQuestionId] = { answer: answer, status: hasAnswer ? QUESTION_STATUS.ANSWERED : QUESTION_STATUS.NOT_ANSWERED };
      const nextIndex = Math.min(state.currentQuestionIndex + 1, state.questions.length - 1);
      if (nextIndex !== state.currentQuestionIndex) {
        const nextQuestionId = state.questions[nextIndex].id;
        if (newAnswers[nextQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[nextQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      }
      return { ...state, answers: newAnswers, currentQuestionIndex: nextIndex, currentSectionId: state.questions[nextIndex].sectionId };
    }
    case 'GO_TO_PREVIOUS': {
      const currentQuestionId = state.questions[state.currentQuestionIndex].id;
      const newAnswers = { ...state.answers };
      const prevIndex = Math.max(state.currentQuestionIndex - 1, 0);
      if (newAnswers[currentQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[currentQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      const prevQuestionId = state.questions[prevIndex].id;
      if (newAnswers[prevQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[prevQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      return { ...state, currentQuestionIndex: prevIndex, currentSectionId: state.questions[prevIndex].sectionId, answers: newAnswers };
    }
    case 'MARK_AND_NEXT': {
      const { answer } = action.payload;
      const currentQuestionId = state.questions[state.currentQuestionIndex].id;
      const newAnswers = { ...state.answers };
      const hasAnswer = answer !== null && answer !== undefined && answer !== '';
      newAnswers[currentQuestionId] = { answer: answer, status: hasAnswer ? QUESTION_STATUS.ANSWERED_AND_MARKED : QUESTION_STATUS.MARKED_FOR_REVIEW };
      const nextIndex = Math.min(state.currentQuestionIndex + 1, state.questions.length - 1);
      if (nextIndex !== state.currentQuestionIndex) {
        const nextQuestionId = state.questions[nextIndex].id;
        if (newAnswers[nextQuestionId].status === QUESTION_STATUS.NOT_VISITED) newAnswers[nextQuestionId].status = QUESTION_STATUS.NOT_ANSWERED;
      }
      return { ...state, answers: newAnswers, currentQuestionIndex: nextIndex, currentSectionId: state.questions[nextIndex].sectionId };
    }
    case 'CLEAR_RESPONSE': {
      const currentQuestionId = state.questions[state.currentQuestionIndex].id;
      const newAnswers = { ...state.answers };
      newAnswers[currentQuestionId] = { answer: null, status: QUESTION_STATUS.NOT_ANSWERED };
      return { ...state, answers: newAnswers };
    }
    case 'TICK_TIME': {
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
