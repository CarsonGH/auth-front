import "./login.css"
import "./stats.css"

import { useState } from "react"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ChangePasswordPage from "./pages/ChangePasswordPage"
import ForgotPassword from "./pages/ForgotPassword"
import VerifyEmail from "./pages/VerifyEmail"
import DeleteAccountPage from "./pages/DeleteAccountPage"
import Stats from "./components/Stats"
import LoginTemplate from "./components/LoginTemplate"
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Homepage from "./pages/Homepage"
import { useContext } from "react"
import { AuthContext } from "./main"
import ResetPassword from "./pages/ResetPassword"
import SendLoginByEmail from "./pages/SendLoginByEmail"
import LoginByEmail from "./pages/LoginByEmail"

function App() {
  const auth = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)


  



  return (
  <>
    <Stats/>
    {/*-------------------------------------------*********************************************---------------------------------------------------------------------------------------- */}
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Homepage />}/>
        <Route path="api">

        </Route>
        <Route element={<LoginTemplate />}>
          { auth.auth==null ?
          <>          
          <Route path="login" element={<LoginPage setShowPassword={setShowPassword} showPassword={showPassword}/>}/>
          <Route path="register" element={<RegisterPage setShowPassword={setShowPassword} showPassword={showPassword}  />}/>
          <Route path="forgot-password" element={<ForgotPassword  />}/>
          <Route path="login-link" element={<SendLoginByEmail />}/>
          </>
          :
          <>
          <Route path="verify-account" element={<VerifyEmail/>}/>
          <Route path="delete-account" element={<DeleteAccountPage setShowPassword={setShowPassword} showPassword={showPassword} />}/>
          <Route path="change-password" element={<ChangePasswordPage />}/>
          </>
          }
          <Route path="reset-password" element={<ResetPassword />}/>
          <Route path="login-by-email" element={<LoginByEmail />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
