import React from 'react'
import { useRef } from 'react'
import Spinner from '../components/spinner'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../main'
import { useState } from 'react'

const DeleteAccountPage = ({setShowPassword, showPassword}) => {
  const auth=useContext(AuthContext)  
  const password=useRef()
  const repeatPassword=useRef()
  const [loading, setLoading] = useState(false)
  const [anError, setAnError] = useState("")
  const ShowError=async(err)=>{
    setAnError(err)
    setTimeout(()=>{setAnError("")},5000)
  }

  const deleteAccount=(e)=>{
    e.preventDefault()
    if (loading){return}
    setLoading(true)

    if (password.current.value==""){
      ShowError("Must Enter Password")
      password.current.focus()
      setLoading(false)
      return
    }
    if (repeatPassword.current.value==""){
      ShowError("Must Repeat Password")
      repeatPassword.current.focus()
      setLoading(false)
      return
    }
    if( password.current.value!=repeatPassword.current.value){
      ShowError("Passwords Don't Match")
      repeatPassword.current.focus()
      setLoading(false)
      return
    }
      
  const del=window.confirm("Are you sure you want to delete account? \nTHIS ACTION IS PERMANENT!!")
  if (!del){
      console.log("account stopped from being deleted")
      setLoading(0)
      return
  }
  const jsonData={
    "password":password.current.value,
    "auth_token":auth.auth.auth_token
  };
  auth.authActions.deleteAccount(jsonData).then(()=>{
    setLoading(false)
    return
  }).catch(err=>{
    ShowError(err)
    setLoading(false)``
    return
  })
  }



  return (
    <>
      <div className="text1 textcenter">Delete Your Account</div>
      <div className="line-break" />
      <form onSubmit={(e)=>deleteAccount(e)}>
        <div className="input">
            <img src="/assets/unlock.svg" className="input-icon"/>
            <input ref={password} placeholder="Password" type={showPassword ? "text" : "password"}/>
            <button  className="input-icon cursor-pointer" onClick={()=>{setShowPassword(!showPassword)}} ><img src="/assets/viewpass.svg"/></button>
        </div>
        <div className="input">
            <img src="/assets/unlock.svg" className="input-icon"/>
            <input ref={repeatPassword} placeholder="Repeat Password" type={showPassword ? "text" : "password"}/>
        </div>
        <span className='errorText'>{anError}</span>
        <div className="textcenter text3">Clicking this button will PERMANENTLY delete your account there is NO way to restore this account once this deletion has been completed, your account and all data associated with your account will be removed!</div>
        <button className="page-button button1" >Delete Account</button>
        <Link to="/">Home</Link>
      </form>
  </>
)
}

export default DeleteAccountPage