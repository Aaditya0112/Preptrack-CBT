import { createContext } from 'react';

export const AssessmentContext = createContext();
export const MathLiveContext = createContext({ isMathLiveReady: false });

export const QUESTION_STATUS = {
  NOT_VISITED: 'NOT_VISITED',
  NOT_ANSWERED: 'NOT_ANSWERED',
  ANSWERED: 'ANSWERED',
  MARKED_FOR_REVIEW: 'MARKED_FOR_REVIEW',
  ANSWERED_AND_MARKED: 'ANSWERED_AND_MARKED',
};
