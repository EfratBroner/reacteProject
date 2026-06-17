import type { FC } from 'react';
import './HelpRequestCard.scss';
import type { HelpRequest } from '../../models/helpRequest.model';

interface HelpRequestCardProps {
  request: HelpRequest;
  onClick: () => void;
}

// התאמת צבעי הסטטוסים לגרסת הניאון החדשה (שילוב של צבע זוהר ורקע שקוף למחצה)
const statusConfig: Record<string, { color: string; bg: string }> = {
  'ממתין':  { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)' },
  'בטיפול': { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  'הסתיים': { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)' },
};

// התאמת צבעי הדחיפויות לטון הזוהר והקריא
const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  'נמוכה':   { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', label: '🟢 נמוכה' },
  'בינונית': { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', label: '🟡 בינונית' },
  'גבוהה':   { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', label: '🔴 גבוהה' },
  'קריטית':  { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.18)', label: '🚨 קריטית' },
};

const HelpRequestCard: FC<HelpRequestCardProps> = ({ request, onClick }) => {
  const p = priorityConfig[request.priority] ?? { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', label: request.priority };
  const s = statusConfig[request.status] ?? { color: '#94a3b8', bg: 'rgba(255, 255, 255, 0.05)' };

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