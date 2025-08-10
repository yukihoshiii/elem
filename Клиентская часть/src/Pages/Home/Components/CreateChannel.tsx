import { useTranslation } from 'react-i18next';
import { useModal } from '../../../System/Context/Modal';
import { useState } from 'react';
import { FormButton, Textarea, TextInput } from '../../../UIKit';
import { I_UPLOAD_IMAGE } from '../../../System/UI/IconPack';
import { useWebSocket } from '../../../System/Context/WebSocket';

const CreateChannel = () => {
    const { t } = useTranslation();
    const { wsClient } = useWebSocket();
    const { openModal } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    const [coverPreview, setCoverPreview] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [cover, setCover] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCover = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCoverPreview(url);
        }
    };

    const handleAvatar = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarPreview(url);
        }
    };

    const create = () => {
        setIsLoading(true);

        let data: any = {
            type: 'social',
            action: 'channels/create',
            name: name,
            username: username
        };

        if (cover) {
            data.cover = cover;
        }
        if (avatar) {
            data.avatar = avatar;
        }
        if (description) {
            data.description = description;
        }

        wsClient.send(data).then((res) => {
            setIsLoading(false);

            if (res.status === 'success') {
                openModal({
                    type: 'info',
                    title: t('success'),
                    text: 'Канал создан',
                });
            } else if (res.status === 'error') {
                openModal({
                    type: 'info',
                    title: t('error'),
                    text: res.message,
                });
            }
        });
    };

    return (
        <>
            <div className="UI-Cover">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e: any) => {
                        setCover(e.target.files[0]);
                        handleCover(e);
                    }}
                />
                {coverPreview ? <img src={coverPreview} alt="фыр" /> : <I_UPLOAD_IMAGE />}
            </div>
            <div className="Avatar">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e: any) => {
                        setAvatar(e.target.files[0]);
                        handleAvatar(e);
                    }}
                />
                {avatarPreview ? <img src={avatarPreview} alt="фыр" /> : <I_UPLOAD_IMAGE />}
            </div>
            <div className="Inputs">
                <div className="InputContainer">
                    @
                    <TextInput
                        placeholder="уникальное_имя"
                        value={username}
                        type="text"
                        maxLength={60}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <TextInput
                    placeholder="Введите название"
                    value={name}
                    type="text"
                    maxLength={60}
                    onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                    placeholder="Введите описание"
                    value={description}
                    maxLength={1000}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <FormButton
                title={t('create')}
                onClick={create}
                isLoading={isLoading}
            />
        </>
    );
};

export default CreateChannel;