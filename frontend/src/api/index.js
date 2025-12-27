import axios from 'axios';

// Create an axios instance with a base URL for your backend.
// This makes it easy to manage your API endpoints.
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API functions for Exams
 */
export const getExams = () => {
  return apiClient.get('/assessments/exams/');
};

export const getExamDetails = (id) => {
  return apiClient.get(`/assessments/exams/${id}/`);
};

/**
 * API functions for Sections
 */
export const getSections = () => {
  return apiClient.get('/assessments/sections/');
};

export const getSectionDetails = (id) => {
  return apiClient.get(`/assessments/sections/${id}/`);
};

/**
 * API functions for Questions
 */
export const getQuestions = () => {
  return apiClient.get('/assessments/questions/');
};

export const getQuestionDetails = (id) => {
  return apiClient.get(`/assessments/questions/${id}/`);
};

/**
 * API functions for Options
 */
export const getOptions = () => {
  return apiClient.get('/assessments/options/');
};

export const getOptionDetails = (id) => {
  return apiClient.get(`/assessments/options/${id}/`);
};

/**
 * API functions for Practice sessions
 */
export const getPractices = () => {
  return apiClient.get('/assessments/practices/');
};

export const getPracticeDetails = (id) => {
  return apiClient.get(`/assessments/practices/${id}/`);
};

/**
 * API functions for Topics
 */
export const getTopics = () => {
  return apiClient.get('/assessments/topics/');
};

export const getTopicDetails = (id) => {
  return apiClient.get(`/assessments/topics/${id}/`);
};


export const createAttempt = (attemptData) => {
  return apiClient.post('/performance/attempts/', attemptData);
}

export const submitAnswers = (answersData) => {
  return apiClient.post('/performance/submit/', answersData);
}

export default apiClient;
