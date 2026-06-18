import { useEffect, useState, lazy, Suspense, type FC } from 'react';
import './HelpRequestList.scss';
import type { HelpRequest } from '../../models/helpRequest.model';
import HelpRequestCard from '../HelpRequestCard/HelpRequestCard';
import api from '../../api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../main';

const AddHelpRequest = lazy(() => import('../AddHelpRequest/AddHelpRequest'));

interface HelpRequestListProps {
  requests: HelpRequest[];
  onSelect: (request: HelpRequest) => void;
  onRefreshRequests: () => Promise<void>;
}

const HelpRequestList: FC<HelpRequestListProps> = ({ requests, onSelect, onRefreshRequests }) => {
  const isAdmin = useSelector((state: RootState) => state.volunteer.volunteer)?.role === 'admin';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [displayRequests, setDisplayRequests] = useState<HelpRequest[]>(requests);

  useEffect(() => {
    setDisplayRequests(requests);
  }, [requests]);

  useEffect(() => {
    if (!selectedStatus && !selectedPriority && !selectedCity.trim()) {
      setDisplayRequests(requests.filter(req => matchesSearch(req)));
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedStatus) params.append('status', selectedStatus);
        if (selectedPriority) params.append('priority', selectedPriority);
        if (selectedCity.trim()) params.append('city', selectedCity.trim());

        const { data } = await api.get(`/helpRequest/search?${params.toString()}`);
        setDisplayRequests(data.filter((req: HelpRequest) => matchesSearch(req)));
      } catch (error) {
        console.error("שגיאה:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedStatus, selectedPriority, selectedCity, searchQuery, requests]);

  function matchesSearch(req: HelpRequest) {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      req.description?.toLowerCase().includes(query) ||
      req.location?.city?.toLowerCase().includes(query) ||
      req.location?.details?.toLowerCase().includes(query) ||
      req.phone?.includes(query) ||
      req.priority?.toLowerCase().includes(query)
    );
  }

  return (
    <div className="HelpRequestList">

      <div className="list-header">
        <div className="header-icon">🆘</div>
        <h2>בקשות <span>עזרה</span></h2>
        <div className="header-right">
          {isAdmin && (
            <Suspense fallback={null}>
              <AddHelpRequest onSuccess={onRefreshRequests} />
            </Suspense>
          )}
          {!loading && (
            <span className="count-badge">{displayRequests.length} בקשות</span>
          )}
        </div>
      </div>

      <div className="search-container">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-select">
          <option value="">כל הסטטוסים</option>
          <option value="ממתין">ממתין</option>
          <option value="בטיפול">בטיפול</option>
          <option value="הסתיים">הסתיים</option>
        </select>

        <div className="filter-divider" />

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="priority-select">
          <option value="">כל הדחיפויות</option>
          <option value="נמוכה">🟢 נמוכה</option>
          <option value="בינונית">🟡 בינונית</option>
          <option value="גבוהה">🔴 גבוהה</option>
          <option value="קריטית">🚨 קריטית</option>
        </select>

        <div className="filter-divider" />

        <input
          type="text"
          placeholder="סנן לפי עיר..."
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="city-input"
        />
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <span>טוען מהשרת...</span>
        </div>
      ) : displayRequests.length === 0 ? (
        <div className="no-results">
          <div className="empty-icon">🔍</div>
          <p>לא נמצאו בקשות מתאימות.</p>
        </div>
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