import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { AuthContext } from '../main';

const Stats = ({}) => {
  const auth = useContext(AuthContext)

  const setLoginData=()=>{
    const data ={
      "username": "bob",
      "email": "bob@gmail.com",
      "expiry": (new Date().getTime()) + (60 * 60),
      "isverified":0
      }
    auth.setAuth(data)
      localStorage.setItem('user_data', JSON.stringify(data));
  }
      

  const [showStats, setShowStats]=useState(false)

  return (
    <>
    {showStats?
        <div className="top-stats">
          <div className={"logstate "+(auth.auth ? "logged-in":"logged-out")}>
              {(auth.auth ?
                <>
                  <div>Username:{auth.auth.username}</div>
                  <div>Expiry Date:{new Date(auth.auth.expiry * 1000).toDateString()}</div>
                  <div>Current Date:{new Date().toDateString()}</div>
                  <div>Verified State:{auth.auth.isverified}</div>
                  <div>Email:{auth.auth.email}</div>
                  <u>Auth Token:</u> {auth.auth.auth_token && auth.auth.auth_token}

                </>
                :
                "logged-out")}
          </div>
          <div>
            <button className="button" onClick={() => {setLoginData()}}> Login</button>
            <button className="button" onClick={()=>{auth.authActions.logout()}}>Logout</button>
          </div>
          {auth.auth &&
          <div>
          <button className="button" onClick={()=>{auth.setAuth(prev => ({...prev, "isverified": 1}));}}>Verify Account</button>
          <button className="button" onClick={()=>{auth.setAuth(prev => ({...prev, "isverified": 0}));}}>Unverify Account</button>
          </div>
          }
          <div>
          <button className="button" onClick={()=>{console.log(" auth.auth:",auth.auth)}}>Console Log</button>
          <button className="button" onClick={()=>{setShowStats(0)}}>Hide Stats</button>
          </div>
        </div>
        :<button  className={"float-blob "+ (auth.auth && "fb-active")}  onClick={()=>{setShowStats(1)}} > Stats</button>}
    </>
  )
}

export default Stats