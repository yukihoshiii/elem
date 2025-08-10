import { useTranslation } from 'react-i18next';
import { useWebSocket } from '../../System/Context/WebSocket';
import { useAuth } from '../../System/Hooks/useAuth';
import { useModal } from '../../System/Context/Modal';
import { useRef, useState, useEffect, useCallback, memo } from 'react';
import BaseConfig from '../../Configs/Base';
import { I_BACK, I_BLOCK, I_COMMENT, I_COPY, I_DELETE, I_DOTS, I_DOWNLOAD, I_DOWNLOAD_EPACK, I_SHARE } from '../../System/UI/IconPack';
import { Avatar, ContextMenu } from '../../UIKit';
import { useNavigate } from 'react-router-dom';
import { HandleText, HandleTimeAge, HandleUserIcons } from '../../System/Elements/Handlers';
import { GovernButtons } from '../../System/Modules/UIKit';
import { AnimatePresence, motion } from 'framer-motion';
import Interaction from './Components/Interaction';
import UserContentImage from '../Handlers/UserContent/UserContentImage';
import UserContentImages from '../Handlers/UserContent/UserContentImages';
import UserContentFile from '../Handlers/UserContent/UserContentFile';
import { usePostModal } from '../../System/Context/PostModal';
import { downloadBlob } from '../../System/Elements/Function';
import classNames from 'classnames';

interface LikeHeart {
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
}

interface PostInfoProps {
    avatar: string | null;
    name: string;
    username: string;
    icons?: string;
    createDate: string;
    isInModal?: boolean;
}

const MemoizedPostInfo = memo(({ avatar, name, username, icons, createDate, isInModal }: PostInfoProps) => {
    const navigate = useNavigate();
    const { closePostModal } = usePostModal();
    
    const navigateToProfile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isInModal) {
            closePostModal();
            setTimeout(() => {
                navigate(`/e/${username}`);
            }, 100);
        } else {
            navigate(`/e/${username}`);
        }
    };
    
    return (
        <div className="Info">
            <div onClick={navigateToProfile}>
                <Avatar
                    avatar={avatar}
                    name={name}
                />
            </div>
            <div className="InfoBody">
                <div className="UI-NameBody">
                    <div onClick={navigateToProfile} className="Name">
                        {name}
                    </div>
                    {icons && (
                        <HandleUserIcons icons={icons} />
                    )}
                </div>
                <div className="Date"><HandleTimeAge inputDate={createDate} /></div>
            </div>
        </div>
    );
});

const Comments = ({ comments, pid }) => {
    const { t } = useTranslation();
    const { openPostModal } = usePostModal();

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPostModal(pid);
    };

    return (
        <button className="InteractionButton" onClick={handleClick}>
            <I_COMMENT />
            <div>{comments < 1 ? t('comment_button') : comments}</div>
        </button>
    );
};

const HeartIcon = () => {
    const theme = localStorage.getItem('S-Theme') || 'DEFAULT';

    const getGradientId = () => {
        if (theme.includes('GOLD')) return 'goldGradient';
        if (theme.includes('DARK') || theme.includes('AMOLED')) return 'darkGradient';
        return 'defaultGradient';
    };

    return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
            <defs>
                {/* Золотой градиент */}
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fab31e" />
                    <stop offset="100%" stopColor="#fd9347" />
                </linearGradient>

                {/* Темный градиент */}
                <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9c5fff" />
                    <stop offset="100%" stopColor="#6b40ff" />
                </linearGradient>

                {/* Градиент по умолчанию */}
                <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff5a7e" />
                    <stop offset="100%" stopColor="#ff3e66" />
                </linearGradient>
            </defs>
            <path
                fill={`url(#${getGradientId()})`}
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
        </svg>
    );
};

const Post = ({ post, className, onDelete, isInModal = false }: { post: any, className?: string, onDelete?: (res: any, id: number) => void, isInModal?: boolean }) => {
    const { wsClient } = useWebSocket();
    const { t } = useTranslation();
    const { accountData } = useAuth();
    const { openPostModal } = usePostModal();
    const { openModal } = useModal();
    const avatar = post?.author?.avatar || null;
    const name = post?.author?.name || null;
    const myPost = post.my_post || false;
    const content = post.content;
    const postRef = useRef<HTMLDivElement>(null);

    const [likeHearts, setLikeHearts] = useState<LikeHeart[]>([]);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(post.liked);
    const [dislikesCount, setDislikesCount] = useState(post.dislikes);
    const [isDisliked, setIsDisliked] = useState(post.disliked);
    const processingLikeRef = useRef(false);

    useEffect(() => {
        setLikesCount(post.likes);
        setIsLiked(post.liked);
        setDislikesCount(post.dislikes);
        setIsDisliked(post.disliked);
    }, [post.likes, post.liked, post.dislikes, post.disliked]);

    const shareAnimation = {
        show: {
            x: '0%',
            opacity: 1,
            transition: {
                duration: 0.2,
            },
        },
        hide: {
            x: '-100%',
            opacity: 0,
            transition: {
                duration: 0.2,
            },
        }
    }

    const [textIsShow, setTextIsShow] = useState(false);
    const shareInputRef = useRef<HTMLInputElement>(null);
    const [shareOpen, setShareOpen] = useState(false);
    const [governIsOpen, setGovernIsOpen] = useState(false);

    const showText = () => {
        setTextIsShow(true);
    }

    const openShare = () => {
        setShareOpen(true);
    }

    const closeShare = () => {
        setShareOpen(false);
    }

    const copyURL = () => {
        if (shareInputRef.current) {
            navigator.clipboard.writeText(shareInputRef.current.value);
        }
    }

    const deletePost = () => {
        wsClient.send({
            type: 'social',
            action: 'posts/delete',
            payload: {
                post_id: post.id
            }
        }).then((res: any) => {
            console.log(res);
            if (onDelete) onDelete(res, post.id);
        })
    }

    const blockUser = () => {
        if (!post?.author?.blocked) {
            wsClient.send({
                type: 'social',
                action: 'block_profile',
                username: post.author.username
            }).then((res: any) => {
                if (res.status === 'success') {
                    openModal({
                        type: 'info',
                        title: 'Пользователь заблокирован',
                        text: 'Вы больше не увидите посты этого пользователя'
                    })
                } else if (res.status === 'error') {
                    openModal({
                        type: 'info',
                        title: t('error'),
                        text: res.message
                    })
                }
            })
        } else {
            wsClient.send({
                type: 'social',
                action: 'unblock_profile',
                username: post.author.username
            }).then((res: any) => {
                if (res.status === 'success') {
                    openModal({
                        type: 'info',
                        title: 'Пользователь разблокирован',
                        text: 'Вы снова увидите посты этого пользователя'
                    })
                } else if (res.status === 'error') {
                    openModal({
                        type: 'info',
                        title: t('error'),
                        text: res.message
                    })
                }
            })
        }
    }

    const createEPACK = () => {
        openModal({
            type: 'info',
            title: t('error'),
            text: 'Это пока что не работает, ждите'
        })
    }

    const downloadImage = async () => {
        try {
            const response = await fetch(`${BaseConfig.domains.cdn}/Content/Posts/Images/${content.Image.file_name}`);
            if (!response.ok) throw new Error(`Ошибка загрузки: ${response.statusText}`);

            const fileName = content.Image.orig_name || content.Image.file_name || 'image.jpg';

            const blob = await response.blob();
            downloadBlob(blob, fileName)
        } catch (error) {
            openModal({
                type: 'info',
                title: t('error'),
                text: `Ошибка при скачивании изображения: ${error}`
            });
        }
    };

    const downloadFirstImage = async () => {
        try {
            const response = await fetch(`${BaseConfig.domains.cdn}/Content/Posts/Images/${content.images[0].file_name}`);
            if (!response.ok) throw new Error(`Ошибка загрузки: ${response.statusText}`);

            const blob = await response.blob();
            downloadBlob(blob, content.images[0].orig_name || content.images[0].file_name)
        } catch (error) {
            openModal({
                type: 'info',
                title: t('error'),
                text: `Ошибка при скачивании изображения: ${error}`
            });
        }
    };

    const sharePost = () => {
        navigator.clipboard.writeText(`${BaseConfig.domains.share}/post/${post.id}`);
        openModal({
            type: 'info',
            title: t('success'),
            text: t('link_copied')
        });
    };

    const contextMenuItems = [
        ...(content && typeof content === 'object' && content.type === 'image' && content.file ? [{
            icon: <I_DOWNLOAD />,
            title: t('download_image'),
            onClick: downloadImage
        }] : []),
        ...(content && typeof content === 'object' && content.Image ? [{
            icon: <I_DOWNLOAD />,
            title: t('download_image'),
            onClick: downloadImage
        }] : []),
        ...(content && typeof content === 'object' && content.images && content.images.length > 0 ? [{
            icon: <I_DOWNLOAD />,
            title: t('download_first_image'),
            onClick: downloadFirstImage
        }] : []),
        {
            icon: <I_SHARE />,
            title: t('share'),
            onClick: sharePost
        },
        {
            icon: <I_DOWNLOAD_EPACK />,
            title: t('save_EPACK'),
            onClick: createEPACK,
            divider: true
        },
        ...(myPost === true || accountData?.permissions?.Admin === true
            ? [{
                icon: <I_DELETE />,
                title: t('delete'),
                onClick: deletePost
            }]
            : []),
        ...(myPost === false ? [{
            icon: <I_BLOCK />,
            title: !post?.author?.blocked ? t('block') : t('unblock'),
            onClick: blockUser
        }] : [])
    ];

    const govern = [
        {
            title: t('save_EPACK'),
            icon: <I_DOWNLOAD_EPACK />,
            onClick: createEPACK
        },
        ...(myPost === true || accountData?.permissions?.Admin === true
            ? [{
                title: t('delete'),
                icon: <I_DELETE />,
                onClick: deletePost
            }]
            : []),
        ...(myPost === false ? [{
            title: !post?.author?.blocked ? t('block') : t('unblock'),
            icon: <I_BLOCK />,
            onClick: blockUser
        }] : [])
    ];

    const removeHeart = useCallback((heartId: number) => {
        setLikeHearts(prev => prev.filter(heart => heart.id !== heartId));
    }, []);

    const createLikeHeart = useCallback((x: number, y: number): LikeHeart => {
        const rotation = Math.random() * 60 - 30;
        const scale = 0.8 + Math.random() * 0.4;
        const id = Date.now() + Math.random();

        return {
            id,
            x,
            y,
            rotation,
            scale,
            opacity: 1
        };
    }, []);

    const addNewHeart = useCallback((x: number, y: number) => {
        const newHeart = createLikeHeart(x, y);
        setLikeHearts(prev => [...prev, newHeart]);

        setTimeout(() => {
            removeHeart(newHeart.id);
        }, 1000);
    }, [createLikeHeart, removeHeart]);

    const handleLike = useCallback(() => {
        if (processingLikeRef.current) return;
        processingLikeRef.current = true;

        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(prev => !prev);

        if (post.disliked || isDisliked) {
            setDislikesCount(prev => Math.max(prev - 1, 0));
            setIsDisliked(false);
        }

        wsClient.send({
            type: 'social',
            action: 'posts/like',
            payload: {
                post_id: post.id
            }
        });

        setTimeout(() => {
            processingLikeRef.current = false;
        }, 300);
    }, [post.id, isLiked, post.disliked, isDisliked]);

    const lastTapTimeRef = useRef(0);

    const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!postRef.current) return;

        const rect = postRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        addNewHeart(x, y);

        if (!isLiked) {
            handleLike();
        }
    }, [addNewHeart, handleLike, isLiked]);

    const touchStartRef = useRef(0);
    const lastTouchPosRef = useRef({ x: 0, y: 0 });

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        touchStartRef.current = new Date().getTime();
        const touch = e.touches[0];
        if (touch && postRef.current) {
            const rect = postRef.current.getBoundingClientRect();
            lastTouchPosRef.current = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        }
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        const touchDuration = new Date().getTime() - touchStartRef.current;

        if (touchDuration > 300 || !postRef.current) return;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTimeRef.current;

        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();

            addNewHeart(lastTouchPosRef.current.x, lastTouchPosRef.current.y);

            if (!isLiked) {
                handleLike();
            }
        }

        lastTapTimeRef.current = currentTime;
    }, [addNewHeart, handleLike, isLiked]);

    const onLikeFromPanel = useCallback(() => {
        if (processingLikeRef.current) return;
        processingLikeRef.current = true;

        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(prev => !prev);

        if (!isLiked && isDisliked) {
            setDislikesCount(prev => Math.max(prev - 1, 0));
            setIsDisliked(false);
        }

        wsClient.send({
            type: 'social',
            action: 'posts/like',
            payload: {
                post_id: post.id
            }
        });

        setTimeout(() => {
            processingLikeRef.current = false;
        }, 300);
    }, [isLiked, isDisliked, post.id]);

    const onDislikeFromPanel = useCallback(() => {
        if (processingLikeRef.current) return;
        processingLikeRef.current = true;

        setDislikesCount(prev => isDisliked ? prev - 1 : prev + 1);
        setIsDisliked(prev => !prev);

        if (!isDisliked && isLiked) {
            setLikesCount(prev => Math.max(prev - 1, 0));
            setIsLiked(false);
        }

        wsClient.send({
            type: 'social',
            action: 'posts/dislike',
            payload: {
                post_id: post.id
            }
        });

        setTimeout(() => {
            processingLikeRef.current = false;
        }, 300);
    }, [isDisliked, isLiked, post.id]);

    const handlePostClick = (e) => {
        if (e.target.closest('.Post') === postRef.current &&
            !e.target.closest('.InteractionButton') &&
            !e.target.closest('a') &&
            !e.target.closest('button')) {
            e.preventDefault();
            openPostModal(post.id);
        }
    };

    return (
        <ContextMenu
            items={contextMenuItems}
            className={classNames('UI-Block', 'Post', className)}
        >
            <div
                ref={postRef}
                onDoubleClick={handleDoubleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={handlePostClick}
            >
                <div className="TopBar">
                    <MemoizedPostInfo
                        avatar={avatar}
                        name={name}
                        username={post.author.username}
                        icons={post.author?.icons}
                        createDate={post.create_date}
                        isInModal={isInModal}
                    />
                    <button onClick={() => { setGovernIsOpen(!governIsOpen) }} className="GovernButton"><I_DOTS /></button>
                    <GovernButtons isOpen={governIsOpen} buttons={govern} />
                </div>

                <motion.div
                    className="Text"
                    style={{ maxHeight: post.text.length > 700 ? '300px' : 'none' }}
                    animate={{ maxHeight: textIsShow ? '10000px' : 'auto' }}
                >

                    <HandleText text={post.text} />

                    {
                        (post.text.length > 700 && !textIsShow) && (
                            <motion.div
                                onClick={showText}
                                className="ShowMore"
                                animate={{ opacity: textIsShow ? 0 : 1 }}
                            >
                                <button>Полный текст</button>
                            </motion.div>
                        )
                    }
                </motion.div>

                {content && (
                    <>
                        {content.images && content.images.length > 0 && (
                            content.images.length === 1 ? (
                                <UserContentImage image={content.images[0]} censoring={content.censoring} />
                        ) : (
                                <UserContentImages images={content.images} censoring={content.censoring} />
                            )
                        )}
                        {content.files && ( 
                            content.files.map((file) => (
                                <UserContentFile file={file} />
                            ))
                        )}
                        {content.videos && (
                            <div style={{ textAlign: 'center', marginBottom: '10px', opacity: 0.8 }} >
                                Видео пока что не работают, ждите
                            </div>
                        )}
                        {content.songs && (
                            // <UserContentSong song={content.Song} />
                            <div style={{ textAlign: 'center', marginBottom: '10px', opacity: 0.8 }} >
                                Музыка пока что не работает, ждите
                            </div>
                        )}
                    </>
                )}

                <div className="InteractionContainer">
                    <motion.div
                        className="InteractionScroll"
                        animate={{
                            scale: shareOpen ? 0.5 : 1
                        }}
                    >
                        <div className="InteractionButtons">
                            <Interaction
                                likes={likesCount}
                                liked={isLiked}
                                dislikes={dislikesCount}
                                disliked={isDisliked}
                                pid={post.id}
                                onLike={onLikeFromPanel}
                                onDislike={onDislikeFromPanel}
                            />
                            {!isInModal && <Comments comments={post.comments} pid={post.id} />}
                            <button onClick={openShare} className="InteractionButton Share"><I_SHARE />{t('share_button')}</button>
                        </div>
                    </motion.div>
                    <AnimatePresence>
                        {
                            shareOpen && (
                                <motion.div
                                    className="ShareImposition"
                                    initial="hide"
                                    animate="show"
                                    exit="hide"
                                    variants={shareAnimation}
                                >
                                    <div className="Interaction">
                                        <button onClick={closeShare} className="InteractionButton Back"><I_BACK />Назад</button>
                                        <div className="URL">
                                            <input ref={shareInputRef} type="Text" value={`${BaseConfig.domains.share}/post/${post.id}`} readOnly />
                                        </div>
                                        <button onClick={copyURL} className="CopyURL"><I_COPY /></button>
                                    </div>
                                </motion.div>
                            )
                        }
                    </AnimatePresence>
                </div>

                {likeHearts.length > 0 && (
                    <div className="LikeAnimation">
                        {likeHearts.map((heart) => (
                            <div
                                key={heart.id}
                                className="LikeHeart"
                                style={{
                                    left: `${heart.x}px`,
                                    top: `${heart.y}px`,
                                    transform: `rotate(${heart.rotation}deg)`,
                                    transformOrigin: 'center center'
                                }}
                            >
                                <HeartIcon />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ContextMenu>
    );
};

Post.defaultProps = {
    isInModal: false
};

export default memo(Post);