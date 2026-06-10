import type { FC } from 'react';
import './HelpRequestCard.scss';
import type { HelpRequest } from '../../models/helpRequest.model';

interface HelpRequestCardProps {
  request: HelpRequest;
}

const HelpRequestCard: FC<HelpRequestCardProps> = ({ request }) => {
  return (
    <div className='help-request-card'>
      <div className='card-header'>
        <span className='priority'>{request.priority.namePriority}</span>
        <span className='city'>{request.location.city}</span>
      </div>
      <p className='description'>{request.description}</p>
      <div className='card-footer'>
        <span className='phone'>{request.phone}</span>
        <span className='people'>{request.numberOfPeopleStranded} תקועים</span>
      </div>
    </div>
  );
};

export default HelpRequestCard;
