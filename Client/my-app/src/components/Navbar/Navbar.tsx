import { useEffect, useState, lazy, Suspense, type FC } from 'react';
import './Navbar.scss';
import Login from '../Login/Login';
import type { Volunteer } from '../../models/volunteer.model';
import api from '../../api';
import Register from '../Register/Register';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setVolunteer, clearVolunteer } from '../../redux/slices/volunteerSlice';
import type { RootState, AppDispatch } from '../../main';
import type { HelpRequest } from '../../models/helpRequest.model';
import { setRequests } from '../../redux/slices/requestsSlice';

const AddHelpRequest = lazy(() => import('../AddHelpRequest/AddHelpRequest'));

interface NavbarProps {
  onRefreshRequests: () => Promise<void>;
}

const Navbar: FC<NavbarProps> = ({ onRefreshRequests }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [showMyRequests, setShowMyRequests] = useState(false);

  const volunteer = useSelector((state: RootState) => state.volunteer.volunteer);
  const helpRequests = useSelector((state: RootState) => state.requests.requests || []);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const myActiveRequests = volunteer 
    ? helpRequests.filter((req: HelpRequest) => req.volunteerId === volunteer._id) 
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/volunteer');
        setVolunteers(response.data as Volunteer[]);
      } catch (err) {
        console.error("שגיאה בטעינת המתנדבים", err);
      }
    };
    fetchData();
  }, []);

  const handleLoginSuccess = async (password: string, email?: string) => {
    try {
      const response = await api.get('/volunteer');
      const updatedVolunteers = response.data as Volunteer[];
      setVolunteers(updatedVolunteers);
      const found = email
        ? updatedVolunteers.find(v => v.email === email)
        : updatedVolunteers.find(v => v.password === password);
      if (found) {
        dispatch(setVolunteer(found));
        
        try {
          const requestsResponse = await api.get('/helpRequest'); 
          const inProgressRequests = (requestsResponse.data as HelpRequest[]).filter(req => req.status === 'בטיפול');
          dispatch(setRequests(inProgressRequests));
        } catch (reqErr) {
          console.error('שגיאה בטעינת בקשות בטיפול בעת התחברות', reqErr);
        }

        setShowLogin(false);
        setShowRegister(false);
        setShowProfile(false);
        navigate('/');
      }
    } catch (err) {
      console.error("שגיאה בסנכרון הנתונים", err);
    }
  };

  const handleRegisterSuccess = (newVolunteer: Volunteer) => {
    dispatch(setVolunteer(newVolunteer));
    setShowRegister(false);
    setShowProfile(false);
    navigate('/');
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setShowProfile(false);
    navigate('/register');
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowProfile(false);
    setShowLogin(true);
    navigate('/login');
  };

  const handleCloseLogin = () => { setShowLogin(false); navigate('/'); };
  const handleCloseRegister = () => { setShowRegister(false); navigate('/'); };

  // תיקון חתימת הפונקציה: מקבלת אובייקט HelpRequest מלא
  const handleRequestCardClick = (req: HelpRequest) => {
    setShowMyRequests(false);
    navigate(`/details/${req._id}`, { state: { request: req } }); 
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="brand-logo-svg">
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="url(#logoGrad)" strokeWidth="2" />
            <path d="m10 10 2-2 2 2M12 8v8" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logoGrad" x1="2" y1="2" x2="22" y2="22">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <span>ידידים - מערכת פנימית</span>
                  </div>

        <div className="navbar__actions">
          {!volunteer ? (
            <>
              <button
                className="navbar__btn navbar__btn--outline"
                onClick={() => { setShowLogin(true); setShowRegister(false); navigate('/login'); }}>התחברות</button>
              <button
                className="navbar__btn navbar__btn--primary"
                onClick={() => { setShowRegister(true); setShowLogin(false); navigate('/register'); }}>הרשמה</button>
            </>
          ) : (
            <>
              {myActiveRequests.length > 0 && (
                <div 
                  className="navbar__bell-container"
                  onMouseEnter={() => setShowMyRequests(true)}
                  onMouseLeave={() => setShowMyRequests(false)}
                  style={{ position: 'relative', display: 'inline-block', marginLeft: '15px' }}
                >
                  <button className="navbar__btn navbar__btn--bell" style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>
                    🔔 <span className="navbar__badge" style={{ backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', position: 'absolute', top: '-5px', right: '-5px' }}>{myActiveRequests.length}</span>
                  </button>

                  {showMyRequests && (
                    <div className="navbar__requests-dropdown" style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', padding: '10px', width: '240px', zIndex: 1000, boxShadow: '0px 4px 8px rgba(0,0,0,0.1)', direction: 'rtl' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>בקשות שבטיפולך כעת:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {myActiveRequests.map((req: HelpRequest) => (
                          <div 
                            key={req._id} 
                            onClick={() => handleRequestCardClick(req)} // תיקון: העברת req המלא
                            style={{ backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', textAlign: 'right', fontSize: '0.8rem' }}
                          >
                            <div>📍 <strong>מיקום:</strong> {req.location.city}</div>
                            <div>📞 <strong>טלפון:</strong> {req.phone}</div>
                            <div>⚠️ <strong>דחיפות:</strong> {req.priority}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <span className="navbar__greeting">שלום, {volunteer.firstName}! 👋</span>
              <button
                className="navbar__btn navbar__btn--outline"
                onClick={() => navigate('/profile')} >
        
                הפרופיל שלי
              </button>
              <button
                className="navbar__btn navbar__btn--danger"
                onClick={() => dispatch(clearVolunteer())}>
                התנתק
              </button>
            </>
          )}
        </div>
      </nav>

      {showLogin && (
        <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={switchToRegister} onClose={handleCloseLogin} />
      )}
      {showRegister && (
        <Register volunteer={null} onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={switchToLogin} onClose={handleCloseRegister} />
      )}

      {volunteer?.role === 'admin' && (
        <div className="admin-fab-wrapper">
          <Suspense fallback={null}>
            <AddHelpRequest onSuccess={onRefreshRequests} />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default Navbar;
