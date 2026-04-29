import { useRef, useState } from "react";

export default function Guests() {
const guestsRef = useRef<HTMLInputElement>(null);
  const [emails, setEmails] = useState([]);

  return (
    <div>
      <input type="number" ref={guestsRef} placeholder="מספר מוזמנים" />
      <button>מלא רשימת מוזמנים</button>
      
    </div>
  );
}