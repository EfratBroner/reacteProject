import type { FC } from 'react';
import './HelpRequestDetails.scss';
import type { HelpRequest } from '../../models/helpRequest.model';

interface HelpRequestDetailsProps {
  request: HelpRequest;
  onBack: () => void;
}

const HelpRequestDetails: FC<HelpRequestDetailsProps> = ({ request, onBack }) => (
  <div className="HelpRequestDetails">
    <h2>פרטי בקשת עזרה</h2>
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
        <span className="status-badge">{request.status}</span>
      </div>
    </div>
    <button className="back-btn" onClick={onBack}>→ חזור לרשימה</button>
  </div>
);

export default HelpRequestDetails;
