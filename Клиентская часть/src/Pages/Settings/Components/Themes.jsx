import { useState } from 'react';
import { HandleTheme } from '../../../System/Elements/Handlers';
import { useAuth } from '../../../System/Hooks/useAuth';

const Themes = () => {
    const { accountData } = useAuth();
    const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('S-Theme') || 'LIGHT');

    let themes = [
        {
            name: 'Светлая',
            id: 'LIGHT',
            class: 'Theme-Light',
            goldStatus: false,
        },
        {
            name: 'Золотая',
            id: 'GOLD',
            class: 'Theme-Gold',
            goldStatus: true,
        },
        {
            name: 'Тёмная',
            id: 'DARK',
            class: 'Theme-Dark',
            goldStatus: false,
        },
        {
            name: 'Золотая тёмная',
            id: 'GOLD-DARK',
            class: 'Theme-Gold-Dark',
            goldStatus: true,
        },
        {
            name: 'AMOLED',
            id: 'AMOLED',
            class: 'Theme-Amoled',
            goldStatus: false,
        },
        {
            name: 'Золотая AMOLED',
            id: 'AMOLED-GOLD',
            class: 'Theme-Amoled-Gold',
            goldStatus: true,
        },
    ];

    themes = accountData.gold_status ? themes : themes.filter((t) => t.goldStatus === false);

    const setTheme = (theme) => {
        localStorage.setItem('S-Theme', theme);
        setSelectedTheme(theme);
        HandleTheme();
    };

    return (
        <div className="Scroll">
            {themes.map((theme, i) => (
                <div key={i} className={`${theme.class} ChangeTheme`} onClick={() => setTheme(theme.id)}>
                    <div className="TH-Container">
                        <div className="TH-TopBar"></div>
                        <div className="TH-Posts">
                            <div className="TH-AddPost">
                                <div className="TH-Button"></div>
                            </div>
                            <div className="TH-Post"></div>
                            <div className="TH-Post"></div>
                        </div>
                        <div className="TH-BottomBar"></div>
                    </div>
                    <div className={`Info${selectedTheme === theme.id ? ' Selected' : ''}`}>{theme.name}</div>
                </div>
            ))}
        </div>
    )
}

export default Themes;