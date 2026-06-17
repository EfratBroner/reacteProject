import { type FC, useState, useEffect, useMemo } from 'react';
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

const priorityColor: Record<string, string> = {
  קריטית: '#f87171',
  גבוהה: '#fb923c',
  בינונית: '#facc15',
  נמוכה: '#4ade80',
};

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

  const cardStyle = useMemo(() => {
    return { 
      '--priority-color': priorityColor[request.priority] 
    } as React.CSSProperties;
  }, [request.priority]); 

  return (
    <div className="HelpRequestDetails" style={cardStyle}>
      <div className="mission-header">
        <div className="mission-label">בקשת התנדבות</div>
        <h2>פרטי המשימה</h2>
      </div>

      <div className="mission-body">
        <div className="description-block">
          <div className="block-label">תיאור הבקשה</div>
          <p>{request.description}</p>
        </div>

        <div className="info-grid">
          <div className="info-cell">
            <span className="cell-icon">📍</span>
            <span className="cell-label">עיר</span>
            <span className="cell-value">{request.location.city}</span>
          </div>
          <div className="info-cell">
            <span className="cell-icon">🗺️</span>
            <span className="cell-label">פירוט מיקום</span>
            <span className="cell-value">{request.location.details}</span>
          </div>
          <div className="info-cell">
            <span className="cell-icon">📞</span>
            <span className="cell-label">טלפון</span>
            <span className="cell-value">{request.phone}</span>
          </div>
          <div className="info-cell">
            <span className="cell-icon">👥</span>
            <span className="cell-label">מספר תקועים</span>
            <span className="cell-value">{request.numberOfPeopleStranded}</span>
          </div>
        </div>

        <div className="status-row">
          <span className="row-label">דחיפות</span>
          <span className={`priority-badge ${request.priority}`}>{request.priority}</span>
          <span className="row-label" style={{ marginRight: '12px' }}>סטטוס</span>
          <span className="status-badge">{status}</span>
          {status !== 'ממתין' && assignedVolunteerName && (
            <span className="assigned-name">מטפל: {assignedVolunteerName}</span>
          )}
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
              סיימתי ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpRequestDetails;
