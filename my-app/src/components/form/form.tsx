import { useRef, useState } from "react";

export default function Guests() {
    const guestsRef = useRef<HTMLInputElement>(null);
    const [emails, setEmails] = useState<string[]>([]);
    const [onSave, setOnSave] = useState(false)

    function addEmail() {
        if (!guestsRef.current) return;
        const count = Number(guestsRef.current.value);
        const newEmails = Array(count).fill("");
        setEmails(newEmails);
        setOnSave(true)
    };

    function saveEmails() {
        const res: boolean[] = emails.map(email => email.endsWith("@gmail.com"));
        if (res.includes(false)) alert("יש טעות באחד האימיילים");
        else {
            alert("נשמר");
            if (guestsRef.current) guestsRef.current.value = "";
            setEmails([]);
            setOnSave(false)
        }
    }

    return (
        <div>
            <input type="number" ref={guestsRef} placeholder="מספר מוזמנים" />
            <button onClick={addEmail}>מלא רשימת מוזמנים</button>
            <div>
                {emails.map((email, index) => (
                    <input
                        key={index}
                        type="email"
                        placeholder={`אימייל של מוזמן ${index + 1}`}
                        value={email}
                        onChange={(e) => {
                            const newEmails = [...emails];
                            newEmails[index] = e.target.value;
                            setEmails(newEmails);
                        }}
                    />
                ))}
            </div>
            {onSave && <button onClick={saveEmails}>שלח</button>}

        </div>
    );
}