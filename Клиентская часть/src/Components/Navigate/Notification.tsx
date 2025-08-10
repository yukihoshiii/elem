import { useNavigate } from 'react-router-dom';
import { HandleTimeAge } from '../../System/Elements/Handlers';
import { Avatar } from '../../UIKit';
import classNames from 'classnames';

const Notification = ({ notification }) => {
    const navigate = useNavigate();

    const HandleAction = ({ action, content }) => {
        switch (action) {
            case 'PostLike':
                return 'ставит лайк на пост';
            case 'PostDislike':
                return 'ставит дизлайк на пост';
            case 'PostComment':
                if (content) {
                    if (content.Text.length > 0) {
                        return 'комментирует ваш пост «' + content.Text + '»';
                    } else {
                        return 'комментирует ваш пост';
                    }
                } else {
                    return 'комментирует ваш пост';
                }
            case 'ProfileSubscribe':
                return 'подписывается на вас';
            case 'ProfileUnsubscribe':
                return 'больше не ваш подписчик.';
        }
    }

    // @ts-ignore
    const HandleIcon = ({ action }) => {
        switch (action) {
            case 'PostLike':
                return (
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m462.3 62.6c-54.8-46.7-136.3-38.3-186.6 13.6l-19.7 20.3-19.7-20.3c-50.2-51.9-131.8-60.3-186.6-13.6-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" /></svg>
                )
            case 'PostDislike':
                return (
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m473.7 73.8-2.4-2.5c-46-47-118-51.7-169.6-14.8l34.3 103.4-96 64 48 128-144-144 96-64-28.6-86.5c-51.7-37.8-124.4-33.4-170.7 14l-2.4 2.4c-48.7 49.8-50.8 129.1-7.3 182.2l212.1 218.6c7.1 7.3 18.6 7.3 25.7 0l212.2-218.7c43.5-53 41.4-132.3-7.3-182.1z" /></svg>
                )
            case 'PostComment':
                return (
                    <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="m3 1c-1.10457 0-2 .89543-2 2v4c0 1.10457.89543 2 2 2v1.5c0 .1844.10149.3538.26407.4408s.35985.0775.51328-.0248l2.87404-1.916h2.34861c1.1046 0 2-.89543 2-2v-4c0-1.10457-.8954-2-2-2z" /></svg>
                )
            case 'ProfileSubscribe':
                return (
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m416 208h-144v-144c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144h-144c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-144h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
                )
            case 'ProfileUnsubscribe':
                return (
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m416 208h-384c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
                )
        }
    }
    // @ts-ignore
    const handleClick = ({ action, content }) => {
        switch (action) {
            case 'PostLike':
                navigate(`/post/${content}`)
                break;
            case 'PostDislike':
                navigate(`/post/${content}`)
                break;
            case 'PostComment':
                navigate(`/post/${content.PostID}`)
                break;
            case 'ProfileSubscribe':
                navigate(`/e/${content}`)
                break;
        }
    }

    return (
        <button
            onClick={() => handleClick({ action: notification.action, content: notification.content })}
            className={classNames('Notifications-Notification', {
                'Notifications-NewNotification': !notification.viewed
            })}
        >
            <div className="AvatarContainer">
                <Avatar
                    avatar={notification.author.avatar}
                    name={notification.author.name}
                />
                <HandleIcon action={notification.action} />
            </div>
            <div className="NotificationContent">
                <div className="Title">{notification.author.name}</div>
                <div className="Text">
                    <HandleAction action={notification.action} content={notification.content} />
                </div>
            </div>
            <div className="Date"><HandleTimeAge inputDate={notification.date} /></div>
        </button>
    )
}

export default Notification;