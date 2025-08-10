import { useState } from 'react';
import { HandleLinkIcon } from '../../../System/Elements/Handlers';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '../../../System/Context/WebSocket';
import { useModal } from '../../../System/Context/Modal';
import { Avatar, FormButton, TextInput } from '../../../UIKit';
import { useAuth } from '../../../System/Hooks/useAuth';

const AddLink = ({ setPartitionOpen }) => {
    const { accountData, updateOrCreateLink } = useAuth();
    const { openModal } = useModal();
    const { t } = useTranslation();
    const { wsClient } = useWebSocket();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');

    const add = () => {
        wsClient.send({
            type: 'social',
            action: 'add_link',
            title: title,
            link: link
        }).then((res) => {
            if (res.action === 'add_link') {
                if (res.status === 'success') {
                    setTitle('');
                    setLink('');
                    setIsLoading(false);
                    updateOrCreateLink({
                        id: res.link_id,
                        title: title,
                        url: link
                    });
                    setPartitionOpen(false);
                } else if (res.status === 'error') {
                    setIsLoading(false);
                    openModal({
                        type: 'info',
                        title: t('error'),
                        text: res.message
                    });
                }
            }
        })
        setIsLoading(true);
    }

    return (
        <>
            <div className="Settings-LinkContainer">
                <Avatar
                    avatar={accountData.avatar}
                    name={accountData.name}
                />
                <div className="LinkIcon">
                    <HandleLinkIcon link={link} />
                </div>
            </div>
            <TextInput
                placeholder="Имя ссылки"
                maxLength={50}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextInput
                placeholder="Ссылка"
                maxLength={150}
                value={link}
                onChange={(e) => setLink(e.target.value)}
            />
            <FormButton
                title={t('add')}
                onClick={add}
                isLoading={isLoading}
            />
        </>
    );
}

export default AddLink;