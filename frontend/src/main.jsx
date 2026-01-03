import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/Dashboard.jsx'
import Preview from './pages/Preview.jsx'
import Login from './pages/LoginPage.jsx'
import Signup from './pages/Signup.jsx'
import Analysis from './pages/Analysis.jsx'
import Performance from './pages/Performance.jsx'
import ClassPerformance from './pages/ClassPerformance.jsx'
import ClassTestDetails from './pages/ClassTestDetails.jsx';
import './index.css'
// import './styles/assessment.css'
import App from './App.jsx'
// import Start from './pages/Start.jsx'
import MathLiveProvider from './components/MathLiveProvider';
import Layout from './components/Layout.jsx';
import Topics from './pages/Topics.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
// import MathLiveProvider from './components/MathLiveProvider.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path : "/",
    element : <Layout />,
    children : [
      {
        path: "/",
        element: <Login/>
      },{
        path : "/signup",
        element: <Signup/>
      },
      {
        path: "/class-performance",
        element: <ProtectedRoute><ClassPerformance /></ProtectedRoute>
      },
      {
        path: "/class-performance/test/:testId",
        element: <ProtectedRoute><ClassTestDetails /></ProtectedRoute>
      },
      {
        path : "/dashboard",
        element : <ProtectedRoute><Dashboard/></ProtectedRoute>
      },
      {
        path : "/preview",
        element :<ProtectedRoute><Preview/></ProtectedRoute>
      },
      {
        path: "/analysis",
        element: <ProtectedRoute><Analysis /></ProtectedRoute>
      },
      {
          path: "/topics/:subjectId",
          element: <ProtectedRoute><Topics /></ProtectedRoute>
        },
      {
        path: "/performance",
        element: <ProtectedRoute><Performance /></ProtectedRoute>
      },
      {
        path: "/performance/:subjectId",
        element: <ProtectedRoute><Performance /></ProtectedRoute>
      },
      {
        path : "/assessment",
        element : <ProtectedRoute><App /></ProtectedRoute>,
        
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MathLiveProvider>
          <RouterProvider router={router} />
        </MathLiveProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
