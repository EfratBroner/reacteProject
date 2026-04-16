import Letters from "../letters/letters";
import Keyboard from "../keyboard/keyboard";
import { useState } from "react";
import './main.scss';

export default function Main() {
    const [score, setScore] = useState(0);

    return (
        <div className="game">
            
            <div className="score">
                <p>score: {score}</p>
                <button onClick={() => setScore(0)}>התחל משחק</button>
            

            </div>
            <Keyboard></Keyboard>
        </div>
    )
}
