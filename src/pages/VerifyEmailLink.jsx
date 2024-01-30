import React from 'react'
import { useEffect } from 'react'
import { AuthContext } from '../main'
import { useContext } from 'react'
import { useState } from 'react'
import Spinner from '../components/spinner'

const VerifyEmailLink = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const resetToken = searchParams.get("token")

    const auth=useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(()=>{
        setLoading(true)
        if (resetToken==""||resetToken==null){
            setLoading(false)
            return
        }
        auth.authActions.verifyUser().then(
            setSuccess(true)
        ).catch(()=>{
            setSuccess(false)
        }).finally(()=>{
                setLoading(false)
        })
    },[])
  return (
    <>
    <div className="text1">Email Verification</div>
    {!loading ?
    <>
    {success ?
    <>
    <div>Succesfully Verified Account</div>
    <button className='refresh-button'><img src={"/assets/refresh.svg"}/></button>
    </>
    :
    <>
    <div className='errorText'>Invalid Verification Link</div>
    <div>Check for a more recent email, or send a new email.</div>
    <div>Dont Forget To Check Your Spam Folder!!</div>
    {auth.auth!=null ?
    <Link to="/verify-account" className='button1'>Send New Email</Link>
    :
    <></>
    }

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

export default VerifyEmailLink