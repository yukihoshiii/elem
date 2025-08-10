import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PreloadNotifications } from '../../System/UI/Preload';
import Notification from './Notification';
import { useAuth } from '../../System/Hooks/useAuth';
import { BackButton } from '../../UIKit';
import { isMobile } from 'react-device-detect';
import { useWebSocket } from '../../System/Context/WebSocket';
import { useInView } from 'react-intersection-observer';

interface NotificationsProps {
    hideNotifications?: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ hideNotifications }) => {
    const { accountData } = useAuth();
    const { t } = useTranslation();
    const { wsClient } = useWebSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [newNotifications, setNewNotifications] = useState<Notification[]>([]);
    const [notificationsLoaded, setNotificationsLoaded] = useState<boolean>(false);
    const [si, setSI] = useState<number>(0);
    const { ref: endRef, inView: endIsView } = useInView({
        threshold: 0
    });

    useEffect(() => {
        if (endIsView && notificationsLoaded) {
            setSI(prevSI => prevSI + 10);
            load();
        }
    }, [endIsView]);

    const load = () => {
        wsClient.send({
            type: 'social',
            action: 'notifications/load',
            payload: {
                start_index: si
            }
        }).then((res: any) => {
            if (res.status === 'success') {
                if (Array.isArray(res.notifications) && res.notifications.length > 0) {
                    setNewNotifications(prev => [
                        ...prev,
                        ...res.notifications.filter(notification => !notification.viewed)
                    ]);

                    setNotifications(prev => [
                        ...prev,
                        ...res.notifications.filter(notification => notification.viewed)
                    ]);
                    setNotificationsLoaded(true);
                }
            }
        })
    }

    useEffect(() => {
        setNotificationsLoaded(false);
        setNewNotifications([]);
        setNotifications([]);
        setSI(0);
        load();
    }, [accountData]);

    return (
        <>
            {
                isMobile && (
                    <div className="NotificationsHeader">
                        <BackButton
                            onClick={hideNotifications}
                        />
                    </div>
                )
            }

            <div className="Notifications">
                <div className="Notifications-Scroll">
                    {
                        notificationsLoaded ? (
                            (newNotifications.length > 0 || notifications.length > 0) ? (
                                <>
                                    {newNotifications.length > 0 && (
                                        <div className="Notifications-New">
                                            {newNotifications.map((notification, i) => (
                                                <Notification key={`new-${i}`} notification={notification} />
                                            ))}
                                        </div>
                                    )}
                                    {notifications.length > 0 && (
                                        notifications.map((notification, i) => (
                                            <Notification key={`all-${i}`} notification={notification} />
                                        ))
                                    )}
                                    {notifications.length > 24 && (
                                        <span ref={endRef} />
                                    )}
                                </>
                            ) : (
                                <div className="UI-ErrorMessage">{t('ups')}</div>
                            )
                        ) : (
                            <PreloadNotifications />
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default Notifications;
