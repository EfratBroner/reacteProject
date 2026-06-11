import type { FC } from 'react';
import { useEffect, useState } from "react";
import './Login.scss';
import type { Volunteer } from '../../models/volunteer.model';
import api from '../../api';

interface LoginProps {
    onLoginSuccess: (password: string) => void;
    onNavigateToRegister: () => void;
    onClose: () => void;
}

export default function Login({ onLoginSuccess, onNavigateToRegister, onClose }: LoginProps) {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const volunteer = volunteers.find(v => v.email === email);

        if (!volunteer) {
            setError("האימייל לא קיים במערכת, מעביר להרשמה...");
            alert("האימייל לא קיים במערכת, מועבר לדף ההרשמה");
            onNavigateToRegister(); // עכשיו זה יעבוד מצוין
            return;
        }
        if (volunteer.password !== password) {
            setError("הסיסמא שגויה");
            return;
        }

        setError("התחברות הצליחה");
        console.log("התחברות הצליחה", volunteer);
        onLoginSuccess(volunteer.password);
    };

    const handleForgotPassword = async () => {
        const volunteer = volunteers.find(v => v.email === email);
            console.log(volunteer); // ← הוסף כאן


        if (!volunteer) return;
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
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get('/volunteer');
            setVolunteers(response.data as Volunteer[]);
        };
        fetchData();
    }, []);

    return (
        <div className='login-overlay' onClick={onClose}>
            <div className='login-modal' onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>התחברות</h2>
                    <input type="text" placeholder='אימייל' onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='סיסמה' onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className='modal-error'>{error}</p>}
                    {successMessage && <p className='modal-success'>{successMessage}</p>}
                    {error && error.includes("האימייל לא קיים") && (<button type="button" className='modal-link' onClick={onNavigateToRegister}>עבור להרשמה</button>)}
                    {error === "הסיסמא שגויה" && (<span className="forgot-password" onClick={handleForgotPassword}>שכחתי סיסמה</span>)}
                    <button type='submit' className='modal-submit'>התחברות</button>
                </form>
            </div>
        </div>
    );
}