import React from 'react'
import { useContext,useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../main'
import Spinner from '../components/spinner'


const ForgotPassword = () => {
    const auth=useContext(AuthContext)
    const email=useRef()
    const [emailSent, setEmailSent]=useState(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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



  const forgotPassword=(e)=>{
    e.preventDefault()

    if (loading){return}
    setLoading(true)

    if (email.current.value=="" || email.current.value.length<5){
      showError("email required")
      email.current.focus()
      setLoading(false)
      return
    }

    if (!emailRegex.test(email.current.value)){
      showError("email format invalid")
      email.current.focus()
      setLoading(false)
      return
    }

    auth.authActions.forgotPassword(email.current.value).then(()=>{
      setEmailSent(true)
    }).catch((err)=>{
      showError(err)
    }).finally(()=>{
      setLoading(false)
    })
  }

  return (
    <>
    <div className="text1">Reset Password</div>
    <div><br/><br/></div>
    <form onSubmit={!emailSent ? forgotPassword: (e)=>{e.preventDefault()}}>
    <div className="input">
      <img src="/assets/username.svg" className="input-icon"/>
      <input ref={email}  placeholder="Email"/>
    </div>
    <span className='errorText'>{anError}</span>
    <Link to="/login" className='password-reset'><div className="text3">Login?</div></Link>

    {!loading ? (
    <button className="page-button button1" onClick={()=>auth.authActions.forgotPassword(email.current.value)}>{!emailSent ? "Send Email": "Email Sent"}</button>
    ) : (
    <Spinner />
    )}
    </form>
    </>
  )
}

export default ForgotPassword