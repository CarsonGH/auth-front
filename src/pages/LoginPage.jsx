import React from 'react'
import { useContext } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../main'
import { useState } from 'react'
import Spinner from '../components/spinner'
const LoginPage = ({ setShowPassword, showPassword}) => {
    const auth = useContext(AuthContext)
    const loginEmail=useRef()
    const loginPassword=useRef()
    const [loading, setLoading]=useState(false)
    const [anError, setAnError]=useState("")


    const showError=async(err)=>{
        setAnError(err)
        setTimeout(()=>{
          setAnError("")
        }, 4000)
    }

    const signIn = () => {
        if(loading==true){return}
        setLoading(true);
        auth.authActions.login({email: loginEmail.current.value, password: loginPassword.current.value}).catch((err)=>{
            console.log("error:", err);
            showError(err.errorMessage);
        }).finally(()=>{
            setLoading(false)
        })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const submitForm=(e)=>{
        e.preventDefault()
        //check password and username for restrictions
        if (loginEmail.current.value.length<5){
            showError("Email Too Short")
            loginEmail.current.focus()
            return
        }
        if (loginEmail.current.value.length>100){
            showError("Email Too Long")
            loginEmail.current.focus()
            return
        }
        if (!emailRegex.test(loginEmail.current.value)){
            showError("Email Invalid Format")
            loginEmail.current.focus()
            return
        }
        if (loginPassword.current.value==""){
            showError("Must Enter Password")
            loginPassword.current.focus()
            return
        }
        signIn()
    }
  
    return (
    <form onSubmit={submitForm}>
    <div className="text1">Login</div>
    <div><br/><br/></div>
    <div className="input">
        <span className="input-icon"><img src="/assets/username.svg"/></span>
        <input ref={loginEmail} placeholder="Email"/>
    </div>
    <div className="input">
        <img src="/assets/unlock.svg" className="input-icon"/>
        <input ref={loginPassword} type={showPassword ? "text" : "password"}  placeholder="************"/>
        <button type="button"  className="input-icon cursor-pointer" onClick={()=>{setShowPassword(!showPassword)}} ><img src="/assets/viewpass.svg"/></button>
    </div>
    <Link to="/forgot-password" className='password-reset'  ><div className="text3">Forgot Password?</div></Link>
    {!loading ? (
    <button className="page-button button1" type="submit">Login</button>
    ) : (
    <Spinner />
    )}
    {anError?<div className='errorText'>{anError}</div>:<></>}
    <div className="line-break" />
    <Link to="/register" className="page-button button2">Create New Account</Link>
    </form>
  )
}

export default LoginPage