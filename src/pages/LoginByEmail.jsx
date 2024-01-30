import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../main';
import { Link } from 'react-router-dom';
import Spinner from '../components/spinner';

const LoginByEmail = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const loginToken = searchParams.get("token")

    const auth=useContext(AuthContext)
    const [anError, setAnError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const loginByEmail = async()=>{
        console.log(loginToken)
        setLoading(true)
        if (loginToken==""||loginToken==null){
            setLoading(false)
            return
        }
        auth.authActions.loginByEmail({username:loginToken}).then(()=>{
            setSuccess(true);
        }
        ).catch((err)=>{
            console.log(err)
            setAnError(err.errorMessage)
            setSuccess(false)}
        ).finally(()=>{
                setLoading(false)
        })
    }
    useEffect(()=>{
        const iframe = document.getElementById('auth-embed');
        iframe.onload = () => {
            loginByEmail()
        };
    },[])

  return (
    <>
    <div className="text1">Email Login</div>
    {!loading ?
    <>
    {success ?
    <>
    <div>Succesfully Logged In</div>
    <Link to="/" className='refresh-button'>Go Home</Link>
    </>
    :
    <>
    <div className='errorText'>{anError}</div>
    <div>Check for a more recent email, or send a new email.</div>
    <div>Dont Forget To Check Your Spam Folder!!</div>
    <Link to="/login-link" className='page-button button1'>Send New Email</Link>
    </>       
    }
    {auth.auth==null?
    <>
    <div className="line-break" />
    <Link to="/login">login?</Link>      
    </> 
    :
    <></>
    }
    </>
    :
    <Spinner/>
    }
    </>
  )
}

export default LoginByEmail