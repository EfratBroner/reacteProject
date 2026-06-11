import { useEffect, useState, type FC } from 'react';
import './HelpRequestList.scss';
import api from '../../api';
import type { HelpRequest } from '../../models/helpRequest.model';
import HelpRequestCard from '../HelpRequestCard/HelpRequestCard';

interface HelpRequestListProps {
  requests: HelpRequest[];
}

const HelpRequestList: FC<HelpRequestListProps> = ({ requests }) => {

  return (
    <div className="HelpRequestList">
      <ul>
        {requests.map((r, index) => (
          <HelpRequestCard key={index} request={r} />
        ))}
      </ul>
    </div>

  )
}

export default HelpRequestList;
