import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../main';
import { useState } from 'react';
import Spinner from '../components/spinner';

const VerifyEmail = ({setUserData, userData, isLoading}) => {
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [anError, setAnError] = useState("")
  const ShowError=async(err)=>{
    setAnError(err)
    setTimeout(()=>{setAnError("")},5000)
  }

  const auth = useContext(AuthContext)
  //refresh token function alias
  const refreshToken = auth.authActions.refreshToken
  //send verification email
  const sendVerificationEmail=()=>{
    if (auth.auth.isVerified==1){return}
    setLoading(true)
    auth.authActions.verifyEmail().then(()=>{
      setEmailSent(true),
      setLoading(false),
      console.log("Verification Email Successfully Sent")
    }).catch(err=>{
      ShowError(err)
      console.error('Verfication Email Failed To Send')
      setLoading(0)
    })
  };




  
  return (
    <>
    <div className="text1 textcenter">Verify Your Email</div>
    <div className="line-break" />
    {!auth.auth.isVerified ?
    <>
    {!isLoading ? (
        <>
            {!emailSent ?
            <>
            {!loading
            ?
            <>
            <button className="page-button button1" onClick={sendVerificationEmail}>Send Email</button>
            {anError ? <span className='errorText'>{anError}</span>:<></>}
            </>
            :
            <>
            <Spinner/>
            </>
            }
            </>
            :
            <span className="page-button button1">Email Sent</span>
            }
            <div className="textcenter text3">Clicking this button will send an email to your indox with a link that you can click to verify your account. The email may take 1-5 minutes to arrive clicking the button, the link will be valid for 1 hour after being sent.</div>
            <br/>
            <br/>
            <div className='textcenter text2'> click the refresh button once you've verified your account</div>
            <button onClick={()=>{refreshToken()}} className='refresh-button' aria-label="click this button to refresh your data after clicking verification link"><img src="/assets/refresh.svg"/></button>

        </>
    ) : (
    <Spinner />
    )} </>
    :
    <>Already Verified</>
  }
    </>
  )
}

export default VerifyEmail