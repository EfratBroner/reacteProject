import type { FC } from 'react';
import { useEffect, useState } from "react";
import './Login.scss';
import type { Volunteer } from '../../models/volunteer.model';
import api from '../../api';
import Register from '../Register/Register';

interface LoginProps {}

export default function Login(){
    const [showRegister, setShowRegister] = useState(false);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([])
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")
    const [successMessage,setSuccessMessage]=useState("")


    const handleSubmit=(e:any)=>{
        e.preventDefault()
        const volunteer = volunteers.find(v => v.email === email)
        if(!volunteer){
            setError("האימייל לא קיים במערכת")
            return
        }
        if(volunteer.password !== password){
            setError("הסיסמא שגויה")
            return
        }
        setError("התחברות הצליחה")
        console.log("התחברות הצליחה", volunteer)
    }

    const handleForgotPassword = async () => {
        const volunteer = volunteers.find(v => v.email === email);
        
        if (!volunteer) 
          return;
        try {
            await api.post('/volunteer/forgot-password', {
                id: volunteer._id,
                email: volunteer.email
            });
            setSuccessMessage("סיסמה חדשה נשלחה לתיבת המייל שלך!");
            setError(""); 
        } catch (err) {
            setError("אירעה שגיאה בשליחת המייל, נסה שנית");
        }
    }

    useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/volunteer')
      setVolunteers(response.data as Volunteer[])
    }
    fetchData()
  }, [])

    return(
        <div className='login'>
            <form onSubmit={handleSubmit} >
                <h2>התחברות</h2>
                <input type="text" placeholder='email' onChange={(e)=>setEmail(e.target.value)}/><br></br>
                <input type="password" placeholder='password' onChange={(e)=>setPassword(e.target.value)}/><br></br>
                {error && <p style={{color:'red'}}>{error}</p>}
                {error && error === "האימייל לא קיים במערכת" && <button onClick={() => setShowRegister(true)}>להרשמה</button>}
                {showRegister && <Register />}
                {error && error === "הסיסמא שגויה" && (
                    <p className="forgot-password" style={{cursor: 'pointer', color: 'blue'}} onClick={handleForgotPassword}>
                        שכחתי סיסמא
                    </p>
                )}
                <button type='submit'>התחברות</button>
            </form>
        </div>
    )
}

