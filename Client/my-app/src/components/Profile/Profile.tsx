import type { FC } from 'react';
import { useState } from 'react';
import './Profile.scss';
import type { Volunteer } from '../../models/volunteer.model';
import api from '../../api';

interface ProfileProps {
  volunteer: Volunteer;
  onClose: () => void;
}

const Profile: FC<ProfileProps> = ({ volunteer, onClose }) => {
  const [firstName, setFirstName] = useState(volunteer.firstName);
  const [lastName, setLastName] = useState(volunteer.lastName);
  const [phone, setPhone] = useState(volunteer.phone);
  const [specialties, setSpecialties] = useState(volunteer.specialties.join(', '));
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      await api.post('/volunteer/forgot-password', { id: volunteer._id, email: volunteer.email });
      setSuccessMessage('סיסמה חדשה נשלחה לתיבת המייל שלך!');
    } catch (err) {
      setSuccessMessage('אירעה שגיאה, נסה שנית');
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/volunteer/${volunteer._id}`, {
        firstName, lastName, phone, specialties: specialties.split(',')
      });
      setSuccessMessage('הפרטים נשמרו בהצלחה!');
    } catch (err) {
      setSuccessMessage('אירעה שגיאה בשמירה, נסה שנית');
    }
  };
  return (
    <div className='register-overlay' onClick={onClose}>
      <div className='register-modal' onClick={e => e.stopPropagation()}>
        <h2>הפרופיל שלי</h2>
        <div className='profile-fields'>
          <label>שם פרטי<input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} /></label>
          <label>שם משפחה<input type="text" value={lastName} onChange={e => setLastName(e.target.value)} /></label>
          <label>אימייל<input type="text" value={volunteer.email} readOnly /></label>
          <label>טלפון<input type="text" value={phone} onChange={e => setPhone(e.target.value)} /></label>
          <label>התמחויות (יש להפריד התמחויות בפסיקים)<input type="text" value={specialties} onChange={e => setSpecialties(e.target.value)} /></label>
        </div>
        {successMessage && <p className='modal-success'>{successMessage}</p>}
        <button className='modal-submit' onClick={handleResetPassword}>עדכון סיסמא</button>
        <button className='modal-submit' onClick={handleSave}>שמירה</button>
      </div>
    </div>
  );
};

export default Profile;
