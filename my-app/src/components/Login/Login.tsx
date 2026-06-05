import type { FC } from 'react';
import { useState } from "react";
import './Login.scss';

interface LoginProps {}

// const Login: FC<LoginProps> = () => (
//   <div className="Login">
//     Login Component
//   </div>
// );

export default function Login(){
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    const handleSubmit=(e:any)=>{
        e.preventDefault()
        console.log(email,password)
    }
    return(
        <div className='login'>
            <form onSubmit={handleSubmit} >
                <h2>Login</h2>
                <input type="text" placeholder='email' onChange={(e)=>setEmail(e.target.value)}/><br></br>
                <input type="password" placeholder='password' onChange={(e)=>setPassword(e.target.value)}/><br></br>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

