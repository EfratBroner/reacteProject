import { useState, type FC } from 'react';
import './HelpRequestList.scss';
import type { HelpRequest } from '../../models/helpRequest.model';
import HelpRequestCard from '../HelpRequestCard/HelpRequestCard';

interface HelpRequestListProps {
  requests: HelpRequest[];
}

const HelpRequestList: FC<HelpRequestListProps> = ({ requests }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const displayRequests = requests.filter(req => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchesDescription = req.description?.toLowerCase().includes(query);
    const matchesCity = req.location?.city?.toLowerCase().includes(query);
    const matchesDetails = req.location?.details?.toLowerCase().includes(query);
    const matchesPhone = req.phone?.includes(query);
    const matchesPriority = req.priority?.toLowerCase().includes(query);

    return matchesDescription || matchesCity || matchesDetails || matchesPhone || matchesPriority;
  });

  return (
    <div className="HelpRequestList">

      <div className="search-container">
        <input type="text" placeholder="🔍 חפש בקשה (לפי עיר, תיאור, טלפון, דחיפות...)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="clear-search-btn">נקה</button>
        )}
      </div>

      {displayRequests.length === 0 ? (
        <div className="no-results">לא נמצאו בקשות עזרה מתאימות לחיפוש שלך.</div>
      ) : (
        <ul>
          {displayRequests.map((r, index) => (
            <HelpRequestCard key={index} request={r} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HelpRequestList;