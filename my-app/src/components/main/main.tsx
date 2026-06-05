
import { useState } from "react";
import './main.scss';
import Login from '../Login/Login';
import Register from "../Register/Register";

export default function Main() {
    const [score, setScore] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);


    return (
        // <div className="game">
            
        //     <div className="score">
        //         <p>score: {score}</p>
        //         <button onClick={() => setScore(0)}>התחל משחק</button>
            

        //     </div>
        <div>
            <div className="gameArea">
                <button onClick={() => setShowLogin(true)}>התחברות</button>
                {showLogin && <Login />}

            </div>
              <div className="gameArea">
                <button onClick={() => setShowRegister(true)}>הרשמה</button>
                {showRegister && <Register />}

            </div>
            </div>
       
    )
}
