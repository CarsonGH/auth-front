import React from 'react'
import { useRef, useState, useContext } from 'react'
import { AuthContext } from '../main'
import Spinner from '../components/spinner'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
const ResetPassword = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const resetToken = searchParams.get("token")

    const auth=useContext(AuthContext)

    const newPassword = useRef()
    const repeatNewPassword = useRef()
    const [passwordReset, setPasswordReset]=useState()

    const[showPassword,setShowPassword]=useState(false)

    const [linkChecked, setLinkChecked] = useState(false)
    const [linkValid, setLinkValid] = useState(false)

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

    useEffect(()=>{
        console.log("verifying reset link in use Effect")
        //Check For Query String
        if (resetToken=="" || resetToken==null){
            console.log("resetToken is null or blank",resetToken)
            setLinkChecked(true)
            setLinkValid(false)
            return
        }
        auth.authActions.verifyResetLink(resetToken).then(()=>{
            setLinkValid(true)
        }).catch(()=>{
            setLinkValid(false)
        }).finally(()=>{
            setLinkChecked(true)
        })
    },[])

    const resetPassword=(e)=>{
        e.preventDefault()
        //validate form
        if (newPassword.current.value=="" || newPassword.current.value.length<8){
            showError("Password must be at least 8 characters long")
            newPassword.current.focus()
            return
        }
        if (newPassword.current.value.length>256){
            showError("Password must be shorter than 256 characters long")
            newPassword.current.focus()
            return
        }
        if (newPassword.current.value!=repeatNewPassword.current.value){
            showError("Repeat new password must match with new password")
            repeatNewPassword.current.focus()
            return
        }


        setLoading(true)

        auth.authActions.resetPassword({
            "resetToken":resetToken,
            "password":newPassword.current.value,
        }).then(()=>{
            setPasswordReset(true)
        }).catch((err)=>{
            showError(String(err))
        }).finally(()=>{
            setLoading(false)
        })
    }

    return (
        <>
        <div className="text1">Reset Password</div>
        <div><br/><br/></div>
        {!passwordReset?
        <>
        {!linkChecked ? <Spinner/>:
        <>
        {linkValid?
        <form onSubmit={!passwordReset?resetPassword:(e)=>{e.preventDefault()}}>
        <div className="input">
          <img src="/assets/unlock.svg" className="input-icon"/>
          <input ref={newPassword} placeholder="New Password" type={showPassword ? "text" : "password"} />
          <button className="input-icon cursor-pointer" type="button" onClick={()=>{setShowPassword(!showPassword)}} ><img src="/assets/viewpass.svg"/></button>
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
        :
        <>
        <div className='errorText'>Link Not Valid!</div>
        <div> Check for a Newer Email or Request a New Link </div>
        <div>Remember to check in your spam folder!</div>
        <Link className='page-button button1' to="/forgot-password">Request New Link</Link>
        </>
        }
        </>
        }
        </>
        :
        <div>Password Has Been Reset Successfully</div>
        }
        <div className="line-break" />
        <br/>
        <br/>
        <Link to="/login" className='password-reset' ><div className="text3">Login?</div></Link>
        </>
      )
}

export default ResetPassword