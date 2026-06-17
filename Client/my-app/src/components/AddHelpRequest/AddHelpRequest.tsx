import { useState, useCallback, type FC } from 'react';
import './AddHelpRequest.scss';
import api from '../../api';
import type { HelpRequest } from '../../models/helpRequest.model';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface AddHelpRequestProps {
  onSuccess: () => void;
}

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; duration: number; }
let toastCounter = 0;

const priorityMeta: Record<string, { color: string; icon: string }> = {
  'נמוכה':  { color: '#22c55e', icon: '↓' },
  'בינונית':{ color: '#f59e0b', icon: '→' },
  'גבוהה':  { color: '#f97316', icon: '↑' },
  'קריטית': { color: '#ef4444', icon: '‼' },
};

const AddHelpRequest: FC<AddHelpRequestProps> = ({ onSuccess }) => {
  const priorityOption = ['נמוכה', 'בינונית', 'גבוהה', 'קריטית'];
  const [isAdd, setIsAdd] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastCounter;
    const duration = type === 'success' ? 2000 : 4000;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const validationSchema = Yup.object({
    description: Yup.string().required('חובה למלא תיאור').min(10, 'לפחות 10 תווים'),
    phone: Yup.string().required('חובה למלא טלפון').matches(/^05\d[-]?\d{7}$/, 'פורמט סלולרי לא תקין'),
    numberOfPeopleStranded: Yup.number().required('חובה למלא').min(1, 'לפחות אדם אחד'),
    location: Yup.object({
      city: Yup.string().required('חובה למלא עיר'),
      details: Yup.string().required('חובה למלא פירוט'),
    })
  });

  const formik = useFormik<HelpRequest>({
    initialValues: {
      _id: '', description: '', phone: '',
      numberOfPeopleStranded: 0,
      location: { city: '', details: '' },
      priority: priorityOption[0],
      status: 'ממתין', volunteerId: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/helpRequest', values);
        addToast('הבקשה נשמרה בהצלחה! 🙏', 'success');
        formik.resetForm();
        setIsAdd(false);
        onSuccess();
      } catch {
        addToast('שגיאה בשמירת הבקשה, נסה שנית', 'error');
      }
    }
  });

  const close = () => { setIsAdd(false); formik.resetForm(); };
  const selectedPriority = formik.values.priority;

  return (
    <>
      {/* Toasts */}
      <div className="ahr-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`ahr-toast ahr-toast--${t.type}`} style={{ '--toast-duration': `${t.duration}ms` } as React.CSSProperties}>
            <span className="ahr-toast-icon">
              {t.type === 'success' && '✓'}{t.type === 'error' && '✕'}{t.type === 'info' && 'ℹ'}
            </span>
            <span className="ahr-toast-msg">{t.message}</span>
            <div className="ahr-toast-bar" />
          </div>
        ))}
      </div>

      <div className="AddHelpRequest">
        <button onClick={() => setIsAdd(true)} className="open-form-btn">
          <span className="open-form-btn__icon">+</span>
          <span>בקשת עזרה חדשה</span>
        </button>

        {isAdd && (
          <div className="modal-overlay" onClick={close}>
            <form onSubmit={formik.handleSubmit} className="request-form" onClick={e => e.stopPropagation()}>

              <div className="form-header">
                <div className="form-header__badge">SOS</div>
                <div>
                  <h3>בקשת עזרה</h3>
                  <p className="form-header__sub">מלא את הפרטים ונעזור בהקדם</p>
                </div>
                <button type="button" className="form-close" onClick={close} aria-label="סגור">✕</button>
              </div>

              <div className="form-grid">

                <div className="form-group full">
                  <label htmlFor="description">
                    <span className="label-icon">📝</span> תיאור הבקשה
                  </label>
                  <textarea
                    id="description" name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder="תאר את המצב בפירוט..."
                  />
                  {formik.touched.description && formik.errors.description &&
                    <div className="err">{formik.errors.description}</div>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phone"><span className="label-icon">📱</span> טלפון</label>
                  <input id="phone" type="tel" name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder="05X-XXXXXXX" />
                  {formik.touched.phone && formik.errors.phone &&
                    <div className="err">{formik.errors.phone}</div>}
                </div>

                {/* Number of people */}
                <div className="form-group">
                  <label htmlFor="numberOfPeopleStranded"><span className="label-icon">👥</span> מספר אנשים</label>
                  <input id="numberOfPeopleStranded" type="number" name="numberOfPeopleStranded"
                    value={formik.values.numberOfPeopleStranded || ''}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    min="0" placeholder="0" />
                  {formik.touched.numberOfPeopleStranded && formik.errors.numberOfPeopleStranded &&
                    <div className="err">{formik.errors.numberOfPeopleStranded}</div>}
                </div>

                {/* City */}
                <div className="form-group">
                  <label htmlFor="location.city"><span className="label-icon">🏙</span> עיר</label>
                  <input id="location.city" type="text" name="location.city"
                    value={formik.values.location.city}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder="שם העיר" />
                  {formik.touched.location?.city && formik.errors.location?.city &&
                    <div className="err">{formik.errors.location.city}</div>}
                </div>

                {/* Location details */}
                <div className="form-group">
                  <label htmlFor="location.details"><span className="label-icon">📍</span> פירוט מיקום</label>
                  <input id="location.details" type="text" name="location.details"
                    value={formik.values.location.details}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder="רחוב, מספר, קומה..." />
                  {formik.touched.location?.details && formik.errors.location?.details &&
                    <div className="err">{formik.errors.location.details}</div>}
                </div>

                <div className="form-group full">
                  <label><span className="label-icon">⚡</span> רמת דחיפות</label>
                  <div className="priority-pills">
                    {priorityOption.map(opt => (
                      <button
                        key={opt} type="button"
                        className={`priority-pill ${selectedPriority === opt ? 'active' : ''}`}
                        style={{ '--pill-color': priorityMeta[opt].color } as React.CSSProperties}
                        onClick={() => formik.setFieldValue('priority', opt)}
                      >
                        <span className="priority-pill__icon">{priorityMeta[opt].icon}</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? <span className="ahr-spinner" /> : <>שמור בקשה</>}
                </button>
                <button type="button" className="cancel-btn" onClick={close}>ביטול</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default AddHelpRequest;