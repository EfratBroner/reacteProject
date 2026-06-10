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
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [showName, setShowName] = useState(false)
  const [userPassword, setUserPassword] = useState<string>("");
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/volunteer')
      setVolunteers(response.data as Volunteer[])
    }
    fetchData()
  }, [])

  const handleLoginSuccess = (password: string) => {
    setUserPassword(password);
    console.log("הסיסמה שהתקבל באבא (Navbar):", password);
    const found = volunteers.find(v => v.password === password);
    setVolunteer(found ?? null);
  };
  return (
    <div>
      <h1>מערכת מתנדבים:</h1>

      {showName && <div className="gameArea">
        <button onClick={() => setShowLogin(true)}>התחברות</button>
        {showLogin && <Login onLoginSuccess={handleLoginSuccess} />}
        <button onClick={() => setShowRegister(true)}>הרשמה</button>
        {showRegister && <Register />}
      </div>}

      {!showName && <div>
        <p>שלום!</p>
        <button onClick={() => setShowName(true)}>{volunteer?.firstName}</button>
      </div>}
    </div>
  );
}

export default Navbar;
