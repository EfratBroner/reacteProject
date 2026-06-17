import { type FC, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api';
import type { RootState, AppDispatch } from '../../main';
import { setVolunteer } from '../../redux/slices/volunteerSlice';
import './Profile.scss';
import { useNavigate } from 'react-router-dom';

type ToastType = 'success' | 'error';
interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

let toastCounter = 0;

const Profile: FC = () => {
    const volunteer = useSelector((state: RootState) => state.volunteer.volunteer);
    const isAuthLoading = useSelector((state: any) => state.volunteer.isLoading); 
    
    const dispatch = useDispatch<AppDispatch>();
    const [toasts, setToasts] = useState<Toast[]>([]);

    const navigate = useNavigate();
  
    useEffect(() => {
        if (!isAuthLoading && !volunteer) {
            navigate('/'); 
        }
    }, [volunteer, isAuthLoading, navigate]);

    if (isAuthLoading) {
        return <div className="profile-loading">טוען נתונים...</div>;
    }

    if (!volunteer) {
        return null; 
    }

    const completedCount = volunteer?.completedRequests?.length || 0;

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = ++toastCounter;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);

    const validationSchema = Yup.object({
        firstName: Yup.string().required('חובה למלא שם פרטי').min(2, 'לפחות 2 אותיות'),
        lastName: Yup.string().required('חובה למלא שם משפחה').min(2, 'לפחות 2 אותיות'),
        phone: Yup.string().required('חובה למלא טלפון').matches(/^05\d[-]?\d{7}$/, 'פורמט סלולרי לא תקין'),
        specialties: Yup.string().required('חובה למלא לפחות התמחות אחת'),
    });

    const formik = useFormik({
        initialValues: { firstName: '', lastName: '', phone: '', specialties: '' },
        validationSchema,
        onSubmit: async (values) => {
            if (!volunteer?._id) return;
            try {
                await api.put(`/volunteer/${volunteer._id}`, {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phone: values.phone,
                    specialties: values.specialties.split(',').map(s => s.trim())
                });

                addToast('הפרטים נשמרו בהצלחה! ✨', 'success');

                const updated = await api.get(`/volunteer/byEmail/${volunteer.email}`).then(r => r.data);
                dispatch(setVolunteer(updated));
            } catch (error) {
                console.error("שגיאה בשמירה:", error);
                addToast('אירעה שגיאה בשמירה, נסה שנית', 'error');
            }
        }
    });

    useEffect(() => {
        const fetchUpdatedVolunteer = async () => {
            if (!volunteer?._id) return;
            try {
                const response = await api.get(`/volunteer/${volunteer._id}`);
                const updatedData = response.data;

                dispatch(setVolunteer(updatedData));

                formik.setValues({
                    firstName: updatedData.firstName || '',
                    lastName: updatedData.lastName || '',
                    phone: updatedData.phone || '',
                    specialties: Array.isArray(updatedData.specialties) ? updatedData.specialties.join(', ') : (updatedData.specialties || ''),
                });
            } catch (error) {
                console.error("שגיאה במשיכת נתוני פרופיל מעודכנים:", error);
            }
        };

        fetchUpdatedVolunteer();
    }, [volunteer?._id, dispatch]);

    return (
        <div className="profile-page-viewport">
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast--${t.type}`}>{t.message}</div>
                ))}
            </div>

            <div className="profile-dashboard-layout">
                <div className="dashboard-main-panel">
                    <div className="panel-title-wrapper">
                        <h2>מדדי פעילות והישגים</h2>
                        <span className="subtitle-tag">נתונים מתוך מערכת ידידים</span>
                    </div>

                    <div className="widgets-grid">
                        <div className="widget-card gauge-widget">
                            <h3>חילוצים שהסתיימו</h3>
                            <div className="gauge-outer">
                                <svg viewBox="0 0 100 50" className="gauge-svg">
                                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
                                    <path
                                        d="M 10 50 A 40 40 0 0 1 90 50"
                                        fill="none"
                                        stroke="url(#gaugeGradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray="126"
                                        strokeDashoffset={126 - (126 * Math.min(completedCount, 50)) / 50}
                                    />
                                    <defs>
                                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#22d3ee" />
                                            <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="gauge-text-overlay">
                                    <span className="huge-number">{completedCount}</span>
                                    <span className="mini-label">קריאות שנסגרו בהצלחה</span>
                                </div>
                            </div>
                            <p className="status-caption">סיימת בהצלחה {completedCount} קריאות!</p>
                        </div>

                        <div className="widget-card shelf-widget">
                            <h3>גביעים ותגים</h3>
                            <div className="trophy-room-shelf">
                                <div className="trophy-box active-trophy">
                                    <div className="icon-wrapper">🛡️</div>
                                    <span>מתנדב פעיל</span>
                                </div>

                                <div className={`trophy-box ${completedCount >= 1 ? 'active-trophy' : 'locked-trophy'}`}>
                                    <div className="icon-wrapper">🔧</div>
                                    <span>חילוץ ראשון</span>
                                </div>

                                <div className={`trophy-box ${completedCount >= 3 ? 'active-trophy' : 'locked-trophy'}`}>
                                    <div className="icon-wrapper">🔋</div>
                                    <span>מתנדב מתמיד</span>
                                </div>

                                <div className={`trophy-box cup-box ${completedCount >= 5 ? 'active-cup' : 'locked-trophy'}`}>
                                    <div className="cup-shine-effect" />
                                    <div className="icon-wrapper cup-icon">🏆</div>
                                    <span className="cup-title">אלוף החילוצים</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-side-form">
                    <div className="panel-title-wrapper">
                        <h2>עריכת פרופיל</h2>
                        <p>ניהול פרטים אישיים והתמחויות</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="side-form-element">
                        <div className="form-readonly-badge">
                            <span className="icon">✉️</span>
                            <div className="txt">
                                <label>כתובת אימייל רשומה</label>
                                <span>{volunteer?.email}</span>
                            </div>
                        </div>

                        {[
                            { name: 'firstName', label: 'שם פרטי', icon: '👤' },
                            { name: 'lastName', label: 'שם משפחה', icon: '👤' },
                            { name: 'phone', label: 'מספר טלפון', icon: '📱' },
                            { name: 'specialties', label: 'התמחויות (מופרד בפסיק)', icon: '🛠️' }
                        ].map(field => (
                            <div className="custom-input-container" key={field.name}>
                                <span className="field-icon-left">{field.icon}</span>
                                <div className="input-field-relative">
                                    <input
                                        type="text"
                                        name={field.name}
                                        id={field.name}
                                        value={(formik.values as any)[field.name]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder=" "
                                    />
                                    <label htmlFor={field.name}>{field.label}</label>
                                </div>
                                {formik.touched[field.name as keyof typeof formik.touched] && formik.errors[field.name as keyof typeof formik.errors] && (
                                    <div className="error-hint-text">{formik.errors[field.name as keyof typeof formik.errors]}</div>
                                )}
                            </div>
                        ))}

                        <div className="form-submit-row">
                            <button type="submit" className="save-btn" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? 'שומר...' : 'שמירת שינויים'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;