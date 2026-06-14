import { useState } from "react";
import './Login.scss';
import api from '../../api';

interface LoginProps {
    onLoginSuccess: (password: string, email: string) => void;
    onNavigateToRegister: () => void;
    onClose: () => void;
}

export default function Login({ onLoginSuccess, onNavigateToRegister, onClose }: LoginProps) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await api.post('/volunteer/findByEmail', { email, password });
        const result = response.data;

        if (!result.success && result.message === "האימייל לא קיים") {
            setError("האימייל לא קיים במערכת, מעביר להרשמה...");
            alert("האימייל לא קיים במערכת, מועבר לדף ההרשמה");
            onNavigateToRegister();
            return;
        }
        if (!result.success) {
            setError("הסיסמא שגויה");
            return;
        }

        setError("התחברות הצליחה");
        onLoginSuccess(password, email);
    };

    const handleForgotPassword = async () => {
        if (!email) return;
        try {
            const response = await api.post('/volunteer/forgot-password', { email });
            if (response.data.success) {
                setSuccessMessage("סיסמה חדשה נשלחה לתיבת המייל שלך!");
                setError("");
                setPassword("");
            } else {
                setError(response.data.message || "אירעה שגיאה בשליחת המייל");
            }
        } catch (err) {
            setError("אירעה שגיאה בשליחת המייל, נסה שנית");
        }
    };

    return (
        <div className='login-overlay' onClick={onClose}>
            <div className='login-modal' onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2>התחברות</h2>
                    <input type="text" placeholder='אימייל' onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='סיסמה' value={password} onChange={(e) => setPassword(e.target.value)} />
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