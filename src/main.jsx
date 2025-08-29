import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider,Route,Link } from 'react-router-dom'
import Login from './page/Login.jsx'
import Resetpassword from './page/Resetpassword.jsx'
import SignUp from './page/SignUp.jsx'
import Mainpage from './page/mainpage.jsx'
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element:<Login />
  },
  {
    path:"Sign Up",
    element:<SignUp />
  },
  {
    path:"Resetpassword",
    element:<Resetpassword />
  },
  {
    path:"Mainpage",
    element:<Mainpage />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
