// Dummy ExamAttempt and UserAnswer data for development/testing

export const EXAM_ATTEMPTS = [
  {
    attemptId: 'attempt_1',
    userId: 'user_1',
    examId: 'exam_jeea_2025_paper2',
    status: 'in-progress', // 'in-progress' | 'completed' | 'abandoned' | 'paused'
    startTime: new Date().toISOString(),
    endTime: null,
    timeTakenInSeconds: null,
    totalScore: null
  },
  {
    attemptId: 'attempt_2',
    userId: 'user_2',
    examId: 'exam_jeea_2025_paper2',
    status: 'completed',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    timeTakenInSeconds: 3600,
    totalScore: 72
  }
];

export const USER_ANSWERS = [
  // Physics answers (attempt_1)
  { userAnswerId: 'ua_p1', attemptId: 'attempt_1', questionId: 'p1', selectedOptionId: 'opt_p1_b', numericalAnswer: null, answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 45 },
  { userAnswerId: 'ua_p2', attemptId: 'attempt_1', questionId: 'p2', selectedOptionId: null, numericalAnswer: '20', answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 60 },
  { userAnswerId: 'ua_p3', attemptId: 'attempt_1', questionId: 'p3', selectedOptionId: 'opt_p3_c', numericalAnswer: null, answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 30 },
  { userAnswerId: 'ua_p4', attemptId: 'attempt_1', questionId: 'p4', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_p5', attemptId: 'attempt_1', questionId: 'p5', selectedOptionId: 'opt_p5_a', numericalAnswer: null, answerStatus: 'answered', isCorrect: false, timeSpentInSeconds: 35 },
  { userAnswerId: 'ua_p6', attemptId: 'attempt_1', questionId: 'p6', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_p7', attemptId: 'attempt_1', questionId: 'p7', selectedOptionId: null, numericalAnswer: '0.4', answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 55 },
  { userAnswerId: 'ua_p8', attemptId: 'attempt_1', questionId: 'p8', selectedOptionId: 'opt_p8_c', numericalAnswer: null, answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 25 },
  { userAnswerId: 'ua_p9', attemptId: 'attempt_1', questionId: 'p9', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_p10', attemptId: 'attempt_1', questionId: 'p10', selectedOptionId: 'opt_p10_a', numericalAnswer: null, answerStatus: 'answered', isCorrect: false, timeSpentInSeconds: 40 },

  // Chemistry answers (attempt_1)
  { userAnswerId: 'ua_c1', attemptId: 'attempt_1', questionId: 'c1', selectedOptionId: 'opt_c1_b', numericalAnswer: null, answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 25 },
  { userAnswerId: 'ua_c2', attemptId: 'attempt_1', questionId: 'c2', selectedOptionId: null, numericalAnswer: '8', answerStatus: 'answered', isCorrect: false, timeSpentInSeconds: 35 },
  { userAnswerId: 'ua_c3', attemptId: 'attempt_1', questionId: 'c3', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_c4', attemptId: 'attempt_1', questionId: 'c4', selectedOptionId: null, numericalAnswer: '6', answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 30 },
  { userAnswerId: 'ua_c5', attemptId: 'attempt_1', questionId: 'c5', selectedOptionId: 'opt_c5_d', numericalAnswer: null, answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 28 },
  { userAnswerId: 'ua_c6', attemptId: 'attempt_1', questionId: 'c6', selectedOptionId: 'opt_c6_b', numericalAnswer: null, answerStatus: 'answered', isCorrect: false, timeSpentInSeconds: 22 },
  { userAnswerId: 'ua_c7', attemptId: 'attempt_1', questionId: 'c7', selectedOptionId: null, numericalAnswer: '98', answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 60 },
  { userAnswerId: 'ua_c8', attemptId: 'attempt_1', questionId: 'c8', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_c9', attemptId: 'attempt_1', questionId: 'c9', selectedOptionId: null, numericalAnswer: '10', answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 24 },
  { userAnswerId: 'ua_c10', attemptId: 'attempt_1', questionId: 'c10', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },

  // Mathematics answers (attempt_1)
  { userAnswerId: 'ua_m1', attemptId: 'attempt_1', questionId: 'm1', selectedOptionId: 'opt_m1_c', numericalAnswer: null, answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 20 },
  { userAnswerId: 'ua_m2', attemptId: 'attempt_1', questionId: 'm2', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_m3', attemptId: 'attempt_1', questionId: 'm3', selectedOptionId: null, numericalAnswer: '120', answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 40 },
  { userAnswerId: 'ua_m4', attemptId: 'attempt_1', questionId: 'm4', selectedOptionId: 'opt_m4_a', numericalAnswer: null, answerStatus: 'answered', isCorrect: false, timeSpentInSeconds: 30 },
  { userAnswerId: 'ua_m5', attemptId: 'attempt_1', questionId: 'm5', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_m6', attemptId: 'attempt_1', questionId: 'm6', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_m7', attemptId: 'attempt_1', questionId: 'm7', selectedOptionId: null, numericalAnswer: '6', answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 18 },
  { userAnswerId: 'ua_m8', attemptId: 'attempt_1', questionId: 'm8', selectedOptionId: null, numericalAnswer: null, answerStatus: 'not_answered', isCorrect: null, timeSpentInSeconds: 0 },
  { userAnswerId: 'ua_m9', attemptId: 'attempt_1', questionId: 'm9', selectedOptionId: null, numericalAnswer: '150', answerStatus: 'answered', isCorrect: false, timeSpentInSeconds: 45 },
  { userAnswerId: 'ua_m10', attemptId: 'attempt_1', questionId: 'm10', selectedOptionId: 'opt_m10_c', numericalAnswer: null, answerStatus: 'answered', isCorrect: true, timeSpentInSeconds: 15 }
];
