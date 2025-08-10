import {
    useRef,
    useState,
    useCallback,
} from 'react';
import { useAuth } from '../../../System/Hooks/useAuth';
import { useWebSocket } from '../../../System/Context/WebSocket';
import { useModal } from '../../../System/Context/Modal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Animate, AnimateElement } from '../../../System/Elements/Function';
import { I_ADD_FILE, I_AVATAR, I_CLEAR, I_MUSIC, I_PLUS, I_SETTINGS, I_SMILE } from '../../../System/UI/IconPack';
import Avatar from '../Base/Avatar';
import ContextMenu from '../Base/ContextMenu';
import { DragDropArea } from '../../../System/Elements/DragDropArea';
import SocialInput from '../Inputs/SocialInput';
import FilePreview from '../../../Components/FilePreview';
import FormButton from '../Buttons/FormButton';
import { EmojiPicker } from '../..';
import { UniversalPanel } from '../../../System/Elements/Modal';
import classNames from 'classnames';
import CreateChannel from '../../../Pages/Home/Components/CreateChannel';
import { Window } from '../../../System/Elements/Modal';

interface AddPostProps {
    onSend?: any;
    inputPlaceholder?: string;
    isWall?: boolean;
    wallUsername?: string; 
}

const AddPost: React.FC<AddPostProps> = ({ onSend, inputPlaceholder, isWall = false, wallUsername }) => {
    const { t } = useTranslation();
    const { openModal } = useModal();
    const { wsClient } = useWebSocket();
    const navigate = useNavigate();
    const { accountData, updateAccount } = useAuth();
    const fileRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const postInputRef = useRef<any>(null);
    const [postText, setPostText] = useState('');
    const [postFiles, setPostFiles] = useState<FileList>([]);
    const [postFilesHidden, setPostFilesHidden] = useState<boolean>(true);
    const [postFilesImages, setPostFilesImages] = useState<boolean>(false);
    const [postSettingsOpen, setPostSettingsOpen] = useState<boolean>(false);
    const [fsClearMetadata, setFsClearMetadata] = useState<boolean>(false);
    const [fsCensoring, setFsCensoring] = useState<boolean>(false);
    const [changeAccountOpen, setChangeAccountOpen] = useState(false);
    const [createChannelOpen, setCreateAccountOpen] = useState(false);
    const [epIsOpen, setEpIsOpen] = useState(false);
    const emojiButtonRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const loadFiles = async () => {
        const fileBuffers: any = [];
    
        for (let i = 0; i < postFiles.length; i++) {
            const file = postFiles[i];
            const buffer = await file.arrayBuffer();
    
            fileBuffers.push({
                name: file.name,
                buffer: new Uint8Array(buffer)
            });
        }
    
        return fileBuffers;
    };

    const addPost = async () => {
        setLoading(true);

        let payload: any = {
            text: postText,
            files: await loadFiles(),
            from: accountData.selectedChannel ? { type: 1, id: accountData.selectedChannel.id } : null,
            settings: {
                clear_metadata_img: fsClearMetadata,
                censoring_img: fsCensoring,
            }
        }

        if (isWall) {
            payload.type = 'wall';
            payload.wall = {};
            payload.wall.username = wallUsername;
        }

        wsClient.send({
            type: 'social',
            action: 'posts/add',
            payload: payload
        }).then((res) => {
            console.log(res);
            setLoading(false);
            if (res.status === 'success') {
                setPostFilesHidden(true);
                setPostSettingsOpen(false);
                setPostFilesImages(false);
                setPostText('');
                setPostFiles([]);
                onSend();
            } else if (res.status === 'error') {
                openModal({
                    type: 'info',
                    title: t('error'),
                    text: res.message
                });
            }
        });
    };

    const processFiles = useCallback((files: FileList) => {
        const filesArray = Array.from(files);
        let hasImages = false;
        
        if (filesArray.length === 0) return;
        
        if (hasImages) {
            setPostFilesImages(true);
        }

        if (postFiles.length > 0) {
            setPostFiles([...postFiles, ...filesArray]);
        } else {
            setPostFiles(filesArray);
        }

        if (postFilesHidden) {
            setPostFilesHidden(false);
        }
    }, [postFiles, postFilesHidden, postFilesImages, openModal]);

    const handleInputPaste = useCallback((e?: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (e) {
            const clipboardData = e.clipboardData;
            
            const text = clipboardData.getData('text/plain');
            if (text) {
                return; 
            }
            
            if (clipboardData.files && clipboardData.files.length > 0) {
                e.preventDefault(); 
                processFiles(clipboardData.files);
            }
        } 
        else {
            navigator.clipboard.read()
                .then(items => {
                    let hasFiles = false;
                    
                    for (const item of items) {
                        for (const type of item.types) {
                            if (type.startsWith('image/')) {
                                hasFiles = true;
                                item.getType(type).then(blob => {
                                    const file = new File([blob], `pasted-image-${Date.now()}.${type.split('/')[1]}`, { type });
                                    processFiles([file] as unknown as FileList);
                                });
                            }
                        }
                    }
                    
                    if (!hasFiles) {
                        navigator.clipboard.readText()
                            .then(text => {
                                if (text && postInputRef.current) {
                                    const start = postInputRef.current.selectionStart;
                                    const end = postInputRef.current.selectionEnd;
                                    const newText = postText.substring(0, start) + text + postText.substring(end);
                                    setPostText(newText);
                                }
                            })
                    }
                })
                .catch(err => {
                    navigator.clipboard.readText()
                        .then(text => {
                            if (text && postInputRef.current) {
                                const start = postInputRef.current.selectionStart;
                                const end = postInputRef.current.selectionEnd;
                                const newText = postText.substring(0, start) + text + postText.substring(end);
                                setPostText(newText);
                            }
                        })
                });
        }
    }, [postText, processFiles, postInputRef]);

    const handleFilesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    };

    const handleFileRemove = useCallback(
        async (i: number) => {
            const updatedFiles = Array.from(postFiles).filter((_, index) => index !== i);
            if (fileRefs.current[i]) {
                AnimateElement(fileRefs.current[i], 'FILE_INPUT-DELETE', 0.2);
            }
            await new Promise((resolve) => setTimeout(resolve, 200));
            setPostFiles(updatedFiles);
            
            if (updatedFiles.length === 0) {
                if (postSettingsOpen) {
                    Animate('#AP-FS_BUTTON', 'AP-FILE_SETTINGS-NOTACTIVE', 0.2);
                    Animate('#AP-FILES_SETTINGS', 'ELEMENT-HIDE', 0.2);
                    setPostSettingsOpen(false);
                }
                
                const universalPanel = document.querySelector('.UI-UniversalPanel');
                if (universalPanel) {
                    Animate('.UI-UniversalPanel', 'ELEMENT-HIDE', 0.2);
                }
                
                setPostFilesImages(false);
                setPostFilesHidden(true);
            }
        },
        [postFiles, postSettingsOpen]
    );

    const toggleFilesSettings = () => {
        setPostSettingsOpen(!postSettingsOpen);
    };
    const handleFsClearMetadata = () => {
        setFsClearMetadata(!fsClearMetadata);
    };
    const handleFsCensoring = () => {
        setFsCensoring(!fsCensoring);
    };

    const selectChannel = (channel) => {
        updateAccount({ selectedChannel: channel });
    };

    const clearContent = () => {
        setPostText('');
        setPostFiles([]);
        if (postFiles.length > 0) {
            setPostFilesHidden(true);
            setPostSettingsOpen(false);
            setPostFilesImages(false);
            Animate('.UI-UniversalPanel', 'ELEMENT-HIDE', 0.2);
        }
    };

    const goToChannel = () => {
        if (accountData.selectedChannel) {
            navigate(`/e/${accountData.selectedChannel.username}`);
        }
    };

    const contextMenuItems = [
        {
            icon: <I_CLEAR />,
            title: t('clear_content'),
            onClick: clearContent
        },
        {
            icon: <I_ADD_FILE />,
            title: t('paste'),
            onClick: handleInputPaste
        },
        ...(accountData.selectedChannel ? [{
            icon: <I_AVATAR />,
            title: (
                <div className="ChannelMenuItem">
                    <Avatar 
                        avatar={accountData.selectedChannel.avatar}
                        name={accountData.selectedChannel.name}
                        size="small"
                    />
                    <span>{accountData.selectedChannel.name}</span>
                </div>
            ),
            onClick: goToChannel
        }] : [])
    ];

    return (
        <>
            <ContextMenu 
                items={contextMenuItems as any}
                className="AddPostContextMenu"
            >
                <DragDropArea 
                    className="UI-Block UI-AddPost"
                    onFilesDrop={processFiles}
                >
                    <div className="PostContent">
                        <SocialInput
                            value={postText}
                            onChange={(e) => {
                                setPostText(e.target.value);
                            }}
                            maxLength={3400}
                            ref={postInputRef}
                            onEnter={addPost}
                            onPaste={handleInputPaste}
                            placeholder={inputPlaceholder}
                            preview={true}
                            emojis={true}
                            markdown={true}
                            links={true}
                            urls={true}
                        />
                        
                        {postFiles.length > 0 && (
                            <div className="AttachedFiles">
                                <div className="ScrollContainer">
                                    {Array.from(postFiles).map((file, i) => (
                                        <FilePreview 
                                            key={file.name + i} 
                                            file={file} 
                                            index={i} 
                                            onRemove={handleFileRemove}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="Buttons">
                        <div style={{ gap: '5px', display: 'flex' }}>
                            <button
                                onClick={() => {
                                    setChangeAccountOpen(!changeAccountOpen);
                                }}
                                className="SelectAccount"
                            >
                                <Avatar
                                    avatar={accountData.selectedChannel ? accountData.selectedChannel.avatar : accountData.avatar}
                                    name={accountData.selectedChannel ? accountData.selectedChannel.name : accountData.name}
                                />
                            </button>
                            <FormButton
                                title={t('add_post_button')}
                                onClick={addPost}
                                className="Send"
                                isLoading={loading}
                            />
                        </div>
                        <input id="AP-FILE_INPUT" onChange={handleFilesInput} type="file" multiple></input>
                        <div className="AddFileButtons">
                            <button
                                onClick={() => {
                                    navigate('music');
                                }}
                            >
                                <I_MUSIC />
                            </button>
                            <label htmlFor="AP-FILE_INPUT">
                                <I_ADD_FILE />
                            </label>
                            {postFilesImages && (
                                <button onClick={toggleFilesSettings} id="AP-FS_BUTTON">
                                    <I_SETTINGS />
                                </button>
                            )}
                            <button
                                ref={emojiButtonRef}
                                onClick={() => {
                                    setEpIsOpen(true);
                                }}
                            >
                                <I_SMILE />
                            </button>
                        </div>
                    </div>

                    <EmojiPicker
                        isOpen={epIsOpen}
                        setIsOpen={setEpIsOpen}
                        buttonRef={emojiButtonRef}
                        inputRef={postInputRef}
                        onEmojiSelect={(emoji: string) => {
                            setPostText(prevText => prevText + emoji);
                        }}
                    />

                    {/* Настройка файлов */}
                    <UniversalPanel isOpen={postSettingsOpen}>
                        <div className="Item">
                            <input id="AP-CI" type="checkbox" style={{ display: 'none' }} />
                            Очистить метаданные
                            <label
                                onClick={handleFsClearMetadata}
                                htmlFor="AP-CI"
                                className={`UI-Switch ${fsClearMetadata ? 'UI-Switch-On' : ''}`}
                            ></label>
                        </div>
                        <div className="Item">
                            <input id="AP-CMI" type="checkbox" style={{ display: 'none' }} />
                            Деликатный контент
                            <label
                                onClick={handleFsCensoring}
                                htmlFor="AP-CMI"
                                className={`UI-Switch ${fsCensoring ? 'UI-Switch-On' : ''}`}
                            ></label>
                        </div>
                    </UniversalPanel>
                    
                    {/* Выбор аккаунта */}
                    <UniversalPanel className="AddPost-SelectFrom" isOpen={changeAccountOpen}>
                        <>
                            <div className="Title">Написать от имени...</div>
                            <div className="Accounts">
                                <button
                                    onClick={() => {
                                        selectChannel(false);
                                    }}
                                    className={classNames('Account', { 'Selected': !accountData.selectedChannel })}
                                >
                                    <Avatar
                                        avatar={accountData.avatar}
                                        name={accountData.name}
                                    />
                                    {accountData.name}
                                </button>
                                {accountData?.channels?.length > 0 &&
                                    accountData.channels.map((channel, i) => (
                                        <button
                                            key={channel.id}
                                            onClick={() => {
                                                selectChannel(channel);
                                            }}
                                            className={classNames('Account', { 'Selected': accountData.selectedChannel && accountData.selectedChannel.id === channel.id })}
                                        >
                                            <Avatar
                                                avatar={channel.avatar}
                                                name={channel.name}
                                            />
                                            {channel.name}
                                        </button>
                                    ))}
                                <button
                                    onClick={() => {
                                        setCreateAccountOpen(true);
                                    }}
                                    className="Account"
                                >
                                    <div style={{ background: 'rgb(255 255 255 / 0%)' }} className="Avatar">
                                        <I_PLUS style={{ fill: 'var(--TEXT_COLOR)' }} />
                                    </div>
                                    Создать канал
                                </button>
                            </div>
                        </>
                    </UniversalPanel>
                </DragDropArea>
            </ContextMenu>
            <Window
                title="Создать канал"
                content={<CreateChannel />}
                contentClass="MultiForm"
                style={{ width: 'fit-content' }}
                isOpen={createChannelOpen}
                setOpen={setCreateAccountOpen}
            />
        </>
    );
};

export default AddPost;