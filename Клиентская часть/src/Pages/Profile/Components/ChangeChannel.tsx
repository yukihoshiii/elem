import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../System/Context/Modal';
import { AvatarInput, CoverInput, QuestionModal, Textarea, TextInput } from '../../../UIKit';
import { useWebSocket } from '../../../System/Context/WebSocket';

export interface ProfileData {
    id: number;
    username: string;
    name: string;
    description: string;
    avatar: string;
    cover: string;
}

export interface ChangeChannelProps {
    profileData: ProfileData;
    updateData: any;
}

type FileType = 'avatar' | 'cover';

const ChangeChannel: React.FC<ChangeChannelProps> = ({ profileData, updateData }) => {
    const { t } = useTranslation();
    const { wsClient } = useWebSocket();
    const { openModal } = useModal();

    const [username, setUsername] = useState<string>(profileData.username);
    const [name, setName] = useState<string>(profileData.name);
    const [description, setDescription] = useState<string>(profileData.description);

    const [avatarIsUploading, setAvatarIsUploading] = useState<boolean>(false);
    const [coverIsUploading, setCoverIsUploading] = useState<boolean>(false);

    const showError = (res) => {
        openModal({
            type: 'info',
            title: t('error'),
            text: res.message,
        });
    }

    const handleChangeFile = async (
        type: FileType,
        e: React.ChangeEvent<HTMLInputElement>,
        setUploading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setUploading(true);
        const file = e.target.files?.[0] ?? null;

        if (!file) {
            setUploading(false);
            openModal({
                type: 'info',
                title: t('error'),
                text: t('file_not_selected'),
            });
            return;
        }

        const arrayBuffer = await file.arrayBuffer();
        wsClient.send({
            type: 'social',
            action: `channels/change/${type}/upload`,
            channel_id: profileData.id,
            file: new Uint8Array(arrayBuffer),
        }).then((res) => {
            if (res.status === 'success') {
                setUploading(false);
                updateData();
            } else {
                setUploading(false);
                showError(res);
            }
        })
    };

    const changeCover = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChangeFile('cover', e, setCoverIsUploading);

    const changeAvatar = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChangeFile('avatar', e, setAvatarIsUploading);

    const changeName = () => {
        wsClient.send({
            type: 'social',
            action: 'channels/change/name',
            channel_id: profileData.id,
            name: name
        }).then((res) => {
            if (res.status === 'success') {
                updateData();
            } else {
                showError(res);
            }
        })
    };

    const changeUsername = () => {
        wsClient.send({
            type: 'social',
            action: 'channels/change/username',
            channel_id: profileData.id,
            username: username
        }).then((res) => {
            if (res.status === 'success') {
                updateData();
            } else {
                showError(res);
            }
        })
    };

    const changeDescription = () => {
        wsClient.send({
            type: 'social',
            action: 'channels/change/description',
            channel_id: profileData.id,
            description: description
        }).then((res) => {
            if (res.status === 'success') {
                updateData();
            } else {
                showError(res);
            }
        })
    };

    return (
        <>
            <CoverInput
                cover={profileData.cover}
                onChange={changeCover}
                isUploading={coverIsUploading}
            />
            <AvatarInput
                avatar={profileData.avatar}
                name={profileData.name}
                onChange={changeAvatar}
                isUploading={avatarIsUploading}
            />

            <div className="Inputs">
                <div className="ChangeContainer">
                    <div className="InputContainer">
                        @
                        <TextInput
                            placeholder="уникальное_имя"
                            value={username}
                            maxLength={60}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <QuestionModal
                        input={username}
                        target={profileData.username}
                        set={setUsername}
                        onApply={changeUsername}
                    />
                </div>

                <div className="ChangeContainer">
                    <TextInput
                        placeholder="Введите название"
                        value={name}
                        type="text"
                        maxLength={30}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <QuestionModal
                        input={name}
                        target={profileData.name}
                        set={setName}
                        onApply={changeName}
                    />
                </div>

                <div className="ChangeContainer">
                    <Textarea
                        placeholder="Введите описание"
                        value={description}
                        maxLength={100}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <QuestionModal
                        input={description}
                        target={profileData.description}
                        set={setDescription}
                        onApply={changeDescription}
                    />
                </div>
            </div>
        </>
    );
};

export default ChangeChannel;
