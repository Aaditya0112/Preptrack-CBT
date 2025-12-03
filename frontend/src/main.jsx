import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Preview from './pages/Preview.jsx'
import Login from './pages/LoginPage.jsx'
import Signup from './pages/Signup.jsx'
import Analysis from './pages/Analysis.jsx'
import './index.css'
// import './styles/assessment.css'
import App from './App.jsx'
// import Start from './pages/Start.jsx'
import MathLiveProvider from './components/MathLiveProvider';
import Layout from './components/Layout.jsx';
// import MathLiveProvider from './components/MathLiveProvider.jsx'

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
      },{
        path : "/dashboard",
        element : <Dashboard/>
      },
      {
        path : "/preview",
        element :<Preview/>
      },
      {
        path: "/analysis",
        element: <MathLiveProvider>
           <Analysis />
        </MathLiveProvider>
       
      },
      {
        path : "/assessment",
        element : <App/>
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MathLiveProvider>
      <RouterProvider router={router} />
    </MathLiveProvider>
  </StrictMode>,
)
