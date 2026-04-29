import { useRef, useState } from "react";

export default function Guests() {
  const guestsRef = useRef<HTMLInputElement>(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [onSave, setOnSave] = useState(false);

  function addEmail() {
    if (!guestsRef.current) return;
    const count = Number(guestsRef.current.value);
    const newEmails = Array(count).fill("");
    setEmails(newEmails);
    setOnSave(true);
  }

  function saveEmails() {
    const res: boolean[] = emails.map(email => email.endsWith("@gmail.com"));
    if (res.includes(false)) alert("יש טעות באחד האימיילים");
    else {
      alert("נשמר");
      if (guestsRef.current) guestsRef.current.value = "";
      setEmails([]);
      setOnSave(false);
    }
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3">הזמנת מוזמנים</h4>

        <div className="mb-3">
          <input
            type="number"
            ref={guestsRef}
            placeholder="מספר מוזמנים"
            className="form-control"
          />
        </div>

        <button onClick={addEmail} className="btn btn-primary mb-3">
          מלא רשימת מוזמנים
        </button>

        <div className="d-flex flex-column gap-2">
          {emails.map((email, index) => (
            <input
              key={index}
              type="email"
              placeholder={`אימייל של מוזמן ${index + 1}`}
              value={email}
              className="form-control"
              onChange={(e) => {
                const newEmails = [...emails];
                newEmails[index] = e.target.value;
                setEmails(newEmails);
              }}
            />
          ))}
        </div>

        {onSave && (
          <button onClick={saveEmails} className="btn btn-success mt-3">
            שלח
          </button>
        )}
      </div>
    </div>
  );
}