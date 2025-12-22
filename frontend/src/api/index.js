import axios from 'axios';

// Create an axios instance with a base URL for your backend.
// This makes it easy to manage your API endpoints.
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/assessments',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API functions for Exams
 */
export const getExams = () => {
  return apiClient.get('/exams/');
};

export const getExamDetails = (id) => {
  return apiClient.get(`/exams/${id}/`);
};

/**
 * API functions for Sections
 */
export const getSections = () => {
  return apiClient.get('/sections/');
};

export const getSectionDetails = (id) => {
  return apiClient.get(`/sections/${id}/`);
};

/**
 * API functions for Questions
 */
export const getQuestions = () => {
  return apiClient.get('/questions/');
};

export const getQuestionDetails = (id) => {
  return apiClient.get(`/questions/${id}/`);
};

/**
 * API functions for Options
 */
export const getOptions = () => {
  return apiClient.get('/options/');
};

export const getOptionDetails = (id) => {
  return apiClient.get(`/options/${id}/`);
};

/**
 * API functions for Practice sessions
 */
export const getPractices = () => {
  return apiClient.get('/practices/');
};

export const getPracticeDetails = (id) => {
  return apiClient.get(`/practices/${id}/`);
};

/**
 * API functions for Topics
 */
export const getTopics = () => {
  return apiClient.get('/topics/');
};

export const getTopicDetails = (id) => {
  return apiClient.get(`/topics/${id}/`);
};

export default apiClient;
