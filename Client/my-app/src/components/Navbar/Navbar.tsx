import { useEffect, useState, type FC } from 'react';
import './Navbar.scss';
import Login from '../Login/Login';
import type { Volunteer } from '../../models/volunteer.model';
import api from '../../api';
import Register from '../Register/Register';

interface NavbarProps { }

const Navbar: FC<NavbarProps> = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [userPassword, setUserPassword] = useState<string>("");
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);

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

  const handleLoginSuccess = async (password: string) => {
    setUserPassword(password);
    console.log("הסיסמה שהתקבלה ב-Navbar:", password);

    try {
      const response = await api.get('/volunteer');
      const updatedVolunteers = response.data as Volunteer[];
      setVolunteers(updatedVolunteers);
      const found = updatedVolunteers.find(v => v.password === password);
      if (found) {
        setVolunteer(found);
        setShowLogin(false);
        setShowRegister(false);
      } else {
        setVolunteer(null);
      }
    } catch (err) {
      console.error("שגיאה בסנכרון הנתונים", err);
    }
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">🤝 מערכת מתנדבים</div>
      <div className="navbar__actions">
        {!volunteer ? (<>
          <button className="navbar__btn navbar__btn--outline" onClick={() => { setShowLogin(true); setShowRegister(false); }}>התחברות</button>
          <button className="navbar__btn navbar__btn--primary" onClick={() => { setShowRegister(true); setShowLogin(false); }}>הרשמה</button>
        </>) : (<>
          <span className="navbar__greeting">שלום, {volunteer.firstName}! 👋</span>
          <button className="navbar__btn navbar__btn--outline" onClick={() => setVolunteer(null)}>התנתק</button></>
        )}
      </div>
      {showLogin && <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={switchToRegister} onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onRegisterSuccess={handleLoginSuccess} onNavigateToLogin={switchToLogin} onClose={() => setShowRegister(false)} />}
    </nav>
  );
};

export default Navbar;