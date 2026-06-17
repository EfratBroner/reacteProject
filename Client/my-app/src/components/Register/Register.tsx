import type { FC } from 'react';
import './Register.scss';
import { useState, useEffect, useCallback } from "react";
import api from '../../api';
import type { Volunteer } from '../../models/volunteer.model';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface RegisterProps {
  onRegisterSuccess: (volunteer: Volunteer) => void;
  onNavigateToLogin: () => void;
  onClose: () => void;
  volunteer: Volunteer | null;
}

interface RegisterFormValues {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialties: string;
}

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastCounter = 0;

export default function Register({ onRegisterSuccess, onClose, onNavigateToLogin, volunteer }: RegisterProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/volunteer');
        setVolunteers(response.data as Volunteer[]);
      } catch (error) {
        console.error("שגיאה בטעינת מתנדבים:", error);
      }
    };
    fetchData();
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('חובה למלא שם פרטי').min(2, 'לפחות 2 אותיות'),
    lastName: Yup.string().required('חובה למלא שם משפחה').min(2, 'לפחות 2 אותיות'),
    email: Yup.string().required('חובה למלא אימייל').email('כתובת האימייל אינה תקינה'),
    phone: Yup.string().required('חובה למלא טלפון').matches(/^05\d[-]?\d{7}$/, 'פורמט סלולרי לא תקין'),
    specialties: Yup.string().required('חובה למלא לפחות התמחות אחת'),
  });

  const handleResetPassword = async () => {
    if (!volunteer) return;
    const volunteerId = volunteer._id;

    try {
      setIsResettingPassword(true);
      await api.post('/volunteer/forgot-password', { id: volunteerId, email: volunteer.email });
      addToast('סיסמה חדשה נשלחה לתיבת המייל שלך! ✉️', 'success');
    } catch (err) {
      console.error("שגיאה באיפוס סיסמה:", err);
      addToast('אירעה שגיאה בשליחת הסיסמה, נסה שנית', 'error');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const formik = useFormik<RegisterFormValues>({
    initialValues: { email: '', firstName: '', lastName: '', phone: '', specialties: '' },
    validationSchema,
    onSubmit: async (values) => {
      const volunteerId = volunteer?._id;

      if (volunteerId) {
        try {
          await api.put(`/volunteer/${volunteerId}`, {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            specialties: values.specialties.split(',').map(s => s.trim())
          });

          addToast('הפרטים נשמרו בהצלחה! ✨', 'success');

          const updatedVolunteer = await api.get(`/volunteer/byEmail/${values.email}`).then(r => r.data);
          setTimeout(() => {
            onRegisterSuccess(updatedVolunteer);
            handleClose();
          }, 1600);
        } catch (error) {
          console.error("שגיאה בשמירת הנתונים:", error);
          addToast('אירעה שגיאה בשמירה, נסה שנית', 'error');
        }
      } else {
        const exists = volunteers.some(v => v.email === values.email);
        if (exists) {
          addToast("המתנדב קיים — מועבר לדף ההתחברות", "info");
          setTimeout(() => onNavigateToLogin(), 1800);
          return;
        }
        try {
          await api.post('/volunteer', {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            specialties: values.specialties.split(',').map(s => s.trim())
          });
          const newVolunteer = await api.get(`/volunteer/byEmail/${values.email}`).then(r => r.data);
          formik.resetForm();
          addToast("נרשמת בהצלחה! בדוק את המייל לקבלת הסיסמה ✉️", "success");
          setTimeout(() => onRegisterSuccess(newVolunteer), 1600);
        } catch (error) {
          console.error("שגיאה בתהליך ההרשמה:", error);
          addToast("שגיאה ברישום, נסה שנית", "error");
        }
      }
    }
  });

  useEffect(() => {
    if (volunteer) {
      formik.setValues({
        firstName: volunteer.firstName || '',
        lastName: volunteer.lastName || '',
        email: volunteer.email || '',
        phone: volunteer.phone || '',
        specialties: Array.isArray(volunteer.specialties) ? volunteer.specialties.join(', ') : (volunteer.specialties || ''),
      });
    }
  }, [volunteer]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const fields = [
    { name: 'firstName' as const, label: 'שם פרטי', icon: '👤' },
    { name: 'lastName' as const, label: 'שם משפחה', icon: '👤' },
    { name: 'email' as const, label: 'אימייל', type: 'email', icon: '✉'},
    { name: 'phone' as const, label: 'טלפון', icon: '📱' },
    { name: 'specialties' as const, label: 'התמחויות (מופרדות בפסיקים)', icon: '⚡' },
  ];

  return (
    <>
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

      <div className='register-overlay' onClick={handleClose}>
        <div className='register-modal' onClick={e => e.stopPropagation()}>
          <div className="modal-glow modal-glow--top" />
          <div className="modal-glow modal-glow--bottom" />

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-header">
              <div className="modal-logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="url(#grad2)" strokeWidth="2" />
                  <path d="M16 8v8l5 3" stroke="url(#grad2)" strokeWidth="2.5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="grad2" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2>{'הרשמה'}</h2>
              <p className="modal-subtitle">{'הצטרף לצוות המתנדבים'}</p>
            </div>

            {fields.map(({ name, label, type = 'text', icon }) => (
              <div className="input-group" key={name}>
                <input
                  type={type}
                  name={name}
                  id={name}
                  placeholder=" "
                  value={formik.values[name] || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${formik.values[name] ? 'has-value' : ''} ${''}`} />
                <label htmlFor={name}>{label}</label>
                <span className="input-icon">{icon}</span>
                {formik.touched[name] && formik.errors[name] && (
                  <div className="field-error">{formik.errors[name]}</div>
                )}
              </div>
            ))} 
                <button type='submit' className='modal-submit' disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? (
                    <span className="spinner" />
                  ) : (
                    <>
                      <span>הרשמה</span>
                      <span className="btn-arrow">←</span>
                    </>
                  )}
                </button>

                <p className="login-prompt">
                  כבר יש לך חשבון?{' '}
                  <button type="button" className="modal-link" onClick={onNavigateToLogin}>
                    התחברות
                  </button>
                </p>
          
          </form>
        </div>
      </div>
    </>
  );
}