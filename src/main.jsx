import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider,Route,Link } from 'react-router-dom'
import Login from './page/Login.jsx'
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element:<Login/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
