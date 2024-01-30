import React from 'react'
import "./homepage.css"
import { useContext } from 'react'
import { AuthContext } from '../main'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Homepage = () => {
  const auth=useContext(AuthContext)

  return (
    <div className="home">
      <nav>
    {auth.auth == null ? (
        <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/forgot-password">Forgot Password</Link>
            <Link to="/login-link">Login by Email</Link>
        </>
    ) : (
        <>
            <Link to="/verify-account">Verify Account</Link>
            <Link to="/delete-account">Delete Account</Link>
            <Link to="/change-password">Change Password</Link>
        </>
    )}
</nav>
    </div>
  )
}

export default Homepage