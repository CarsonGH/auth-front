import React from 'react'
import { useContext } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../main'
import { useState } from 'react'
import Spinner from '../components/spinner'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = ({setShowPassword, showPassword}) => {
  const auth=useContext(AuthContext)
  const registerEmail=useRef()
  const registerPassword=useRef()
  const registerUsername=useRef()
  const [loading, setLoading] = useState(false)
  const [anError, setAnError] = useState("")
  const errorTimeout = useRef(null);
  const ShowError=(err)=>{
    setAnError(err)
    if (errorTimeout.current){
    clearTimeout(errorTimeout.current)
    }
    errorTimeout.current=setTimeout(()=>{setAnError("")},5000)
  }

  const createNewUser=(e)=>{
  e.preventDefault()
  setLoading(true)
  //validate form
  if (registerEmail.current.value==""){
    ShowError("email required")
    registerEmail.current.focus()
    setLoading(false)
    return
  }
  if (registerEmail.current.value.length<5){
    ShowError("email too short")
    registerEmail.current.focus()
    setLoading(false)
    return
  }
  if (registerEmail.current.value.length>100){
    ShowError("email too long")
    registerEmail.current.focus()
    setLoading(false)
    return
  }
  if (!emailRegex.test(registerEmail.current.value)){
    ShowError("email invalid format")
    registerEmail.current.focus()
    setLoading(false)
    return
  }
  if (registerUsername.current.value==""){
    ShowError("Business Name required")
    registerUsername.current.focus()
    setLoading(false)
    return
  }
  if (registerUsername.current.value.length<3){
    ShowError("Business Name too short")
    registerUsername.current.focus()
    setLoading(false)
    return
  }
  if (registerUsername.current.value.length>50){
    ShowError("Business Name too long")
    registerUsername.current.focus()
    setLoading(false)
    return
  }
  if (registerPassword.current.value.length>256){
    ShowError("Password too long")
    registerPassword.current.focus()
    setLoading(false)
    return
  }
  if (registerPassword.current.value.length<8){
    ShowError("Password too short")
    registerPassword.current.focus()
    setLoading(false)
    return
  }

  
  auth.authActions.registerUser({
    "username": registerUsername.current.value, 
    "email": registerEmail.current.value, 
    "password": registerPassword.current.value
  }).catch((err)=>{
    ShowError(err)
    setLoading(false)
  }).finally(()=>{
    setLoading(true)
  })
  }
  
  return (
  <>
  <div className="text1">Create Your Account</div>
  <div><br/><br/></div>
  <form onSubmit={createNewUser}>
  <div className="input">
      <span className="input-icon"><img src="/assets/username.svg"/></span>
      <input ref={registerEmail} placeholder="Email"/>
  </div>
  <div className="input">
      <span className="input-icon"><img src="/assets/business.svg"/></span>
      <input ref={registerUsername} placeholder="Business Name"/>
  </div>
  <div className="input">
      <img src="/assets/unlock.svg" className="input-icon"/>
      <input ref={registerPassword}   type={showPassword ? "text" : "password"}  placeholder="Password" />
      <button className="input-icon cursor-pointer" type="button" onClick={()=>{setShowPassword(!showPassword)}} ><img src="/assets/viewpass.svg"/></button>
  </div>
  {!loading ? (
    <>
    <span className='errorText'>{anError}</span>
    <button className="page-button button1">Create Account</button>
    </>
  ) : (
  <Spinner />
  )}
  </form>
  <div className="line-break" />
  <Link to="/login" className="page-button button2" >
    Already Have an Account
  </Link>
  </>
  )
  }

export default RegisterPage