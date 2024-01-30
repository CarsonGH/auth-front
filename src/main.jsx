import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { useCreateAuth } from './components/authembed/AuthEmbed.jsx'


const [AuthProvider, AuthContext]= useCreateAuth("https://carsonshort.com/auth")
//const [AuthProvider, AuthContext]= useCreateAuth("http://localhost:8080")

export {AuthContext};
ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
    <App />
    </AuthProvider>
)
