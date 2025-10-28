import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
// import './styles/assessment.css'
import App from './App.jsx'
import Start from './pages/Start.jsx'

const router = createBrowserRouter([
  {
    path : "/",
    element : <Outlet/>,
    children : [
      {
        path: "/",
        element: <Start/>
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
    <RouterProvider router={router}/>
  </StrictMode>,
)
