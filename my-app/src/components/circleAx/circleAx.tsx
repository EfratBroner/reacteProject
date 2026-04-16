import "./circleAx.scss";
import { useState } from "react";

export default function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [round, setRound] = useState(1);

  function handleClick(index: number) {
    if (board[index]) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setIsXTurn(!isXTurn);
    setBoard(newBoard);
    if (calculateWinner(newBoard)) {
      setTimeout(() => {
        alert(`Player ${isXTurn ? "X" : "O"} wins!`);
        setRound(1);
        setBoard(Array(9).fill(null));
      }, 100);
    } 
    else if (newBoard.every(cell => cell !== null)) {
      setTimeout(() => {
        alert("It's a tie!");
        if (round == 3) {
          alert("Game Over")
          return
        }
        setRound(round + 1);
        setBoard(Array(9).fill(null));
      }, 100);
    }
  }

  function calculateWinner(squares: any[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  return (
    <div className="wrapper">
      <h2 className="title">Round: {round}</h2>
      <div className="board">
        {board.map((cell, index) => (
          <button key={index} className="cell" onClick={() => handleClick(index)}>
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}


