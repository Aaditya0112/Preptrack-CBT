import axios from 'axios';

// Helper to read a cookie value when it is not HttpOnly.
// If the backend sets HttpOnly cookies (recommended), the browser will still
// send them automatically via withCredentials even though JS cannot read them.
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
};

// Determine base URL based on environment
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  // Fallback: use relative path for same-origin requests
  return '/api';
};

// Create an axios instance with a base URL for your backend.
// This makes it easy to manage your API endpoints.
const apiClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject Authorization from access token cookie when readable.
apiClient.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const access = getCookie('access');
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh using HttpOnly cookie
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't try to refresh on /accounts/token/refresh/ itself (avoid loop)
      if (originalRequest.url?.includes('/accounts/token/refresh/')) {
        return Promise.reject(error);
      }

      // Don't try to refresh on profile check during bootstrap (avoid loop)
      if (originalRequest.url?.includes('/accounts/profile/')) {
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await apiClient.post('/accounts/token/refresh/');

        const newAccess = refreshResponse.data?.access;
        if (newAccess) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API functions for Authentication
 */
export const register = (userData) => {
  return apiClient.post('/accounts/register/', userData);
};

export const login = (credentials) => {
  return apiClient.post('/accounts/login/', credentials);
};

export const logout = () => {
  return apiClient.post('/accounts/logout/');
};

export const refreshAccessToken = (refreshToken) => {
  return apiClient.post('/accounts/token/refresh/', refreshToken ? { refresh: refreshToken } : {});
};

export const getUserProfile = () => {
  return apiClient.get('/accounts/profile/');
};

export const updateUserProfile = (userData) => {
  return apiClient.put('/accounts/profile/', userData);
};

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

export const updateAttemptStatus = (attemptId, status) => {
  return apiClient.patch(`/performance/attempts/${attemptId}/`, { status });
}

export default apiClient;
