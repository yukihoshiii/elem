import { useState } from 'react';
import { useModal } from '../../../System/Context/Modal';
import { useTranslation } from 'react-i18next';
import { FormButton, TextInput } from '../../../UIKit';
import { useAuth } from '../../../System/Hooks/useAuth';
import { useWebSocket } from '../../../System/Context/WebSocket';

const ChangeUsername = () => {
    const { accountData, updateAccount } = useAuth();
    const { wsClient } = useWebSocket();
    const { t } = useTranslation();
    const { openModal } = useModal();
    const [username, setUsername] = useState(accountData.username);

    const change = () => {
        wsClient.send({
            type: 'social',
            action: 'change_profile/username',
            username: username
        }).then((res) => {
            if (res.status === 'success') {
                updateAccount({ username: username });
                openModal({
                    type: 'info',
                    title: t('success'),
                    text: 'Ваше уникальное имя изменено'
                })
            } else if (res.status === 'error') {
                openModal({
                    type: 'info',
                    title: t('error'),
                    text: res.message
                });
            }
        })
    }

    return (
        <>
            <img
                src="/static_sys/Images/All/ChangeUsername.svg"
                className="UI-PB_Image"
                alt="фыр"
            />
            <div className="UI-PB_InputText">
                Сменить имя можно сколько угодно раз, но если его займёт кто-то другой вернуть уже не получиться.
            </div>
            <TextInput
                value={username}
                onChange={(e) => { setUsername(e.target.value) }}
                placeholder="@введите_текст"
                type="text"
            />
            <FormButton
                title={t('change')}
                onClick={change}
            />
        </>
    );
};

export default ChangeUsername;
