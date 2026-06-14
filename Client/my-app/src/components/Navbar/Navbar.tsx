import { useEffect, useState, lazy, Suspense, type FC } from 'react';
import './Navbar.scss';
import Login from '../Login/Login';
import type { Volunteer } from '../../models/volunteer.model';
import api from '../../api';
import Register from '../Register/Register';
import Profile from '../Profile/Profile';
import { useNavigate } from 'react-router-dom';
const AddHelpRequest = lazy(() => import('../AddHelpRequest/AddHelpRequest'));
import type { HelpRequest } from '../../models/helpRequest.model';

interface NavbarProps {
  onRefreshRequests: () => Promise<void>;
}

const Navbar: FC<NavbarProps> = ({ onRefreshRequests }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [userPassword, setUserPassword] = useState<string>("");
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const navigate = useNavigate();

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
        setVolunteer(found);
        setShowLogin(false);
        setShowRegister(false);
        navigate('/');
      }
    } catch (err) {
      console.error("שגיאה בסנכרון הנתונים", err);
    }
  };

  const handleRegisterSuccess = (newVolunteer: Volunteer) => {
    setVolunteer(newVolunteer);
    setShowRegister(false);
    navigate('/');
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    navigate('/register');
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
    navigate('/login');
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    navigate('/'); 
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
    navigate('/'); 
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">🤝 מערכת מתנדבים</div>
      <div className="navbar__actions">
        {!volunteer ? (<>
          <button className="navbar__btn navbar__btn--outline" onClick={() => { setShowLogin(true); setShowRegister(false); navigate('/login');}}>התחברות</button>
          <button className="navbar__btn navbar__btn--primary" onClick={() => { setShowRegister(true); setShowLogin(false); navigate('/register');}}>הרשמה</button>
        </>) : (<>
          <span className="navbar__greeting">שלום, {volunteer.firstName}! 👋</span>
          <button className="navbar__btn navbar__btn--outline" onClick={() => {setShowProfile(true); navigate('/profile');}}>הפרופיל שלי</button>
          <button className="navbar__btn navbar__btn--outline" onClick={() => setVolunteer(null)}>התנתק</button></>
        )}
      </div>
      {showLogin && <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={switchToRegister} onClose={handleCloseLogin} />}
      {showRegister && <Register onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={switchToLogin} onClose={handleCloseRegister} />}
      {showProfile && volunteer && <Profile volunteer={volunteer} onClose={handleCloseProfile} />}
      {volunteer?.role === 'admin' && (
        <Suspense fallback={null}>
          <AddHelpRequest onSuccess={onRefreshRequests} />
        </Suspense>
      )}
      </nav>
  );
};

export default Navbar;