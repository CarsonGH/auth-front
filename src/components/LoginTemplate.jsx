import React from 'react'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'


const LoginTemplate = ({}) => {
  return (
    <div className='screen-block'>
    <div className="login">
        <div className="imgside">
          <button onClick={()=>{}}><img height="125px" src="/assets/logo.png"/></button>
        </div>
        <div className="form">
          <div className="fullwidth"><div className="xbutton-container"><Link to="/" className="xbutton">x</Link></div></div>
          <div><br/></div>
          <Outlet/>
        <br/><br/>
        </div>
    </div>
    </div>
  )
}

export default LoginTemplate