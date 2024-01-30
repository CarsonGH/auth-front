import React from 'react'
import { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../main'
import { useEffect } from 'react'

const SendLoginByEmail = ({ isLoading }) => {
  const email=useRef()
  const auth=useContext(AuthContext)
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

  const loginByEmail=(e)=>{
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

    auth.authActions.sendLoginByEmail(email.current.value).then(()=>{
      setEmailSent(true)
    }).catch((err)=>{
      showError(err)
    }).finally(()=>{
      setLoading(false)
    })
  }



  useEffect(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    const loginToken = searchParams.get("token")
    if (!(loginToken!="" && loginToken!=null)){
      return
    }
    setLoading(true)
    auth.authActions.resolveLoginByEmail.then(()=>{
      setEmailSent(true)
    }).catch((err)=>{
      setAnError(err)
    }).finally(
      setLoading(false)
    )
  },[])

  return (
    <>
    <div className="text1">Login Link</div>
    <div></div>
    <form onSubmit={!emailSent? loginByEmail : (e)=>{e.preventDefault()}}>
    <div className="input">
      <img src="/assets/username.svg" className="input-icon"/>
      <input ref={email}  placeholder="Email"/>
    </div>
    <span className="errorText">{anError}</span>
    <div className="text3 textcenter">Clicking this link will send an email with a link allowing you to login to the site once.</div>
    {!isLoading ? (
      <>
      {!emailSent ?
      <button className="page-button button1">Send Email</button>
      :
      <div className="page-button button1">Email Sent</div>
      }
    </>
    ) : (
    <Spinner />
    )}
    </form>
    <br/>
    <Link to="/login" className='password-reset'><div className="text3">Login?</div></Link>

    </>
  )
}

export default SendLoginByEmail