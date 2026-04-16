import Letters from "../letters/letters";
import { useState } from "react";
import './keyboard.scss';

export class tav {
    color!: string
    size!: string
    bold!: boolean
    language!: string
    caps!: boolean
    letter!: string
    constructor(color: string, size: string, bold: boolean, letter: string) {
        this.color = color;
        this.size = size;
        this.bold = bold;
        this.letter = letter;
    }
}

export default function KeyBoard() {
    const [color, setColor] = useState('black');
    const [size, setSize] = useState('small');
    const [bold, setBolde] = useState(false);
    const [language, setLanguage] = useState('עברית');
    const [caps, setCaps] = useState(false);
    const [text, setText] = useState<{letter: string, color: string, size: string, bold: boolean}[]>([]);


    return (
        <div className="keyboard">
            <div className="screen">
                <p dir={language === 'עברית' ? 'rtl' : 'ltr'}>
                    {text.map((t, i) => (
                        <span key={i} style={{color: t.color, fontSize: t.size, fontWeight: t.bold ? 'bold' : 'normal'}}>{t.letter}</span>
                    ))}
                    <span className="cursor">|</span>
                </p>
            </div>
            <div className="buttons">
                <button onClick={() => setText(text.slice(0, text.length - 1))}>del</button>
                <button onClick={() => setText([])}>del all</button>
                <button onClick={() => setColor(color === 'black' ? 'red' : 'black')} style={{ color: color }}>color</button>
                <button onClick={() => setSize(size === 'small' ? 'large' : 'small')} style={{ fontSize: size }}>size</button>
                <button onClick={() => setBolde(!bold)} style={{ fontWeight: bold ? 'bold' : 'normal' }}>bold</button>
                <button onClick={() => setLanguage(language === 'עברית' ? 'English' : 'עברית')}>language</button>
                <button onClick={() => setCaps(caps === false ? true : false)} style={{ color: caps ? 'white' : 'black', backgroundColor: caps? 'black' : 'white'}}>caps</button>
            </div>
            <Letters language={language} status={caps} addLetter={(letter: string) => setText([...text, {letter: letter, color: color, size: size, bold: bold}])} />
                <button className="space" onClick={() => setText([...text, {letter: " ", color: color, size: size, bold: bold}])}></button>
        </div>
    );




}