import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider,Route,Link } from 'react-router-dom'
import Login from './page/Login.jsx'
import Resetpassword from './page/Resetpassword.jsx'
import SignUp from './page/SignUp.jsx'
import Mainpage from './page/Mainpage.jsx'
import CratePost from './page/CratePost.jsx'
import Collect from './page/Collect.jsx'
import './index.css'


const router = createBrowserRouter([
  {
    path: "/",
    element:<Login />
  },
  {
    path:"sign-up",
    element:<SignUp />
  },
  {
    path:"reset-password",
    element:<Resetpassword />
  },
  {
    path:"main-page",
    element:<Mainpage />
  },
  {
    path:"/crate-post",
    element:<CratePost />
  },
  {
    path:"/collect-post",
    element:<Collect />
  },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
