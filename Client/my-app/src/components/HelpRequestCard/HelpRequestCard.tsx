import type { FC } from 'react';
import './HelpRequestCard.scss';
import type { HelpRequest } from '../../models/helpRequest.model';

interface HelpRequestCardProps {
  request: HelpRequest;
  onClick: () => void;
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  'ממתין':  { color: '#8b5cf6', bg: '#ede9fe' },
  'בטיפול': { color: '#0ea5e9', bg: '#e0f2fe' },
  'הסתיים': { color: '#ec4899', bg: '#fce7f3' },
};

const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  'נמוכה':   { color: '#22c55e', bg: '#dcfce7', label: '🟢 נמוכה' },
  'בינונית': { color: '#f59e0b', bg: '#fef3c7', label: '🟡 בינונית' },
  'גבוהה':   { color: '#f97316', bg: '#ffedd5', label: '🔴 גבוהה' },
  'קריטית':  { color: '#ef4444', bg: '#fee2e2', label: '🚨 קריטית' },
};

const HelpRequestCard: FC<HelpRequestCardProps> = ({ request, onClick }) => {
  const p = priorityConfig[request.priority] ?? { color: '#3498db', bg: '#e8f4fd', label: request.priority };
  const s = statusConfig[request.status] ?? { color: '#94a3b8', bg: '#f1f5f9' };

  return (
    <div
      className='help-request-card'
      onClick={onClick}
      style={{ borderRightColor: s.color }}
    >
      <div className='card-header'>
        <span
          className='priority'
          style={{ color: p.color, background: p.bg }}>
          {p.label}
        </span>
        <span className='city'>{request.location.city}</span>
      </div>
      <p className='description'>{request.description}</p>
      <div className='card-footer'>
        <span className='phone'>{request.phone}</span>
        <span className='status' style={{ color: s.color, background: s.bg }}>{request.status}</span>
      </div>
    </div>
  );
};

export default HelpRequestCard;