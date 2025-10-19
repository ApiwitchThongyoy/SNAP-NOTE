import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './page/Login.jsx';
import Resetpassword from './page/Resetpassword.jsx';
import SignUp from './page/SignUp.jsx';
import Mainpage from './page/Mainpage.jsx';
import CratePost from './page/CratePost.jsx';
import Collect from './page/Collect.jsx';
import Setting from './page/Setting.jsx';
import ProFile from './page/ProFile.jsx';
import Setting_message from './page/Setting_message.jsx';
import './index.css';
import { PostProvider } from './context/PostProvider.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import VerifyEmail from './component/SignUp/VerifyEmail.jsx'
import UpdatePassword from './component/Resetpassword/UpdatePassword.jsx';


const router = createBrowserRouter([
  {
    path: "/Login-Detail",
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
  },{
    path:"/setting",
    element:<Setting />
  },{
    path:"/profile",
    element:<ProFile />
  },{
    path:"/settingmessage",
    element:<Setting_message />
  },{
    path:"/verify-email",
    element:<VerifyEmail/>
  },{
  path: "/update-password",
  element: <UpdatePassword />
}

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ ครอบ RouterProvider ด้วย PostProvider */}
    <AuthProvider>
      <PostProvider>
        <RouterProvider router={router} />
      </PostProvider>
    </AuthProvider>
  </StrictMode>
);