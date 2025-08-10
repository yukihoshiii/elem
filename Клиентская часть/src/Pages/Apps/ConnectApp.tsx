import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TopBar } from '../../Components/Navigate';
import { Avatar, FormButton } from '../../UIKit';
import { useWebSocket } from '../../System/Context/WebSocket';
import { useModal } from '../../System/Context/Modal';
import { useAuth } from '../../System/Hooks/useAuth';

const ConnectApp = () => {
    const { wsClient } = useWebSocket();
    const { t } = useTranslation();
    const { accountData, isSocketAuthorized } = useAuth();
    const { openModal } = useModal();
    const params = useParams();
    const navigate = useNavigate();
    const [appData, setAppData] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isSocketAuthorized) {
            wsClient.send({
                type: 'apps',
                action: 'load_app',
                app_id: params?.app_id,
            }).then((res: any) => {
                if (res.status === 'success') {
                    setAppData(res.app);
                } else {
                    openModal({
                        type: 'info',
                        title: t('error'),
                        text: 'Такого приложения нет'
                    });
                    navigate('/');
                }
            })
        }
    }, [accountData, isSocketAuthorized]);

    const openLink = (url) => {
        location.href = url;
    };

    const handleConnect = () => [
        setIsLoading(true),
        wsClient.send({
            type: 'apps',
            action: 'connect_app',
            app_id: params?.app_id
        }).then((res: any) => {
            setIsLoading(false);
            if (res.status === 'success') {
                openLink(`${appData.url}${res.connect_key}`);
            } else {
                openModal({
                    type: 'info',
                    title: t('error'),
                    text: res.message
                });
            }
        })
    ]

    const handleClose = () => {
        navigate('/');
    }

    return (
        <>
            <TopBar search={true} />
            <div className="Content">
                <div className="UI-Block UI-ConnectBlock">
                    <div className="UI-Title">{`${t('app_connect_title')} ${appData.name}?`}</div>
                    <div className="ConnectLogo">
                        <Avatar
                            avatar={accountData.avatar}
                            name={accountData.name}
                        />
                        <div className="AppLogo">
                            {
                                appData.icon ? (
                                    <img src={appData.icon} />
                                ) : (
                                    <img src="/static_sys/Images/All/AppIcon.png" />
                                )
                            }
                        </div>
                    </div>
                    <div className="Info">{t('app_connect_description')}</div>
                    <div className="UI-Description">
                        <div className="Title">{t('app_description')}</div>
                        <div className="Text">
                            {appData.description}
                        </div>
                    </div>
                    <div className="Buttons">
                        <FormButton
                            title={t('connect')}
                            onClick={handleConnect}
                            isLoading={isLoading}
                        />
                        <button onClick={handleClose}>{t('close')}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConnectApp;