import { useState } from "react";

import styles from './dropdown.module.css';

export function toTitleCase(str : string) {
    return str.toLowerCase().split(/[\s_]+/).map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

export interface Props {
    options : string[];
    onClick : (opt : string) => void;
}

export default function Drowdown({options, onClick} : Props) {
    const [opt, setOpt] = useState<string>(options[0]);
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <button onClick={() => setOpen(!open)} className={styles.dropdown}>{opt}</button>
            {open ? (
                <ul className={styles.menu}>
                    {
                        options.map(i => {
                            return <li key={i}><button onClick={() => {
                                setOpt(i);
                                onClick(i);
                                setOpen(false);
                            }}>{i}</button></li>
                        })
                    }
                </ul>
            ) : ""}
        </div>
    );
}
