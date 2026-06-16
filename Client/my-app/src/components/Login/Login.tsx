import { useState, useEffect, useCallback } from "react";
import './Login.scss';
import api from '../../api';
import { useDispatch } from 'react-redux';
import { setVolunteer } from '../../redux/slices/volunteerSlice';
import type { AppDispatch } from '../../main';

interface LoginProps {
    onLoginSuccess: (password: string, email: string) => void;
    onNavigateToRegister: () => void;
    onClose: () => void;
}

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

let toastCounter = 0;

export default function Login({ onLoginSuccess, onNavigateToRegister, onClose }: LoginProps) {
    const dispatch = useDispatch<AppDispatch>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = ++toastCounter;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/volunteer/findByEmail', { email, password });
            const result = response.data;

            if (!result.success && result.message === "האימייל לא קיים") {
                setError("האימייל לא קיים במערכת, מעביר להרשמה...");
                addToast("האימייל לא קיים — מעביר אותך להרשמה", "info");
                setTimeout(() => onNavigateToRegister(), 1800);
                return;
            }
            if (!result.success) {
                setError("הסיסמא שגויה");
                addToast("הסיסמה שגויה, נסה שנית", "error");
                return;
            }

            setError("");
            setSuccessMessage("התחברות הצליחה!");
            addToast("ברוך הבא! התחברת בהצלחה 🎉", "success");
            dispatch(setVolunteer(result.volunteer));
            setTimeout(() => onLoginSuccess(password, email), 1200);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            addToast("הכנס כתובת אימייל קודם", "error");
            return;
        }
        try {
            const response = await api.post('/volunteer/forgot-password', { email });
            if (response.data.success) {
                setSuccessMessage("סיסמה חדשה נשלחה לתיבת המייל שלך!");
                setError("");
                setPassword("");
                addToast("סיסמה חדשה נשלחה למייל שלך ✉️", "success");
            } else {
                addToast(response.data.message || "שגיאה בשליחת המייל", "error");
            }
        } catch {
            addToast("שגיאה בשליחת המייל, נסה שנית", "error");
        }
    };

    return (
        <>
            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast--${toast.type}`}>
                        <span className="toast-icon">
                            {toast.type === 'success' && '✓'}
                            {toast.type === 'error' && '✕'}
                            {toast.type === 'info' && 'ℹ'}
                        </span>
                        <span className="toast-message">{toast.message}</span>
                        <div className="toast-progress" />
                    </div>
                ))}
            </div>

            <div className='login-overlay' onClick={onClose}>
                <div className='login-modal' onClick={e => e.stopPropagation()}>
                    {/* Decorative glow orbs */}
                    <div className="modal-glow modal-glow--top" />
                    <div className="modal-glow modal-glow--bottom" />

                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <div className="modal-logo">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <circle cx="16" cy="16" r="15" stroke="url(#grad)" strokeWidth="2"/>
                                    <path d="M10 16.5l4 4 8-8" stroke="url(#grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <defs>
                                        <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                                            <stop offset="0%" stopColor="#6366f1"/>
                                            <stop offset="100%" stopColor="#22d3ee"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h2>התחברות</h2>
                            <p className="modal-subtitle">ברוך הבא חזרה</p>
                        </div>

                        {/* Floating label inputs */}
                        <div className="input-group">
                            <input
                                type="text"
                                id="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={email ? 'has-value' : ''}
                            />
                            <label htmlFor="email">אימייל</label>
                            <span className="input-icon">✉</span>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                id="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={password ? 'has-value' : ''}
                            />
                            <label htmlFor="password">סיסמה</label>
                            <span className="input-icon">🔒</span>
                        </div>

                        {error && <p className='modal-error'>{error}</p>}
                        {successMessage && <p className='modal-success'>{successMessage}</p>}

                        {error && error.includes("האימייל לא קיים") && (
                            <button type="button" className='modal-link' onClick={onNavigateToRegister}>
                                עבור להרשמה ←
                            </button>
                        )}

                        {error === "הסיסמא שגויה" && (
                            <span className="forgot-password" onClick={handleForgotPassword}>
                                שכחתי סיסמה
                            </span>
                        )}

                        <button type='submit' className={`modal-submit ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                            {isLoading ? (
                                <span className="spinner" />
                            ) : (
                                <>
                                    <span>התחברות</span>
                                    <span className="btn-arrow">←</span>
                                </>
                            )}
                        </button>

                        <p className="register-prompt">
                            אין לך חשבון?{' '}
                            <button type="button" className="modal-link" onClick={onNavigateToRegister}>
                                הרשמה
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}