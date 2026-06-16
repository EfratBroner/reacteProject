import { type FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './HelpRequestDetails.scss';
import type { HelpRequest } from '../../models/helpRequest.model';
import type { RootState } from '../../main';
import api from '../../api';

interface HelpRequestDetailsProps {
  request: HelpRequest;
  onBack: () => void;
}

const HelpRequestDetails: FC<HelpRequestDetailsProps> = ({ request, onBack }) => {
  const volunteer = useSelector((state: RootState) => state.volunteer.volunteer);
  const navigate = useNavigate();
  const [taken, setTaken] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [assignedVolunteerName, setAssignedVolunteerName] = useState('');

  useEffect(() => {
    const volunteerId = taken ? volunteer?._id : request.volunteerId;
    if (!volunteerId) return;
    api.get(`/volunteer/${volunteerId}`)
      .then(res => setAssignedVolunteerName(`${res.data.firstName} ${res.data.lastName}`));
  }, [request.volunteerId, taken]);

  const handleTake = async () => {
    if (!volunteer) {
      alert('עליך להתחבר תחילה');
      navigate('/login');
      return;
    }
    await api.put(`/helpRequest/${request._id}/${volunteer._id}`);
    setStatus('בטיפול');
    setTaken(true);
  };

  const handleDone = async () => {
    if (!volunteer) return;
    await api.put(`/helpRequest/${request._id}/${volunteer._id}`);
    setStatus('הסתיים');
  };

  return (
  <div className="HelpRequestDetails">
    <h2>פרטי בקשת עזרה</h2>
    {volunteer && <p>שלום, {volunteer.firstName} {volunteer.lastName}</p>}
    <div className="details-grid">
      <div className="detail-item full">
        <label>תיאור</label>
        <span>{request.description}</span>
      </div>
      <div className="detail-item">
        <label>עיר</label>
        <span>{request.location.city}</span>
      </div>
      <div className="detail-item">
        <label>פירוט מיקום</label>
        <span>{request.location.details}</span>
      </div>
      <div className="detail-item">
        <label>טלפון</label>
        <span>📞 {request.phone}</span>
      </div>
      <div className="detail-item">
        <label>מספר תקועים</label>
        <span>👥 {request.numberOfPeopleStranded}</span>
      </div>
      <div className="detail-item">
        <label>דחיפות</label>
        <span className={`priority-badge ${request.priority}`}>{request.priority}</span>
      </div>
      <div className="detail-item">
        <label>סטטוס</label>
        <span className="status-badge">{status}</span>
        {status !== 'ממתין' && assignedVolunteerName && <span>{assignedVolunteerName}</span>}
      </div>
    </div>
    <div className="actions">
      <button className="back-btn" onClick={onBack}>→ חזור לרשימה</button>
      <div className="volunteer-action">
        {status === 'ממתין' && (
          <button className={`take-btn ${taken ? 'taken' : ''}`} onClick={handleTake}>
            {taken ? '✔ ההתנדבות עלי!' : 'ההתנדבות עלי!'}
          </button>
        )}
        {status === 'בטיפול' && (
          <button
            className="done-btn"
            onClick={handleDone}
            disabled={!taken && volunteer?._id !== request.volunteerId}
          >
            סיימתי
          </button>
        )}
      </div>
    </div>
  </div>
  );
};

export default HelpRequestDetails;
