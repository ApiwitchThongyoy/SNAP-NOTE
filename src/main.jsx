import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider,Route,Link } from 'react-router-dom'
import Login from './page/Login.jsx'
import Resetpassword from './page/Resetpassword.jsx'
import SignUp from './page/SignUp.jsx'
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element:<Login />
  },
  {
    path:"SignUp",
    element:<SignUp />
  },
  {
    path:"Resetpassword",
    element:<Resetpassword />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
