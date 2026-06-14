import { useState, type FC } from 'react';
import './AddHelpRequest.scss';
import api from '../../api';
import type { HelpRequest } from '../../models/helpRequest.model';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface AddHelpRequestProps {
  onSuccess: () => void;
}

const AddHelpRequest: FC<AddHelpRequestProps> = ({ onSuccess }) => {
  const priorityOption: string[] = ['נמוכה', 'בינונית', 'גבוהה', 'קריטית'];
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const validationSchema = Yup.object({
    description: Yup.string()
      .required('חובה למלא תיאור לבקשה')
      .min(10, 'התיאור חייב להכיל לפחות 10 תווים'),
    phone: Yup.string()
      .required('חובה למלא מספר טלפון')
      .matches(/^05\d[-]?\d{7}$/, 'מספר הטלפון אינו תקין (חייב להיות פורמט סלולרי ישראלי)'),
    numberOfPeopleStranded: Yup.number()
      .required('חובה למלא מספר אנשים')
      .min(1, 'מספר האנשים חייב להיות לפחות 1'),
    location: Yup.object({
      city: Yup.string().required('חובה למלא עיר'),
      details: Yup.string().required('חובה למלא פירוט מיקום'),
    })
  });

  const formik = useFormik<HelpRequest>({
    initialValues: {
      description: '',
      phone: '',
      numberOfPeopleStranded: 0,
      location: { city: '', details: '' },
      priority: priorityOption[0],
      status: 'ממתין',
      volunteerId: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/helpRequest', values);
        alert('הבקשה נשמרה בהצלחה!');
        formik.resetForm();
        setIsAdd(false);
        onSuccess();
      } catch (error) {
        console.error("שגיאה בשמירת הבקשה בשרת:", error);
        alert('חלה שגיאה בשמירה.');
      }
    }
  });

  const close = () => { setIsAdd(false); formik.resetForm(); };

  return (
    <div className="AddHelpRequest">
      <button onClick={() => setIsAdd(true)} className="open-form-btn">הוספת בקשת עזרה</button>

      {isAdd && (
        <div className="modal-overlay" onClick={close}>
          <form onSubmit={formik.handleSubmit} className="request-form" onClick={e => e.stopPropagation()}>
            <h3>מילוי פרטי בקשה</h3>
            <div className="form-grid">

              <div className="form-group full">
                <label>תיאור הבקשה:</label>
                <textarea name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                {formik.touched.description && formik.errors.description ? (
                  <div className="error-message">{formik.errors.description}</div>
                ) : null}
              </div>

              <div className="form-group">
                <label>מספר טלפון:</label>
                <input type="tel" name="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="error-message">{formik.errors.phone}</div>
                ) : null}
              </div>

              <div className="form-group">
                <label>מספר אנשים:</label>
                <input type="number" name="numberOfPeopleStranded" value={formik.values.numberOfPeopleStranded || ''} onChange={formik.handleChange} onBlur={formik.handleBlur} min="0" />
                {formik.touched.numberOfPeopleStranded && formik.errors.numberOfPeopleStranded ? (
                  <div className="error-message">{formik.errors.numberOfPeopleStranded}</div>
                ) : null}              </div>

              <div className="form-group">
              <label>עיר:</label>
                <input type="text" name="location.city" value={formik.values.location.city} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.location?.city && formik.errors.location?.city ? (
                  <div className="error-message">{formik.errors.location.city}</div>
                ) : null}
                </div>

              <div className="form-group">
                <label>פירוט מיקום:</label>
                <input type="text" name="location.details" value={formik.values.location.details} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.location?.details && formik.errors.location?.details ? (
                  <div className="error-message">{formik.errors.location.details}</div>
                ) : null}
                 </div>

              <div className="form-group full">
                <label>רמת דחיפות:</label>
                <select name="priority" value={formik.values.priority} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                  {priorityOption.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">שמור בקשה</button>
              <button type="button" className="cancel-btn" onClick={close}>ביטול</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddHelpRequest;
