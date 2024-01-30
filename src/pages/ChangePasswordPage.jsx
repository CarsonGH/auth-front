import React from 'react'
import { useContext } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../main'
import Spinner from '../components/spinner'

const ChangePasswordPage = () => {
  const auth=useContext(AuthContext)
  const oldPassword=useRef()
  const newPassword=useRef()
  const repeatNewPassword=useRef()

  const[showPassword,setShowPassword]=useState(false)

  const [loading, setLoading] = useState(false)
  const [anError, setAnError] = useState("")
  const errorTimeout = useRef(null);
  const showError=(err)=>{
    setAnError(err)
    if (errorTimeout.current){
    clearTimeout(errorTimeout.current)
    }
    errorTimeout.current=setTimeout(()=>{setAnError("")},4000)
  }
 

  const changePassword=(e)=>{
    e.preventDefault()
    setLoading(true)

    //form validation
    if (oldPassword.current.value==""){
      showError("Current Password Required")
      oldPassword.current.focus()
      setLoading(false)
      return
    }
    if (newPassword.current.value==""){
      showError("New Password Required")
      newPassword.current.focus()
      setLoading(false)
      return
    }
    if (repeatNewPassword.current.value==""){
      showError("Repeating New Password Required")
      repeatNewPassword.current.focus()
      setLoading(false)
      return
    }
    if (repeatNewPassword.current.value!=newPassword.current.value){
      showError("New Password and Repeated New Password Must Match!")
      repeatNewPassword.current.focus()
      setLoading(false)
      return
    }

    auth.authActions.changePassword({
      oldPassword:oldPassword.current.value,
      newPassword:newPassword.current.value,
    }).catch((err)=>{
      showError(err)
    }).finally(()=>{setLoading(false)})
  }
  return (
    <>
    <div className="text1">Change password</div>
    <div><br/><br/></div>
    <form onSubmit={changePassword}>
    <div className="input">
      <img src="/assets/unlock.svg" className="input-icon"/>
      <input ref={oldPassword} type={showPassword ? "text" : "password"}  placeholder="Current Password"/>
      <button className="input-icon cursor-pointer" type="button" onClick={()=>{setShowPassword(!showPassword)}} ><img src="/assets/viewpass.svg"/></button>
    </div>
    <div className="input">
      <img src="/assets/unlock.svg" className="input-icon"/>
      <input ref={newPassword} placeholder="New Password" type={showPassword ? "text" : "password"} />
    </div>
    <div className="input">
      <img src="/assets/unlock.svg" className="input-icon"/>
      <input ref={repeatNewPassword} placeholder="Repeat New Password" type={showPassword ? "text" : "password"} />
    </div>
    {!loading ? (
      <>
      <span className='errorText'>{anError}</span>
      <button className="page-button button1" >Change Password</button>
      </>
    ) : (
    <Spinner />
    )}
    </form>
    <div className="line-break" />
    <br/>
    <br/>
    <Link to="/delete-account" className='password-reset' ><div className="text3">Delete Account?</div></Link>
    </>
  )
}

export default ChangePasswordPage