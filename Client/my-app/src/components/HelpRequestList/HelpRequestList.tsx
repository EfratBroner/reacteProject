import { useEffect, useState, type FC } from 'react';
import './HelpRequestList.scss';
import type { HelpRequest } from '../../models/helpRequest.model';
import HelpRequestCard from '../HelpRequestCard/HelpRequestCard';
import api from '../../api';

interface HelpRequestListProps {
  requests: HelpRequest[];
  onSelect: (request: HelpRequest) => void;
}

const HelpRequestList: FC<HelpRequestListProps> = ({ requests, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredRequests, setFilteredRequests] = useState<HelpRequest[]>([]);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedStatus && !selectedPriority && !selectedCity) {
      setFilteredRequests([]);
      setIsFiltering(false);
      return;
    }
    setIsFiltering(true);
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedStatus) params.append('status', selectedStatus);
        if (selectedPriority) params.append('priority', selectedPriority);
        if (selectedCity) params.append('city', selectedCity);
        const { data } = await api.get(`/helpRequest/search?${params.toString()}`);
        setFilteredRequests(data);
      } catch (error) {
        console.error("שגיאה במשיכת נתונים מהשרת:", error);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [selectedStatus, selectedPriority, selectedCity]);

  const baseRequests = isFiltering ? filteredRequests : requests;

  const displayRequests = baseRequests.filter(req => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      req.description?.toLowerCase().includes(query) ||
      req.location?.city?.toLowerCase().includes(query) ||
      req.location?.details?.toLowerCase().includes(query) ||
      req.phone?.includes(query) ||
      req.priority?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="HelpRequestList">
      <div className="search-container">

        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="status-select">
          <option value="">כל הסטטוסים</option>
          <option value="ממתין">ממתין</option>
          <option value="בטיפול">בטיפול</option>
          <option value="הסתיים">הסתיים</option>
        </select>

        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="priority-select">
          <option value="">כל הדחיפויות</option>
          <option value="נמוכה">נמוכה</option>
          <option value="בינונית">בינונית</option>
          <option value="גבוהה">גבוהה</option>
          <option value="קריטית">קריטית</option>
        </select>

        <input
          type="text"
          placeholder="סנן לפי עיר..."
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="city-input"
        />
      </div>

      {/* הצגת מצב טעינה או את הרשימה המעודכנת */}
      {loading ? (
        <div className="loading">טוען נתונים מהשרת...</div>
      ) : displayRequests.length === 0 ? (
        <div className="no-results">לא נמצאו בקשות מתאימות.</div>
      ) : (
        <ul>
          {displayRequests.map((r, index) => (
            <HelpRequestCard key={index} request={r} onClick={() => onSelect(r)} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HelpRequestList;