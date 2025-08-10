import { Navigate, useRoutes } from 'react-router-dom';
import { LeftNavButton, TopBar } from '../../Components/Navigate';
import { I_BACK, I_GOLD_STAR, I_PANEL, I_USERS } from '../../System/UI/IconPack';
import Statistic from './Pages/Statistic';
import Users from './Pages/Users';
import Gold from './Pages/Gold';
import './Panel.scss';

const Panel = () => {
    const pages = [
        {
            path: 'stat',
            name: 'Статистика',
            icon: <I_PANEL />,
            element: <Statistic />
        },
        {
            path: 'users',
            name: 'Пользователи',
            icon: <I_USERS />,
            element: <Users />
        },
        {
            path: 'gold',
            name: 'Подписка',
            icon: <I_GOLD_STAR />,
            element: <Gold />
        },
        {
            path: '/',
            name: 'Выход',
            icon: <I_BACK />,
            element: <Navigate to="/" replace />
        },
    ];
    const routing = useRoutes(pages);

    return (
        <>
            <TopBar title={true} titleText="Панель управления" />
            <div className="Content">
                <div className="UI-L_NAV UI-B_FIRST">
                    {
                        pages.map((page, i) => (
                            <LeftNavButton key={i} currentPage="panel" target={page.path}>
                                <div className="UI-LN_ICON">
                                    {page.icon}
                                </div>
                                {page.name}
                            </LeftNavButton>
                        ))
                    }
                </div>
                <div className="UI-PAGE_BODY">
                    <div className="UI-ScrollView">
                        {routing}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Panel;