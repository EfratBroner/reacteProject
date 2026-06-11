import { useState, type FC } from 'react';
import './AddHelpRequest.scss';
import api from '../../api';
import type { HelpRequest } from '../../models/helpRequest.model';
import { useFormik } from 'formik';

interface AddHelpRequestProps {
  onSuccess: () => void;
}

const AddHelpRequest: FC<AddHelpRequestProps> = ({ onSuccess }) => {
  const priorityOption: string[] = ['נמוכה', 'בינונית', 'גבוהה', 'קריטית'];
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const formik = useFormik<HelpRequest>({
    initialValues: {
      description: '',
      phone: '',
      numberOfPeopleStranded: 0,
      location: { city: '', details: '' },
      priority: priorityOption[0],
      status: { _id: 1, status: 'ממתין' },
      volunteerId: ''
    },
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
                <textarea name="description" value={formik.values.description} onChange={formik.handleChange} required />
              </div>

              <div className="form-group">
                <label>מספר טלפון:</label>
                <input type="tel" name="phone" value={formik.values.phone} onChange={formik.handleChange} required />
              </div>

              <div className="form-group">
                <label>מספר אנשים:</label>
                <input type="number" name="numberOfPeopleStranded" value={formik.values.numberOfPeopleStranded || ''} onChange={formik.handleChange} min="0" required />
              </div>

              <div className="form-group">
                <label>עיר:</label>
                <input type="text" name="location.city" value={formik.values.location.city} onChange={formik.handleChange} required />
              </div>

              <div className="form-group">
                <label>פירוט מיקום:</label>
                <input type="text" name="location.details" value={formik.values.location.details} onChange={formik.handleChange} required />
              </div>

              <div className="form-group full">
                <label>רמת דחיפות:</label>
                <select name="priority" value={formik.values.priority} onChange={formik.handleChange}>
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
