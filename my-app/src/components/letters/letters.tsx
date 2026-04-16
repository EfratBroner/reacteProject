import "./letters.scss";
interface letProps {
    language: string;
    status: boolean;
    addLetter: (letter: string) => any

}

export default function Letters({language, status, addLetter}: letProps) {
    let letts = [];
    if (status === true) {
            letts = Array.from({ length: 26 }, (_, i) => ({
                letter: String.fromCharCode(65 + i)
            }));  
        }
        else{
    if (language === "English") {
            letts = Array.from({ length: 26 }, (_, i) => ({
                letter: String.fromCharCode(97 + i)
            }));
    }
    else {
            letts = Array.from({ length: 27 }, (_, i) => ({
                letter: String.fromCharCode(0x05D0 + i)
            }));
        }}
        const extras = Array.from('0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/', (char) => ({ letter: char }));
        letts = [...letts];
        return (
            <div>
            <div>
                {letts.map((lett) => (
                    <div>
                        <button onClick={() => addLetter(lett.letter)}>{lett.letter}</button>
                    </div>
                ))}
                 </div>
                <div style={{height: '20px'}}></div>
                 <div>
                {extras.map((extra) => (
                    <div>
                        <button onClick={() => addLetter(extra.letter)}>{extra.letter}</button>
                    </div>
                ))}
                </div>
                </div>
           
        );
    }
