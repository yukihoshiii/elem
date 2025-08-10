import { useState } from 'react';
import { motion } from 'framer-motion';
import { HandleText, HandleTimeAge, HandleUserIcons } from "../../../System/Elements/Handlers";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../System/Hooks/useAuth';
import { I_DELETE, I_DOTS, I_REPLY } from '../../../System/UI/IconPack';
import { GovernButtons } from '../../../System/Modules/UIKit';
import { Avatar, Name } from '../../../UIKit';
import { useNavigate } from 'react-router-dom';
import UserContentImage from '../../Handlers/UserContent/UserContentImage';
import UserContentImages from '../../Handlers/UserContent/UserContentImages';
import UserContentFile from '../../Handlers/UserContent/UserContentFile';
import { useWebSocket } from '../../../System/Context/WebSocket';
import { usePostModal } from '../../../System/Context/PostModal';

const Reply = ({ reply, closeModalAndNavigate }) => {
    const getColor = (author, opacity) => {
        if (author.avatar && author.avatar.aura) {
            return author.avatar.aura.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
        }

        return 'var(--REPLY_BG)';
    }

    return (
        <div style={{ background: getColor(reply.author, 0.2) }} className="Reply">
            <div className="Userdata">
                <div onClick={() => closeModalAndNavigate(`/e/${reply.author.username}`)}>
                    <Avatar
                        avatar={reply.author.avatar}
                        name={reply.author.name}
                    />
                </div>
                <div onClick={() => closeModalAndNavigate(`/e/${reply.author.username}`)}>
                    <Name
                        name={reply.author.name}
                        icons={reply.author.icons}
                    />
                </div>
            </div>
            {reply.text && (
                <div className="ReplyText">
                    <HandleText text={reply.text} />
                </div>
            )}
            <svg style={{ fill: reply.author?.avatar?.aura ? getColor(reply.author, 0.3) : 'var(--REPLY_SVG_COLOR)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,9.5H7.41l1.3-1.29A1,1,0,0,0,7.29,6.79l-3,3a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l3,3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L7.41,11.5H17a1,1,0,0,1,1,1v4a1,1,0,0,0,2,0v-4A3,3,0,0,0,17,9.5Z" /></svg>
        </div>
    )
}

const Comment = ({ comment, onReplyClick, onDelete, isInModal = true }) => {
    const { t } = useTranslation();
    const { wsClient } = useWebSocket();
    const { accountData } = useAuth();
    const { closePostModal } = usePostModal();
    const navigate = useNavigate();
    const [governIsOpen, setGovernIsOpen] = useState(false);

    // Текст
    const [textIsShow, setTextIsShow] = useState(false);

    const closeModalAndNavigate = (path) => {
        if (isInModal) {
            closePostModal();
            setTimeout(() => {
                navigate(path);
            }, 100);
        } else {
            navigate(path);
        }
    };

    const handleReply = () => {
        onReplyClick({
            id: comment.id,
            aura: comment.author?.avatar?.aura ? comment.author.avatar.aura : null,
            name: comment.author.name,
            icons: comment.user_icons,
            text: comment.text
        });
    };

    const handleDelete = () => {
        wsClient.send({
            type: 'social',
            action: 'comments/delete',
            payload: {
                comment_id: comment.id
            }
        }).then((res) => {
            if (res.status === 'success') {
                onDelete();
            }
        })
    };

    const govern = [
        {
            title: t('reply'),
            icon: <I_REPLY />,
            onClick: handleReply
        },
        ...(comment.author.id === accountData.id
            ? [{
                title: t('delete'),
                icon: <I_DELETE />,
                onClick: handleDelete
            }]
            : [])
    ]

    const showText = () => {
        setTextIsShow(true);
    }

    return (
        <div className={`UI-Block Comment`}>
            <div className="TopBar">
                <div className="Info">
                    <div onClick={() => closeModalAndNavigate(`/e/${comment.author.username}`)}>
                        <Avatar
                            avatar={comment.author.avatar}
                            name={comment.author.name}
                        />
                    </div>
                    <div className="InfoBody">
                        <div className="UI-NameBody">
                            <div onClick={() => closeModalAndNavigate(`/e/${comment.author.username}`)} className="Name">
                                {comment.author.name}
                            </div>
                            {comment.author.icons && (
                                <HandleUserIcons icons={comment.author.icons} />
                            )}
                        </div>
                        <div className="Date"><HandleTimeAge inputDate={comment.date} /></div>
                    </div>
                </div>
                <button onClick={() => { setGovernIsOpen(!governIsOpen) }} className="GovernButton"><I_DOTS /></button>
                <GovernButtons isOpen={governIsOpen} buttons={govern} />
            </div>
            {comment.content && comment.content.reply && (
                <Reply 
                    reply={comment.content.reply} 
                    closeModalAndNavigate={closeModalAndNavigate}
                />
            )}
            {/* Текст комментария */}
            <motion.div
                className="Text"
                style={{ maxHeight: comment.text.length > 700 ? '300px' : 'none' }}
                animate={{ maxHeight: textIsShow ? '10000px' : 'auto' }}
            >
                <HandleText text={comment.text} />
                {
                    comment.text.length > 700 && (
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
            {comment.content && (
                <>
                    {comment.content.images && comment.content.images.length > 0 && (
                        comment.content.images.length === 1 ? (
                            <UserContentImage image={comment.content.images[0]} censoring={comment.content.censoring} />
                        ) : (
                            <UserContentImages images={comment.content.images} censoring={comment.content.censoring} />
                        )
                    )}
                    {comment.content.files && (
                        comment.content.files.map((file) => (
                            <UserContentFile file={file} />
                        ))
                    )}
                </>
            )}
        </div>
    )
}

export default Comment;